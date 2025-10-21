import { get_all_files_service } from '../../services/files/get_all.service.js';

export const get_all_files_controller = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'role parameter is required'
            });
        }

        if (!['ADMINISTRATOR', 'PROFESSOR'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'role must be ADMINISTRATOR or PROFESSOR'
            });
        }

        const result = await get_all_files_service(role);

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
