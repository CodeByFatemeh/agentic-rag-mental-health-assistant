import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios'
import handleAxiosError from './handleApiError'
import {getToken} from './authUtils'

// Fetch the base URL from environment variables
const BASE_URL =
  import.meta.env.REACT_APP_API_URL ?? 'http://localhost:3001/api/v1'

export class Api {
  private readonly _axios: AxiosInstance
  private subscribers: Array<() => void> = []
  private isRefreshTokenInProgress = false
  private readonly requestRetryCount: Record<string, number> = {}
  private reqInterceptorId: number | null = null
  private resInterceptorId: number | null = null

  constructor (defaultHeaders: Record<string, string> = {}) {
    this._axios = Axios.create({
      baseURL: import.meta.env.REACT_ENV == 'development' ? BASE_URL : '/api/v1',
      // baseURL: '/api/v1', // for production use
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders
      },
      withCredentials: true // Ensure cookies are sent with requests
    })

    // Set the Authorization interceptor to add the Bearer token dynamically
    this._axios.interceptors.request.use(config => {
      const token = getToken() // Retrieve the token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}` // Add the Authorization header
      }
      return config
    })
  }

  get axios (): AxiosInstance {
    return this._axios
  }

  // Generic HTTP methods
  public async get<T> (url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper<T>(() => this._axios.get<T>(url, config), 'GET')
  }

  public async post<T> (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.requestWrapper<T>(() => this._axios.post<T>(url, data, config), 'POST')
  }

  public async put<T> (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.requestWrapper<T>(() => this._axios.put<T>(url, data, config), 'PUT')
  }

  public async patch<T> (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.requestWrapper<T>(() => this._axios.patch<T>(url, data, config), 'PATCH')
  }

  public async delete<T> (url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper<T>(() => this._axios.delete<T>(url, config), 'DELETE')
  }

  // Centralized request wrapper for consistent error handling
  private async requestWrapper<T> (
    requestFn: () => Promise<AxiosResponse<T>>,
    operation: string
  ): Promise<T> {
    try {
      const response = await requestFn()
      return response.data
    } catch (error) {
      const apiError = handleAxiosError(operation, error);
      console.error(`API Error in ${operation}:`, apiError);
      throw apiError;
    }
  }

  // Authentication setup
  public configureAuth (
    maxRetry: number,
    refreshTokenFn: () => Promise<void>
  ): void {
    this.reqInterceptorId = this._axios.interceptors.request.use(config => {
      // HttpOnly cookies automatically handle the Authorization token,
      // so we don't need to manually add it to headers.
      return config
    })

    this.resInterceptorId = this._axios.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          return this.handle401Error(error, maxRetry, refreshTokenFn)
        }
        return Promise.reject(error)
      }
    )
  }

  // Handle 401 errors and retry requests
  private async handle401Error (
    error: AxiosError,
    maxRetry: number,
    refreshTokenFn: () => Promise<void>
  ): Promise<AxiosResponse | void> {
    const originalRequest = error.config!
    if (
      !originalRequest ||
      this.requestRetryCount[originalRequest.url!] >= maxRetry
    ) {
      throw new Error('Maximum retry attempts exceeded.')
    }

    if (!this.isRefreshTokenInProgress) {
      this.isRefreshTokenInProgress = true
      try {
        await refreshTokenFn() // Refresh token logic
        this.subscribers.forEach(callback => callback())
        this.subscribers = []
      } finally {
        this.isRefreshTokenInProgress = false
      }
    }

    return new Promise((resolve) => {
      this.subscribers.push(() => {
        resolve(this._axios(originalRequest))
      })
    })
  }

  // Remove interceptors
  public ejectInterceptors (): void {
    if (this.reqInterceptorId !== null) {
      this._axios.interceptors.request.eject(this.reqInterceptorId)
    }
    if (this.resInterceptorId !== null) {
      this._axios.interceptors.response.eject(this.resInterceptorId)
    }
  }
}

export default Api
