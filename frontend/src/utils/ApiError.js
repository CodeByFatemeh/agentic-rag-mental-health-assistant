export class ApiError extends Error {
    constructor(message, statusCode, errorObject) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'ApiError';
        this.errorObject = errorObject || null;
    }
}
