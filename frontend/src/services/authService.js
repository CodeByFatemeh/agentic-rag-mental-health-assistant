import Api from '../utils/api';
import handleAxiosError from '../utils/handleApiError'; // reuse the centralized error handler
import { ApiError } from '../utils/ApiError';
class AuthService {
    constructor(api) {
        this.api = api;
    }
    isApiSuccessResponse(response) {
        return response.message === 'OK' && 'data' in response;
    }
    async login(credentials) {
        try {
            const response = await this.api.post('/user/login', credentials, { withCredentials: true } // Ensure cookies are sent with the request
            );
            console.log('Login Response:', response);
            return { message: 'OK', data: response.data };
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Login', error);
            console.error('Login Error:', { message, statusCode, errorObject });
            throw new ApiError(message, statusCode, errorObject);
        }
    }
    async signup(signupData) {
        try {
            const response = await this.api.post('/user/signup', signupData);
            console.log('Signup Response:', response);
            return { message: 'OK', data: response.data };
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Signup', error);
            console.error('Signup Error:', { message, statusCode, errorObject });
            throw new ApiError(message, statusCode, errorObject);
        }
    }
    async logout() {
        try {
            const response = await this.api.post('/user/logout');
            console.log('Logout Response:', response);
            return { message: 'OK', data: response.data };
        }
        catch (error) {
            const { message, statusCode, errorObject } = handleAxiosError('Logout', error);
            console.error('Logout Error:', { message, statusCode, errorObject });
            throw new ApiError(message, statusCode, errorObject);
        }
    }
    async checkAuthStatus() {
        try {
            const response = await this.api.get('/user/auth-status');
            console.log('Auth Status Response:', response);
            if (response.message !== 'OK') {
                return { message: response.message, error: null };
            }
            return response;
        }
        catch (error) {
            const { message, errorObject } = handleAxiosError('Auth status', error);
            console.error('Auth Status Error:', { message, errorObject });
            return { message: message, error: errorObject };
        }
    }
}
export default new AuthService(new Api());
