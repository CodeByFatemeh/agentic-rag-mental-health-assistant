import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import handleAxiosError from '../utils/handleApiError';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

/**
 * API client for making HTTP requests.
 */
export class Api {
  private readonly axios: AxiosInstance;

  constructor(defaultHeaders: Record<string, string> = {}) {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_NODE_ENV == 'development' ? BASE_URL : '/api/v1',
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders
      },
      withCredentials: true,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper(() => this.axios.get<T>(url, config), 'GET');
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper(() => this.axios.post<T>(url, data, config), 'POST');
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper(() => this.axios.put<T>(url, data, config), 'PUT');
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper(() => this.axios.patch<T>(url, data, config), 'PATCH');
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWrapper(() => this.axios.delete<T>(url, config), 'DELETE');
  }

  // Centralized request wrapper for consistent error handling
  private async requestWrapper<T>(
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
}

export const api = new Api();