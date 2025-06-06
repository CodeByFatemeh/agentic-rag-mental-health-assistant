var _a;
import axios from 'axios';
import handleAxiosError from '../utils/handleApiError';
const BASE_URL = (_a = import.meta.env.VITE_API_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3001/api/v1';
/**
 * API client for making HTTP requests.
 */
export class Api {
    constructor(defaultHeaders = {}) {
        this.axios = axios.create({
            baseURL: import.meta.env.VITE_NODE_ENV == 'development' ? BASE_URL : '/api/v1',
            headers: {
                'Content-Type': 'application/json',
                ...defaultHeaders
            },
            withCredentials: true,
        });
    }
    async get(url, config) {
        return this.requestWrapper(() => this.axios.get(url, config), 'GET');
    }
    async post(url, data, config) {
        return this.requestWrapper(() => this.axios.post(url, data, config), 'POST');
    }
    async put(url, data, config) {
        return this.requestWrapper(() => this.axios.put(url, data, config), 'PUT');
    }
    async patch(url, data, config) {
        return this.requestWrapper(() => this.axios.patch(url, data, config), 'PATCH');
    }
    async delete(url, config) {
        return this.requestWrapper(() => this.axios.delete(url, config), 'DELETE');
    }
    // Centralized request wrapper for consistent error handling
    async requestWrapper(requestFn, operation) {
        try {
            const response = await requestFn();
            return response.data;
        }
        catch (error) {
            const apiError = handleAxiosError(operation, error);
            console.error(`API Error in ${operation}:`, apiError);
            throw apiError;
        }
    }
}
export const api = new Api();
