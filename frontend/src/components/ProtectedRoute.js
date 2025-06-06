import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = () => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }, children: _jsx(CircularProgress, {}) })); // Display loading indicator
    }
    return isLoggedIn ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login", replace: true });
};
export default ProtectedRoute;
