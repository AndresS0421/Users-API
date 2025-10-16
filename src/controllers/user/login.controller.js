import { get_by_email_service } from "../../services/user/get_by_email.service.js";
import { compare_password } from "../../lib/hashing/compare_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { create_session_service } from "../../services/user/auth/create_session.service.js";

export async function login_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Body type verification
        if (!req.is('application/json')) {
            throw new VerificationError(400, "Invalid request body type. It must be a JSON.");
        }

        const { email, password } = req.body

        // Check fields existance
        if (!email || !password) {
            throw new VerificationError(400, "Invalid request body. An email and password are required.")
        }

        // Calling service to get user with credential
        const user = await get_by_email_service(email);

        if (!user) {
            throw new VerificationError(400, "Email or password are wrong.")
        }

        // Validate password using the credential
        const is_valid_password = await compare_password(password, user.credential.credential)

        if (!is_valid_password) {
            throw new VerificationError(400, "Email or password are wrong.")
        }

        const refresh_id = uuidv4();
        const access_token = jwt.sign({
            id: user.id,
            role: user.role,
            email: user.email
        }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_AGE || '15m'
        });
        const refresh_token = jwt.sign({
            id: user.id,
            refresh_id: refresh_id
        }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_AGE || '7d'
        });

        // Create session in database
        const expires_at = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        const session = await create_session_service({
            user_id: user.id,
            refresh_id,
            expires_at: expires_at
        });

        if (!session) {
            throw new VerificationError(400, "Server could not create session in the database.")
        }

        // Prepare user data for response
        const user_data = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            access_token: access_token,
            refresh_token: refresh_token,
            session_id: session.id
        };

        return res.status(200)
            .cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                sameSite: 'strict'
            })
            .cookie('session_id', session.id, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                sameSite: 'strict'
            })
            .json({successful: true, data: user_data});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}