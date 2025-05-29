import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box } from '@mui/material'; 
// import AuthService from '../services/authService'

type ProtectedRouteProps = RouteProps & {
  requiresAuth: boolean
  component: React.ComponentType<unknown>
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiresAuth,
  component: Component,
//   ...rest
}) => {
  const { isLoggedIn, user, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    ); // Display loading indicator
  }

  if (requiresAuth && !isLoggedIn && !user) {
    console.log("ProtectedRoute", requiresAuth, isLoggedIn, user)
    return <Navigate to='/login' replace />
  }

  return <Component />
}

export default ProtectedRoute
