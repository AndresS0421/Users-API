import { get_all_categories_service } from '../../services/category/get_all.service.js';

export const get_all_categories_controller = async (req, res) => {
    try {
        const result = await get_all_categories_service();

        if (result.success) {
            res.status(result.status).json({
                success: true,
                message: 'Categories retrieved successfully',
                data: result.data
            });
        } else {
            res.status(result.status).json({
                success: false,
                message: 'Failed to retrieve categories',
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
