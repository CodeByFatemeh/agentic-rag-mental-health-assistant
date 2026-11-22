import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  ReactNode
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { AuthContext } from './AuthContext'
import { login, signup, logout, checkAuthStatus } from '../services/auth'
import handleAxiosError from '../utils/handleApiError'
import { User } from '../types'
import Loading from '../components/shared/Loading'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const hasCheckedAuth = useRef(false) // If auth was checked or not

  const isPublicRoute = (path: string) =>
    ['/login', '/signup', '/'].includes(path)

  const handleRedirect = (user: User | null) => {
    if (isPublicRoute(location.pathname)) return

    if (user) {
      // Only redirect if not already on /chat
      if (location.pathname !== '/chat') {
        const from = location.state?.from?.pathname ?? '/chat'
        navigate(from, { replace: true })
      }
    } else {
      navigate('/login', { replace: true, state: { from: location } })
    }
  }

  useEffect(() => {
    const verifyAuth = async () => {
      if (hasCheckedAuth.current) {
        handleRedirect(user)
        return
      }

      try {
        setLoading(true)
        const response = await checkAuthStatus()
        hasCheckedAuth.current = true
        setUser(response.loggedIn && response.user ? response.user : null)

        if (!response.loggedIn || !response.user) {
          localStorage.removeItem('chatSessionId')
        }

        handleRedirect(response.user)
      } catch (error) {
        hasCheckedAuth.current = true
        setUser(null)
        localStorage.removeItem('chatSessionId')
        const { message } = handleAxiosError('Check Auth Status', error)
        toast.error(message)
        handleRedirect(null)
      } finally {
        setLoading(false)
      }
    }
    verifyAuth()
  }, [location, navigate, user])

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await login({ email, password })
        if (response.data) {
          setUser(response.data)
          const from = location.state?.from?.pathname ?? '/chat'
          navigate(from, { replace: true })
          toast.success('Login successful!')
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        const { message } = handleAxiosError('Login', error)
        toast.error(message)
      }
    },
    [navigate, location]
  )

  const handleSignup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await signup({ name, email, password })
        if (response.data) {
          setUser(response.data)
          navigate('/chat', { replace: true })
          toast.success('Signup successful!')
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        const { message } = handleAxiosError('Signup', error)
        toast.error(message)
      }
    },
    [navigate]
  )

  const handleLogout = useCallback(async () => {
    try {
      await logout()
  
      setUser(null)
      localStorage.removeItem('chatSessionId')
      toast.success('Logout successful!')
      navigate('/login', { replace: true })
    } catch (error) {
      const { message } = handleAxiosError('Logout', error)
      toast.error(message)
    }
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      loading
    }),
    [user, loading, handleLogin, handleSignup, handleLogout]
  )

  if (loading) {
    return <Loading />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
