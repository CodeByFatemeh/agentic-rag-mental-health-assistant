import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, LockRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
/**
 * Login page for user authentication.
 */
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});
const Login = () => {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const initialValues = { email: '', password: '' };
    const handleSubmit = async (values, { setSubmitting }) => {
        await login(values.email, values.password);
        setSubmitting(false);
    };
    return (_jsxs(Container, { maxWidth: "sm", sx: { mt: 8 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Login to MindEase" }), _jsx(Typography, { variant: "body1", color: "text.secondary", component: 'p', children: "Sign in to access our compassionate AI chatbot for mental health support." }), _jsx(Formik, { initialValues: initialValues, validationSchema: LoginSchema, onSubmit: handleSubmit, children: ({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (_jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 2 }, children: [_jsx(TextField, { label: "Email", name: "email", fullWidth: true, margin: "normal", value: values.email, onChange: handleChange, onBlur: handleBlur, error: touched.email && Boolean(errors.email), helperText: touched.email && errors.email, slotProps: {
                                input: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(AccountCircle, {}) })),
                                },
                            }, "aria-label": "Email address" }), _jsx(TextField, { label: "Password", name: "password", type: showPassword ? 'text' : 'password', fullWidth: true, margin: "normal", value: values.password, onChange: handleChange, onBlur: handleBlur, slotProps: {
                                input: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockRounded, {}) })),
                                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "Toggle password visibility", onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(Visibility, {}) : _jsx(VisibilityOff, {}) }) })),
                                },
                            }, error: touched.password && Boolean(errors.password), helperText: touched.password && errors.password, "aria-label": "Password" }), _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, sx: { mt: 2 }, disabled: isSubmitting, "aria-label": "Login", children: isSubmitting ? 'Logging in...' : 'Login' }), _jsx(Box, { sx: { mt: 1, textAlign: 'center' }, children: _jsx(Link, { to: "/signup", style: { textDecoration: 'none' }, children: _jsx(Typography, { color: "primary", children: "Don't have an account? Sign up" }) }) })] })) })] }));
};
export default Login;
