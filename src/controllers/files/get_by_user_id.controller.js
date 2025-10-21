import { get_files_by_user_id_service } from '../../services/files/get_by_user_id.service.js';

export const get_files_by_user_id_controller = async (req, res) => {
    try {
        const { id: user_id } = req.auth; // Get user_id from JWT token via middleware

        const result = await get_files_by_user_id_service(user_id);

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'Files retrieved successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to retrieve files',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
