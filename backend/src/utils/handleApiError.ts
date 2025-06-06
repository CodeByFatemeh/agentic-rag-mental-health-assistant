import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode: number;
  errorObject?: unknown; // Original error
}

export const handleApiError = (
  operation: string,
  error: unknown,
  customMessage?: string
): ApiError => {
  let message = customMessage ?? 'An unexpected error occurred.';
  let statusCode = 500;
  let errorObject: unknown = error;

    if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    statusCode = axiosError.response?.status ?? 500;
    if (axiosError.response?.data && typeof axiosError.response?.data === 'object' && 'message' in (axiosError.response?.data ?? {}) && typeof (axiosError.response?.data as { message: unknown }).message === 'string') {
      message = (axiosError.response?.data as { message: string }).message;
    } else {
      message = axiosError.message || 'An internal server error occurred.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error(`API Error in ${operation}: ${message}`, error);

  return { message, statusCode, errorObject };
};