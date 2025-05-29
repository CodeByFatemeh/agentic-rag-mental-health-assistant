import { createContext, useContext } from 'react';
import { UserAuth } from '../types';

export const AuthContext = createContext<UserAuth>({
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  setIsLoggedIn: () => {},
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);