import { api } from './api';
import { ApiResponse, ChatMessage } from '../types';
import handleAxiosError from '../utils/handleApiError';

/**
 * Chat API service.
 */
export const sendChatRequest = async (
  message: string,
  sessionId?: string
): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    const response = await api.post<ApiResponse<ChatMessage[]>>('/chat/new', { message, sessionId });
    return response;
  } catch (error) {
    const { message: msg, errorObject } = handleAxiosError('Send Chat Request', error);
    return { message: msg, error: errorObject };
  }
};

export const getUserChats = async (sessionId?: string): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    const response = await api.get<ApiResponse<ChatMessage[]>>('/chat/all-chats', {
      params: { sessionId },
    });
    return response;
  } catch (error) {
    const { message, errorObject } = handleAxiosError('Get User Chats', error);
    return { message, error: errorObject };
  }
};

export const deleteUserChats = async (sessionId?: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>('/chat/delete', { params: { sessionId } });
    return response;
  } catch (error) {
    const { message, errorObject } = handleAxiosError('Delete User Chats', error);
    return { message, error: errorObject };
  }
};


// Fetch all chat sessions for the user (grouped by sessionId)
export const getChatSessions = async () => {
  return await api.get('/chat/sessions');
};