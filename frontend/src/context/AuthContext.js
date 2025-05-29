import { createContext, useContext } from 'react';
export const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    setUser: () => { },
    setIsLoggedIn: () => { },
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    loading: true,
});
export const useAuth = () => useContext(AuthContext);
