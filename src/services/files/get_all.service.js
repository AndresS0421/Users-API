import axios from 'axios';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const get_all_files_service = async (role) => {
    try {
        const response = await axios.get(`${FILES_API_BASE_URL}/files/get-all`, {
            params: { role }
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
