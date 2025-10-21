import { update_category_service } from '../../services/category/update.service.js';

export const update_category_controller = async (req, res) => {
    try {
        const { category } = req.body;
        const { role } = req.auth; // Get role from JWT token via middleware

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'category is required'
            });
        }

        if (!category.id || !category.name) {
            return res.status(400).json({
                success: false,
                message: 'category id and name are required'
            });
        }

        if (role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Only ADMIN role can update categories'
            });
        }

        const result = await update_category_service(category, 'ADMINISTRATOR');

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'Category updated successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to update category',
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
