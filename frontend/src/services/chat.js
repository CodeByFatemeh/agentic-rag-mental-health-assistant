import { api } from './api';
import handleAxiosError from '../utils/handleApiError';
/**
 * Chat API service.
 */
export const sendChatRequest = async (message, sessionId) => {
    try {
        const response = await api.post('/chat/new', { message, sessionId });
        return response;
    }
    catch (error) {
        const { message: msg, errorObject } = handleAxiosError('Send Chat Request', error);
        return { message: msg, error: errorObject };
    }
};
export const getUserChats = async (sessionId) => {
    try {
        const response = await api.get('/chat/all-chats', {
            params: { sessionId },
        });
        return response;
    }
    catch (error) {
        const { message, errorObject } = handleAxiosError('Get User Chats', error);
        return { message, error: errorObject };
    }
};
export const deleteUserChats = async (sessionId) => {
    try {
        const response = await api.delete('/chat/delete', { params: { sessionId } });
        return response;
    }
    catch (error) {
        const { message, errorObject } = handleAxiosError('Delete User Chats', error);
        return { message, error: errorObject };
    }
};
// Fetch all chat sessions for the user (grouped by sessionId)
export const getChatSessions = async () => {
    return await api.get('/chat/sessions');
};
