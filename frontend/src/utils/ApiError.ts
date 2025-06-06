/**
 * Custom API error class.
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorObject?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.errorObject = errorObject ?? null;
  }
}