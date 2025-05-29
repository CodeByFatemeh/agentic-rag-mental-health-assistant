export const getToken = (): string | null => {
    const COOKIE_NAME = "auth_token"

  // Retrieve the token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  // Decode the token if needed (optional)
  return token ? decodeURIComponent(token) : null;
};
