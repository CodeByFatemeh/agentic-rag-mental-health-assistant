var _a;
import Axios from 'axios';
import handleAxiosError from './handleApiError';
import { getToken } from './authUtils';
// Fetch the base URL from environment variables
const BASE_URL = (_a = import.meta.env.REACT_APP_API_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3001/api/v1';
export class Api {
    constructor(defaultHeaders = {}) {
        this.subscribers = [];
        this.isRefreshTokenInProgress = false;
        this.requestRetryCount = {};
        this.reqInterceptorId = null;
        this.resInterceptorId = null;
        this._axios = Axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                ...defaultHeaders
            },
            withCredentials: true // Ensure cookies are sent with requests
        });
        // Set the Authorization interceptor to add the Bearer token dynamically
        this._axios.interceptors.request.use(config => {
            const token = getToken(); // Retrieve the token
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`; // Add the Authorization header
            }
            return config;
        });
    }
    get axios() {
        return this._axios;
    }
    // Generic HTTP methods
    async get(url, config) {
        return this.requestWrapper(() => this._axios.get(url, config), 'GET');
    }
    async post(url, data, config) {
        return this.requestWrapper(() => this._axios.post(url, data, config), 'POST');
    }
    async put(url, data, config) {
        return this.requestWrapper(() => this._axios.put(url, data, config), 'PUT');
    }
    async patch(url, data, config) {
        return this.requestWrapper(() => this._axios.patch(url, data, config), 'PATCH');
    }
    async delete(url, config) {
        return this.requestWrapper(() => this._axios.delete(url, config), 'DELETE');
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
    // Authentication setup
    configureAuth(maxRetry, refreshTokenFn) {
        this.reqInterceptorId = this._axios.interceptors.request.use(config => {
            // HttpOnly cookies automatically handle the Authorization token,
            // so we don't need to manually add it to headers.
            return config;
        });
        this.resInterceptorId = this._axios.interceptors.response.use(response => response, async (error) => {
            var _a;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                return this.handle401Error(error, maxRetry, refreshTokenFn);
            }
            return Promise.reject(error);
        });
    }
    // Handle 401 errors and retry requests
    async handle401Error(error, maxRetry, refreshTokenFn) {
        const originalRequest = error.config;
        if (!originalRequest ||
            this.requestRetryCount[originalRequest.url] >= maxRetry) {
            throw new Error('Maximum retry attempts exceeded.');
        }
        if (!this.isRefreshTokenInProgress) {
            this.isRefreshTokenInProgress = true;
            try {
                await refreshTokenFn(); // Refresh token logic
                this.subscribers.forEach(callback => callback());
                this.subscribers = [];
            }
            finally {
                this.isRefreshTokenInProgress = false;
            }
        }
        return new Promise((resolve) => {
            this.subscribers.push(() => {
                resolve(this._axios(originalRequest));
            });
        });
    }
    // Remove interceptors
    ejectInterceptors() {
        if (this.reqInterceptorId !== null) {
            this._axios.interceptors.request.eject(this.reqInterceptorId);
        }
        if (this.resInterceptorId !== null) {
            this._axios.interceptors.response.eject(this.resInterceptorId);
        }
    }
}
export default Api;
