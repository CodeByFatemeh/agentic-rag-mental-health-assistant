import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, TextField, Button, FormControlLabel, Checkbox, Typography, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, LockRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});
const LoginPage = () => {
    var _a, _b;
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = React.useState(false);
    const { isLoggedIn, user, login } = useAuth();
    const initialValues = { email: '', password: '' };
    const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || '/';
    useEffect(() => {
        if (isLoggedIn && user) {
            navigate(from, { replace: true });
        }
    }, [isLoggedIn, user, navigate, from]);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleSubmit = async (values) => {
        try {
            await login(values.email, values.password); // Call the context's login function
            toast.success('Login successful!', { id: 'login' });
            navigate(from, { replace: true });
        }
        catch (error) {
            // Handle login failure
            console.log('Login failed:', error);
            toast.error('Login failed. Please check your credentials and try again.', { id: 'login' });
        }
    };
    if (isLoggedIn) {
        return null;
    }
    return (_jsx(Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 4,
        }, children: _jsxs(Box, { sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
                padding: 4,
                borderRadius: 2,
                boxShadow: '10px 10px 20px #000'
            }, children: [_jsxs(Box, { sx: {
                        width: '350px',
                        pb: 3
                    }, children: [_jsx(Typography, { variant: 'h5', children: "Welcome to MindEase" }), _jsx(Typography, { variant: 'body1', children: "Sign in to your account and access our compassionate AI chatbot for mental health support." })] }), _jsx(Formik, { initialValues: initialValues, validationSchema: LoginSchema, onSubmit: handleSubmit, children: ({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid, dirty }) => (_jsxs(Box, { component: 'form', onSubmit: handleSubmit, noValidate: true, sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                            // minHeight: '100vh'
                        }, children: [_jsx(TextField, { label: 'Email', name: 'email', variant: 'outlined', fullWidth: true, margin: 'normal', value: values.email, onChange: handleChange, onBlur: handleBlur, error: touched.email && Boolean(errors.email), helperText: touched.email && errors.email, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(AccountCircle, {}) }))
                                } }), _jsx(TextField, { label: 'Password', name: 'password', variant: 'outlined', fullWidth: true, margin: 'normal', type: showPassword ? 'text' : 'password', value: values.password, onChange: handleChange, onBlur: handleBlur, error: touched.password && Boolean(errors.password), helperText: touched.password && errors.password, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(LockRounded, {}) })),
                                    endAdornment: (_jsx(InputAdornment, { position: 'end', children: _jsx(IconButton, { "aria-label": 'toggle password visibility', onClick: handleMouseDownPassword, edge: 'end', children: showPassword ? _jsx(Visibility, {}) : _jsx(VisibilityOff, {}) }) }))
                                } }), _jsx(FormControlLabel, { control: _jsx(Checkbox, {}), label: 'Remember me' }), _jsx(Button, { variant: 'contained', color: 'primary', type: 'submit', fullWidth: true, disabled: !(isValid && dirty), children: "Login" }), _jsx(Link, { to: '/signup', children: "New User? Sign Up" })] })) })] }) }));
};
export default LoginPage;
