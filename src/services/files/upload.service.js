import axios from 'axios';
import FormData from 'form-data';

const FILES_API_BASE_URL = process.env.FILES_API_BASE_URL || 'http://localhost:8090';

export const upload_file_service = async (file, fileMetadata) => {
    try {
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });
        formData.append('file', JSON.stringify(fileMetadata));

        const response = await axios.post(`${FILES_API_BASE_URL}/files/upload`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
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
