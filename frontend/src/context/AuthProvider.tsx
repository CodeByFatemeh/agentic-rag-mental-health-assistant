import React, { useState, useMemo, useEffect, useCallback } from 'react'
import AuthService from '../services/authService'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { User } from '../types'
import handleAxiosError from '../utils/handleApiError';
import { AuthContext } from './AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await AuthService.checkAuthStatus()
        if (AuthService.isApiSuccessResponse(response) && response.data) {
          // Update authentication state
          setUser({ 
            email: response.data.email, 
            name: response.data.name })
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setIsLoggedIn(false)
          console.warn('User is not authenticated:', response)
        }
      } catch (error) {
        setUser(null)
        setIsLoggedIn(false)
        const { message } = handleAxiosError('Check Auth Status', error);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    if (!isLoggedIn && !user) {
      checkStatus()
    }
  }, [isLoggedIn, user, setUser, setIsLoggedIn])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await AuthService.login({ email, password })
      if (AuthService.isApiSuccessResponse(res) && res.data) {
        setUser({ email: res.data?.email, name: res.data?.name })
        setIsLoggedIn(true)
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      const { message } = handleAxiosError('Login', error);
      toast.error(message);
    }
  }, [setUser, setIsLoggedIn]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await AuthService.signup({ name, email, password });
      if (AuthService.isApiSuccessResponse(res) && res.data) {
        setUser({ name, email });
        setIsLoggedIn(true);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      const { message } = handleAxiosError('Signup', error);
      toast.error(message);
    }
  }, [setUser, setIsLoggedIn])

  const logout = useCallback(async () => {
    try {
      const res = await AuthService.logout();
      if (AuthService.isApiSuccessResponse(res)) {
        setUser(null);
        setIsLoggedIn(false);
        toast.success('Logout successful!');
        navigate('/login');
      }
      // else {
      //   throw new Error(res.message);
      // }
    } catch (error) {
      const { message } = handleAxiosError('Logout', error);
      toast.error(message);
      navigate('/');
    }
  }, [setUser, setIsLoggedIn, navigate]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      setUser,
      setIsLoggedIn,
      login,
      signup,
      logout,
      loading
    }),
    [isLoggedIn, user, setUser, setIsLoggedIn, loading, login, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}