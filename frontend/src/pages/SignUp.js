import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, FormControlLabel, Checkbox, 
// Alert,
Typography, InputAdornment, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle, LockRounded, EmailRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../services/authService.js';
const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm Password is required')
});
const SignupPage = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const handlePasswordVisibility = useCallback((field) => {
        if (field === 'password') {
            setShowPassword(prev => !prev);
        }
        else if (field === 'confirmPassword') {
            setShowConfirmPassword(prev => !prev);
        }
    }, []);
    return (_jsx(Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 4,
            // minHeight: '100vh',
            backgroundImage: `url('/path/to/background-image.jpg')`, // background image
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }, children: _jsxs(Box, { sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
                padding: 4,
                borderRadius: 2,
                boxShadow: '10px 10px 20px #000'
                // border: 'none'
            }, children: [_jsxs(Box, { sx: {
                        width: '350px',
                        pb: 3
                    }, children: [_jsx(Typography, { variant: 'h5', children: "Welcome to MindEase" }), _jsx(Typography, { variant: 'body1', children: "Find support and guidance on your mental health journey with our compassionate AI chatbot." })] }), _jsx(Formik, { initialValues: {
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }, validationSchema: SignupSchema, onSubmit: async (values, { setSubmitting, setErrors }) => {
                        var _a, _b;
                        try {
                            // Call AuthService signup API
                            const response = await AuthService.signup({
                                name: values.name,
                                email: values.email,
                                password: values.password
                            });
                            console.log('Signup successful:', response);
                        }
                        catch (error) {
                            console.error('Signup failed:', error);
                            if (error instanceof Error && 'response' in error) {
                                const axiosError = error;
                                if ((_b = (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) {
                                    // Extract validation errors from backend response
                                    const backendErrors = {};
                                    axiosError.response.data.errors.forEach((err) => {
                                        backendErrors[err.path] = err.msg; // Map error path to message
                                    });
                                    setErrors(backendErrors); // Set Formik errors dynamically
                                }
                            }
                            else {
                                // Generic error message
                                setErrors({ email: 'Signup failed, please try again.' });
                            }
                        }
                        finally {
                            setSubmitting(false);
                        }
                    }, children: ({ handleSubmit, handleChange, handleBlur, values, touched, errors, isValid, dirty }) => (_jsxs(Box, { component: 'form', onSubmit: handleSubmit, noValidate: true, sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                            // minHeight: '100vh'
                        }, children: [_jsx(TextField, { label: 'Name', name: 'name', variant: 'outlined', fullWidth: true, margin: 'normal', value: values.name, onChange: handleChange, onBlur: handleBlur, error: touched.name && Boolean(errors.name), helperText: touched.name && errors.name, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(AccountCircle, {}) }))
                                } }), _jsx(TextField, { label: 'Email', name: 'email', variant: 'outlined', fullWidth: true, margin: 'normal', value: values.email, onChange: handleChange, onBlur: handleBlur, error: touched.email && Boolean(errors.email), helperText: touched.email && errors.email, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(EmailRounded, {}) }))
                                } }), _jsx(TextField, { label: 'Password', name: 'password', variant: 'outlined', fullWidth: true, margin: 'normal', type: showPassword ? 'text' : 'password', value: values.password, onChange: handleChange, onBlur: handleBlur, error: touched.password && Boolean(errors.password), helperText: touched.password && errors.password, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(LockRounded, {}) })),
                                    endAdornment: (_jsx(InputAdornment, { position: 'end', children: _jsx(IconButton, { "aria-label": 'toggle password visibility', onClick: () => handlePasswordVisibility('password'), edge: 'end', children: showPassword ? _jsx(Visibility, {}) : _jsx(VisibilityOff, {}) }) }))
                                } }), _jsx(TextField, { label: 'Confirm Password', name: 'confirmPassword', variant: 'outlined', fullWidth: true, margin: 'normal', type: showConfirmPassword ? 'text' : 'password', value: values.confirmPassword, onChange: handleChange, onBlur: handleBlur, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: 'start', children: _jsx(LockRounded, {}) })),
                                    endAdornment: (_jsx(InputAdornment, { position: 'end', children: _jsx(IconButton, { "aria-label": 'toggle password visibility', onClick: () => handlePasswordVisibility('confirmPassword'), edge: 'end', children: showConfirmPassword ? (_jsx(Visibility, {})) : (_jsx(VisibilityOff, {})) }) }))
                                }, error: touched.confirmPassword && Boolean(errors.confirmPassword), helperText: touched.confirmPassword && errors.confirmPassword }), _jsx(FormControlLabel, { control: _jsx(Checkbox, {}), label: 'Remember me' }), _jsx(Button, { variant: 'contained', color: 'primary', type: 'submit', fullWidth: true, disabled: !(isValid && dirty), children: "Sign Up" }), _jsx(Link, { to: '/login', children: "Already have an account? Login" })] })) })] }) }));
};
export default SignupPage;
