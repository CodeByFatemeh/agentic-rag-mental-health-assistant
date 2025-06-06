import { api } from './api';
import { OK_MESSAGE } from '../utils/constants';
import handleAxiosError from '../utils/handleApiError';
/**
 * Authentication API service.
 */
export const login = async (credentials) => {
    try {
        const response = await api.post('/user/login', credentials);
        return response;
    }
    catch (error) {
        const { message, errorObject } = handleAxiosError('Login', error);
        return { message, error: errorObject };
    }
};
export const signup = async (data) => {
    try {
        const response = await api.post('/user/signup', data);
        return response;
    }
    catch (error) {
        const { message, errorObject } = handleAxiosError('Signup', error);
        return { message, error: errorObject };
    }
};
export const logout = async () => {
    try {
        const response = await api.get('/user/logout');
        return response;
    }
    catch (error) {
        const { message, errorObject } = handleAxiosError('Logout', error);
        return { message, error: errorObject };
    }
};
export const checkAuthStatus = async () => {
    try {
        const response = await api.get('/user/auth-status');
        return response;
    }
    catch (error) {
        const { message } = handleAxiosError('Auth Status', error);
        console.error('Auth status error:', message);
        return { loggedIn: false, user: null };
    }
};
export const isApiSuccessResponse = (response) => {
    return (response.message === OK_MESSAGE &&
        !response.error &&
        response.data !== undefined);
};
