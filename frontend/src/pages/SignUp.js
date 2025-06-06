import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, LockRounded, EmailRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
/**
 * Signup page for user registration.
 */
const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});
const Signup = () => {
    const { signup } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const initialValues = { name: '', email: '', password: '', confirmPassword: '' };
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            await signup(values.name, values.email, values.password);
            setSubmitting(false);
        }
        catch (error) {
            console.error('Signup error:', error);
            setErrors({ email: 'Signup failed, please try again.' });
            setSubmitting(false);
        }
    };
    return (_jsxs(Container, { maxWidth: "sm", sx: { mt: 8 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Sign Up for MindEase" }), _jsx(Typography, { variant: "body1", color: "text.secondary", component: "p", children: "Create an account to access our compassionate AI chatbot." }), _jsx(Formik, { initialValues: initialValues, validationSchema: SignupSchema, onSubmit: handleSubmit, children: ({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (_jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 2 }, children: [_jsx(TextField, { label: "Name", name: "name", fullWidth: true, margin: "normal", value: values.name, onChange: handleChange, onBlur: handleBlur, error: touched.name && Boolean(errors.name), helperText: touched.name && errors.name, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(AccountCircle, {}) })),
                            }, "aria-label": "Full name" }), _jsx(TextField, { label: "Email", name: "email", type: "email", fullWidth: true, margin: "normal", value: values.email, onChange: handleChange, onBlur: handleBlur, error: touched.email && Boolean(errors.email), helperText: touched.email && errors.email, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(EmailRounded, {}) })),
                            }, "aria-label": "Email address" }), _jsx(TextField, { label: "Password", name: "password", type: showPassword ? 'text' : 'password', fullWidth: true, margin: "normal", value: values.password, onChange: handleChange, onBlur: handleBlur, error: touched.password && Boolean(errors.password), helperText: touched.password && errors.password, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockRounded, {}) })),
                                endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "Toggle password visibility", onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(Visibility, {}) : _jsx(VisibilityOff, {}) }) })),
                            }, "aria-label": "Password" }), _jsx(TextField, { label: "Confirm Password", name: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', fullWidth: true, margin: "normal", value: values.confirmPassword, onChange: handleChange, onBlur: handleBlur, error: touched.confirmPassword && Boolean(errors.confirmPassword), helperText: touched.confirmPassword && errors.confirmPassword, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockRounded, {}) })),
                                endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "Toggle confirm password visibility", onClick: () => setShowConfirmPassword(!showConfirmPassword), edge: "end", children: showConfirmPassword ? _jsx(Visibility, {}) : _jsx(VisibilityOff, {}) }) })),
                            }, "aria-label": "Confirm password" }), _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, sx: { mt: 2 }, disabled: isSubmitting, "aria-label": "Sign up", children: isSubmitting ? 'Signing up...' : 'Sign Up' }), _jsx(Box, { sx: { mt: 1, textAlign: 'center' }, children: _jsx(Link, { to: "/login", style: { textDecoration: 'none' }, children: _jsx(Typography, { color: "primary", children: "Already have an account? Login" }) }) })] })) })] }));
};
export default Signup;
