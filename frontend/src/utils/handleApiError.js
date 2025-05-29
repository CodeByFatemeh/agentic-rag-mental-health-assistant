import { AxiosError } from 'axios';
const handleAxiosError = (action, error) => {
    var _a, _b, _c, _d, _e;
    let message = `An unknown error occurred during ${action}`;
    let statusCode = 500;
    let errorObject = { error };
    if (error instanceof AxiosError) {
        statusCode = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500;
        message =
            ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) ||
                error.message ||
                `An error occurred during ${action}`;
        errorObject = {
            response: (_e = error.response) === null || _e === void 0 ? void 0 : _e.data,
            request: error.request,
            config: error.config
        };
    }
    else if (error instanceof Error) { // a generic JavaScript error
        message = `${action} failed: ${error.message}`;
        errorObject = { message: error.message, stack: error.stack };
    }
    console.error(`API Error in ${action}: ${message}`, {
        statusCode,
        errorObject
    });
    return { message, statusCode, errorObject };
};
export default handleAxiosError;
