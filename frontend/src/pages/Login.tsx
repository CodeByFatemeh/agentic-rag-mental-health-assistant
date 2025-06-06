import { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import { AccountCircle, LockRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { LoginFormValues } from '../types';

/**
 * Login page for user authentication.
 */
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormValues = { email: '', password: '' };

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
    await login(values.email, values.password);
    setSubmitting(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Login to MindEase
      </Typography>
      <Typography variant="body1" color="text.secondary" component={'p'}>
        Sign in to access our compassionate AI chatbot for mental health support.
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
              aria-label="Email address"
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              aria-label="Password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
              aria-label="Login"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography color="primary">Don't have an account? Sign up</Typography>
              </Link>
            </Box>
          </Box>
        )}
      </Formik>
    </Container>
  );
};

export default Login;