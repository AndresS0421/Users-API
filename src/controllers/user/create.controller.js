import { create_service as create_user } from "../../services/user/create.service.js";
import { create_credential_service } from "../../services/user/credential.service.js";
import { hash_password } from "../../lib/hashing/hash_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function create_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Obtain user
        const user = req.body;
        
        // Check user parameters
        if (!user?.first_name || !user?.last_name || !user?.email || !user?.password) {
            throw new VerificationError(400, "First name, last name, email, password are required.");
        }

        // Always set role to USER for create endpoint
        user.role = "USER";

        // Hash password
        const hashed_password = await hash_password(user.password);
        if (!hashed_password) {
            throw new VerificationError(400, "User creation problems.");
        }

        // Create user (without password)
        const created_user = await create_user({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });

        // Create credential separately
        await create_credential_service(created_user.id, hashed_password);

        return res.status(201).json({
            successful: true, 
            message: "User created successfully",
            data: {
                id: created_user.id,
                first_name: created_user.first_name,
                last_name: created_user.last_name,
                email: created_user.email,
                role: created_user.role,
                created_at: created_user.created_at
            }
        });
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}