import axios from 'axios';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const get_file_by_id_service = async (fileId, role) => {
    try {
        const response = await axios.get(`${FILES_API_BASE_URL}/files/get`, {
            params: { 
                file_id: fileId,
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
