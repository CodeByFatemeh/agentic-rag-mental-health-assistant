import { AxiosError } from 'axios';
/**
 * Handles Axios errors and returns standardized error result.
 */
const handleAxiosError = (action, error) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let message = `An unknown error occurred during ${action}`;
    let statusCode = 500;
    let errorObject = { error };
    if (error instanceof AxiosError) {
        statusCode = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500;
        message = (_f = (_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : error.message) !== null && _f !== void 0 ? _f : `Error in ${action}`;
        errorObject = {
            response: (_g = error.response) === null || _g === void 0 ? void 0 : _g.data,
            request: error.request,
            config: error.config,
        };
    }
    else if (error instanceof Error) {
        message = `${action} failed: ${error.message}`;
        errorObject = { message: error.message, stack: error.stack };
    }
    return { message, statusCode, errorObject };
};
export default handleAxiosError;
