import { create_service as create_user } from "../../services/user/create.service.js";
import { create_credential_service } from "../../services/user/credential.service.js";
import { hash_password } from "../../lib/hashing/hash_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function register_auditor_controller(req, res) {
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

        // Set role to AUDITOR
        user.role = "AUDITOR";

        // Hash password
        const hashed_password = await hash_password(user.password);
        if (!hashed_password) {
            throw new VerificationError(400, "User creation problems.");
        }

        user.password = hashed_password;

        // Create auditor user
        const created_auditor = await create_user(user);

        // Create credential for the auditor user
        const credential = await create_credential_service(created_auditor.id, user.password);
        
        if (!credential) {
            throw new VerificationError(400, "Failed to create auditor credentials.");
        }

        // Remove sensitive data from response
        delete created_auditor.credential;

        return res.status(201).json({
            successful: true, 
            message: "Auditor user created successfully",
            data: {
                id: created_auditor.id,
                first_name: created_auditor.first_name,
                last_name: created_auditor.last_name,
                email: created_auditor.email,
                role: created_auditor.role,
                created_at: created_auditor.created_at
            }
        });
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
