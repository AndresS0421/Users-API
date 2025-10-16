import { create_service as create_user } from "../../services/user/create.service.js";
import { hash_password } from "../../lib/hashing/hash_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function register_admin_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Body type verification
        if (!req.is('application/json')) {
            throw new VerificationError(400, "Invalid request body type. It must be a JSON.");
        }

        // Obtain user data
        const user = req.body;
        
        // Check user parameters
        if (!user?.first_name || !user?.last_name || !user?.email || !user?.password) {
            throw new VerificationError(400, "First name, last name, email, and password are required.");
        }

        // Set role to ADMIN
        user.role = "ADMIN";

        // Hash password
        const hashed_password = await hash_password(user.password);
        if (!hashed_password) {
            throw new VerificationError(400, "User creation problems.");
        }

        user.password = hashed_password;

        // Create admin user
        const created_admin = await create_user(user);

        // Remove sensitive data from response
        delete created_admin.credential;

        return res.status(201).json({
            successful: true, 
            message: "Admin user created successfully",
            data: {
                id: created_admin.id,
                first_name: created_admin.first_name,
                last_name: created_admin.last_name,
                email: created_admin.email,
                role: created_admin.role,
                created_at: created_admin.created_at
            }
        });
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
