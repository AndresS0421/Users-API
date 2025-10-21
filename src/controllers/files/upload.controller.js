import { upload_file_service } from '../../services/files/upload.service.js';

export const upload_file_controller = async (req, res) => {
    try {
        const { description, category_id } = req.body;
        const { id: user_id } = req.auth; // Get user_id from JWT token via middleware
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: 'category_id is required'
            });
        }

        const fileMetadata = {
            description: description || '',
            user_id,
            category_id
        };

        const result = await upload_file_service(req.file, fileMetadata);

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'File uploaded successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to upload file',
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
