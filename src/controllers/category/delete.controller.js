import { delete_category_service } from '../../services/category/delete.service.js';

export const delete_category_controller = async (req, res) => {
    try {
        const { id } = req.query;
        const { role } = req.auth; // Get role from JWT token via middleware

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id parameter is required'
            });
        }

        if (role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Only ADMIN role can delete categories'
            });
        }

        const result = await delete_category_service(id, 'ADMINISTRATOR');

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'Category deleted successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to delete category',
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
