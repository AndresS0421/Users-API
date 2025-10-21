import { create_category_service } from '../../services/category/create.service.js';

export const create_category_controller = async (req, res) => {
    try {
        const { category } = req.body;
        const { role } = req.auth; // Get role from JWT token via middleware

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'category is required'
            });
        }

        if (!category.name) {
            return res.status(400).json({
                success: false,
                message: 'category name is required'
            });
        }

        if (role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Only ADMIN role can create categories'
            });
        }

        const result = await create_category_service(category, 'ADMINISTRATOR');

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'Category created successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to create category',
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
