import { get_file_by_id_service } from '../../services/files/get_by_id.service.js';

export const get_file_by_id_controller = async (req, res) => {
    try {
        const { file_id, role } = req.query;

        if (!file_id || !role) {
            return res.status(400).json({
                success: false,
                message: 'file_id and role parameters are required'
            });
        }

        if (!['ADMINISTRATOR', 'PROFESSOR'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'role must be ADMINISTRATOR or PROFESSOR'
            });
        }

        const result = await get_file_by_id_service(file_id, role);

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'File retrieved successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to retrieve file',
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
