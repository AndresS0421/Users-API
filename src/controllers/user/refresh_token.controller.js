import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { get_session_service } from "../../services/user/auth/get_session.service.js";
import { update_session } from "../../services/user/auth/update_session.service.js";
import { VerificationError, get_response_error_data } from '../../lib/errors/get_response_error_data.js';

export async function refresh_token_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Obtain refresh token and session id from cookies
        const refresh_token = req.cookies.refresh_token;
        const session_id = req.cookies.session_id;

        
        if (!refresh_token || !session_id) {
            throw new VerificationError(400, "Invalid request body. Refresh token and session id are required in cookies.")
        }

        const { refresh_id } = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

        // Calling service to get session user
        const session = await get_session_service(session_id);

        if (!session) {
            throw new VerificationError(404, "Session not found.");
        }
  
        if (session.refresh_id !== refresh_id) {
            // TODO: Alert to backend team
            // The refresh token provided was an old token
            throw new VerificationError(400, "Refresh token invalid.")
        }

        // Validate company status.
        if (session.user.role !== "ADMIN" && session.user.merchant.company.status !== "APPROVED") {
            throw new VerificationError(401, "Company is not approved.");
        }

        const new_refresh_id = uuidv4();
        const access_token = jwt.sign({ id: session.user.id, role: session.user.role, company_id: session.user.merchant?.company.id ?? null, shopify_id: session.user.merchant?.company.shopify_id ?? null }, process.env.JWT_ACCESS_SECRET, { expiresIn: Number(process.env.ACCESS_TOKEN_AGE)/1000 });
        const new_refresh_token = jwt.sign({ id: session.user.id, refresh_id: new_refresh_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: Number(process.env.SESSION_AGE)/1000 });

        delete session.user.id;
        delete session.user.merchant?.company.id;
        delete session.user.merchant?.company.shopify_id;

        // Update refresh token id in database
        const updated_session = await update_session(session_id, {refresh_id: new_refresh_id, expires_at: new Date(new Date().getTime()+Number(process.env.SESSION_AGE))});

        if (!updated_session) {
            throw new VerificationError(400, "Server could not update refresh token in the database.")
        }

        return res.status(200)
            .cookie('refresh_token', new_refresh_token, {
                httpOnly: true,
                maxAge: Number(process.env.SESSION_AGE),
                sameSite: 'strict'
            })
            .cookie('session_id', session_id, {
                httpOnly: true,
                maxAge: Number(process.env.SESSION_AGE),
                sameSite: 'strict'
            })
            .json({successful: true, data: { ...session.user, access_token }});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}