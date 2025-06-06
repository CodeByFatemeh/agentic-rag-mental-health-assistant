import { AxiosError } from 'axios';
import { ApiErrorResult } from '../types';

/**
 * Handles Axios errors and returns standardized error result.
 */
const handleAxiosError = (action: string, error: unknown): ApiErrorResult => {
  let message = `An unknown error occurred during ${action}`;
  let statusCode = 500;
  let errorObject: unknown = { error };

  if (error instanceof AxiosError) {
    statusCode = error.response?.status ?? 500;
    message = error.response?.data?.message ?? error.message ?? `Error in ${action}`;
    errorObject = {
      response: error.response?.data,
      request: error.request,
      config: error.config,
    };
  } else if (error instanceof Error) {
    message = `${action} failed: ${error.message}`;
    errorObject = { message: error.message, stack: error.stack };
  }

  return { message, statusCode, errorObject };
};

export default handleAxiosError;