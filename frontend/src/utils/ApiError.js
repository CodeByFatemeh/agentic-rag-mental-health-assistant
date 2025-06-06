/**
 * Custom API error class.
 */
export class ApiError extends Error {
    constructor(message, statusCode, errorObject) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorObject = errorObject;
        this.name = 'ApiError';
        this.errorObject = errorObject !== null && errorObject !== void 0 ? errorObject : null;
    }
}
