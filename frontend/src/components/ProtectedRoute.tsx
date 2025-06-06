import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material'; 
import { useAuth } from '../hooks/useAuth';


const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, loading } = useAuth();

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

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute
