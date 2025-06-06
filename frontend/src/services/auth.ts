import { api } from './api'
import { ApiResponse, User, AuthStatusResponse } from '../types'
import { OK_MESSAGE } from '../utils/constants'
import handleAxiosError from '../utils/handleApiError'

/**
 * Authentication API service.
 */
export const login = async (credentials: {
  email: string
  password: string
}): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(
      '/user/login',
      credentials
    )
    return response
  } catch (error) {
    const { message, errorObject } = handleAxiosError('Login', error)
    return { message, error: errorObject }
  }
}

export const signup = async (data: {
  name: string
  email: string
  password: string
}): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>('/user/signup', data)
    return response
  } catch (error) {
    const { message, errorObject } = handleAxiosError('Signup', error)
    return { message, error: errorObject }
  }
}

export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await api.get<ApiResponse<null>>('/user/logout')
    return response
  } catch (error) {
    const { message, errorObject } = handleAxiosError('Logout', error)
    return { message, error: errorObject }
  }
}

export const checkAuthStatus = async (): Promise<AuthStatusResponse> => {
  try {
    const response = await api.get<AuthStatusResponse>('/user/auth-status')
    return response
  } catch (error) {
    const { message } = handleAxiosError('Auth Status', error)
    console.error('Auth status error:', message)
    return { loggedIn: false, user: null }
  }
}

export const isApiSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } => {
  return (
    response.message === OK_MESSAGE &&
    !response.error &&
    response.data !== undefined
  )
}
