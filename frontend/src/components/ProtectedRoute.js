import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
const ProtectedRoute = ({ requiresAuth, component: Component,
//   ...rest
 }) => {
    const { isLoggedIn, user, loading } = useAuth();
    if (loading) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }, children: _jsx(CircularProgress, {}) })); // Display loading indicator
    }
    if (requiresAuth && !isLoggedIn && !user) {
        console.log("ProtectedRoute", requiresAuth, isLoggedIn, user);
        return _jsx(Navigate, { to: '/login', replace: true });
    }
    return _jsx(Component, {});
};
export default ProtectedRoute;
