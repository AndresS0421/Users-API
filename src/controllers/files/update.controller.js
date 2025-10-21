import { update_file_service } from '../../services/files/update.service.js';

export const update_file_controller = async (req, res) => {
    try {
        const { description, category_id } = req.body;
        const { id: user_id } = req.auth; // Get user_id from JWT token via middleware

        const fileMetadata = {
            user_id,
            description: description || '',
            category_id: category_id || null
        };

        const result = await update_file_service(req.file, fileMetadata);

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'File updated successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to update file',
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
