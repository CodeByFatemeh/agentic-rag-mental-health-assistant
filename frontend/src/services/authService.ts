import Api from '../utils/api'
import { AxiosResponse } from 'axios'
import handleAxiosError from '../utils/handleApiError' // reuse the centralized error handler
import { ApiError } from '../utils/ApiError'

interface UserCredentials {
  email: string
  password: string
}

interface SignupData extends UserCredentials {
  name: string
}

interface UserInfo {
  name: string
  email: string
}

type ApiSuccessResponse<T> = {
  message: 'OK'
  data: T
}

type ApiErrorResponse = {
  message: string
  error: unknown
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

class AuthService {
  constructor (private readonly api: Api) {}

  public isApiSuccessResponse<T> (
    response: ApiResponse<T>
  ): response is ApiSuccessResponse<T> {
    return response.message === 'OK' && 'data' in response
  }

  public async login (
    credentials: UserCredentials
  ): Promise<ApiSuccessResponse<UserInfo>> {
    try {
      const response: AxiosResponse<UserInfo> = await this.api.post(
        '/user/login',
        credentials,
        { withCredentials: true } // Ensure cookies are sent with the request
      )
      console.log('Login Response:', response)
      return { message: 'OK', data: response.data }
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Login',
        error
      )
      console.error('Login Error:', { message, statusCode, errorObject })
      throw new ApiError(message, statusCode, errorObject)
    }
  }

  public async signup (
    signupData: SignupData
  ): Promise<ApiSuccessResponse<UserInfo>> {
    try {
      const response: AxiosResponse<UserInfo> = await this.api.post(
        '/user/signup',
        signupData
      )
      console.log('Signup Response:', response)
      return { message: 'OK', data: response.data }
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Signup',
        error
      )
      console.error('Signup Error:', { message, statusCode, errorObject })
      throw new ApiError(message, statusCode, errorObject)
    }
  }

  public async logout (): Promise<ApiSuccessResponse<null>> {
    try {
      const response = await this.api.post<ApiSuccessResponse<null>>(
        '/user/logout'
      )
      console.log('Logout Response:', response)
      return { message: 'OK', data: response.data }
    } catch (error: unknown) {
      const { message, statusCode, errorObject } = handleAxiosError(
        'Logout',
        error
      )
      console.error('Logout Error:', { message, statusCode, errorObject })
      throw new ApiError(message, statusCode, errorObject)
    }
  }

  public async checkAuthStatus (): Promise<ApiResponse<UserInfo | null>> {
    try {
      const response: ApiResponse<UserInfo | null> = await this.api.get(
        '/user/auth-status'
      )

      console.log('Auth Status Response:', response)

      if (response.message !== 'OK') {
        return { message: response.message, error: null }
      }
      return response
    } catch (error: unknown) {
      const { message, errorObject } = handleAxiosError('Auth status', error)
      console.error('Auth Status Error:', { message, errorObject })
      return { message: message, error: errorObject }
    }
  }
}

export default new AuthService(new Api())
