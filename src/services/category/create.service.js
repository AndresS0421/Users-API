import axios from 'axios';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const create_category_service = async (categoryData, role) => {
    try {
        const response = await axios.post(`${FILES_API_BASE_URL}/category/create`, {
            category: categoryData,
            role
        }, {
            headers: {
                'Content-Type': 'application/json'
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
