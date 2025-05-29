import Api from '../utils/api' // Import the Api instance
// import { AxiosResponse } from 'axios'
import handleAxiosError from '../utils/handleApiError' // Reuse the centralized error handler
import { ApiError } from '../utils/ApiError'
import { ApiResponse, Message } from '../types'

class ChatService {
  constructor (private readonly api: Api) {}

  public async sendChatRequest (
    message: string,
    sessionId: string
  ): Promise<ApiResponse<Message[]>> {
    try {
      const response = await this.api.post<ApiResponse<Message[]>>(
        '/chat/new',
        { message, sessionId } 
      )
      console.log('first res', response)

      return response
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Send Chat Request',
        error
      )
      console.error('Send Chat Request Error:', {
        message,
        statusCode,
        errorObject
      })
      throw new ApiError(message, statusCode, errorObject)
    }
  }

  public async getUserChats(sessionId?: string): Promise<ApiResponse<Message[]>> {
    try {
      const response = await this.api.get<ApiResponse<Message[]>>(
        '/chat/all-chats',
        { params: { sessionId } } // Add sessionId as query param
      );
      return response;
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Get User Chats',
        error
      );
      throw new ApiError(message, statusCode, errorObject);
    }
  }

  public async deleteUserChats(sessionId?: string): Promise<void> {
    try {
      await this.api.delete('/chat/delete', { params: { sessionId } }); // Add sessionId as query param
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Delete User Chats',
        error
      );
      throw new ApiError(message, statusCode, errorObject);
    }
  }
}

export default new ChatService(new Api())
