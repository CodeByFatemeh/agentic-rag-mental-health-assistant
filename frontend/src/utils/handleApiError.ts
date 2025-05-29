import { AxiosError } from 'axios'

export interface ApiErrorResult {
  message: string
  statusCode: number
  errorObject: unknown
}

const handleAxiosError = (action: string, error: unknown): ApiErrorResult => {
  let message = `An unknown error occurred during ${action}`
  let statusCode = 500
  let errorObject: unknown = { error }

  if (error instanceof AxiosError) {
    statusCode = error.response?.status ?? 500
    message =
      error.response?.data?.message ||
      error.message ||
      `An error occurred during ${action}`

    errorObject = {
      response: error.response?.data,
      request: error.request,
      config: error.config
    }
  } else if (error instanceof Error) { // a generic JavaScript error
    message = `${action} failed: ${error.message}`
    errorObject = { message: error.message, stack: error.stack }
  }

  console.error(`API Error in ${action}: ${message}`, {
    statusCode,
    errorObject
  })

  return { message, statusCode, errorObject }
}

export default handleAxiosError
