import axios from 'axios';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const delete_category_service = async (categoryId, role) => {
    try {
        const response = await axios.delete(`${FILES_API_BASE_URL}/category/delete`, {
            params: { 
                id: categoryId,
                role 
            }
        });

        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status || 500
        };
    }
};
