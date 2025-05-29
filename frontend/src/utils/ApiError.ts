
export class ApiError extends Error {
  public errorObject: unknown;

    constructor(public message: string, public statusCode: number, errorObject?: unknown) {
      super(message);
      this.name = 'ApiError';
      this.errorObject = errorObject || null; 
    }
  }
  