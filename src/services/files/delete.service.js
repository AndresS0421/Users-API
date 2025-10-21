import axios from 'axios';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const delete_file_service = async (userId, fileId) => {
    try {
        const response = await axios.delete(`${FILES_API_BASE_URL}/files/delete`, {
            params: { 
                user_id: userId,
                file_id: fileId 
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
