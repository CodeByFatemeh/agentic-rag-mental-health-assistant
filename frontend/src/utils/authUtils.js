export const getToken = () => {
    var _a;
    const COOKIE_NAME = "auth_token";
    // Retrieve the token from cookies
    const token = (_a = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${COOKIE_NAME}=`))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    // Decode the token if needed (optional)
    return token ? decodeURIComponent(token) : null;
};
