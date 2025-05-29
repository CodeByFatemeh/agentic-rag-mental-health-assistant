import Api from '../utils/api'; // Import the Api instance
// import { AxiosResponse } from 'axios'
import handleAxiosError from '../utils/handleApiError'; // Reuse the centralized error handler
import { ApiError } from '../utils/ApiError';
class ChatService {
    constructor(api) {
        this.api = api;
    }
    async sendChatRequest(message, sessionId) {
        try {
            const response = await this.api.post('/chat/new', { message, sessionId });
            console.log('first res', response);
            return response;
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Send Chat Request', error);
            console.error('Send Chat Request Error:', {
                message,
                statusCode,
                errorObject
            });
            throw new ApiError(message, statusCode, errorObject);
        }
    }
    async getUserChats(sessionId) {
        try {
            const response = await this.api.get('/chat/all-chats', { params: { sessionId } } // Add sessionId as query param
            );
            return response;
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Get User Chats', error);
            throw new ApiError(message, statusCode, errorObject);
        }
    }
    async deleteUserChats(sessionId) {
        try {
            await this.api.delete('/chat/delete', { params: { sessionId } }); // Add sessionId as query param
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Delete User Chats', error);
            throw new ApiError(message, statusCode, errorObject);
        }
    }
}
export default new ChatService(new Api());
