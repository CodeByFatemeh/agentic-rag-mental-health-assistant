import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  AccountCircle,
  LockRounded,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { LoginFormValues } from '../types'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const [showPassword, setShowPassword] = React.useState(false)
  const { isLoggedIn, user, login } = useAuth()
  const initialValues: LoginFormValues = { email: '', password: '' }

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, user, navigate, from])

  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password) // Call the context's login function
      toast.success('Login successful!', { id: 'login' })
      navigate(from, { replace: true });

    } catch (error) {
      // Handle login failure
      console.log('Login failed:', error)
      toast.error(
        'Login failed. Please check your credentials and try again.',
        { id: 'login' }
      )
    }
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
          padding: 4,
          borderRadius: 2,
          boxShadow: '10px 10px 20px #000'
        }}
      >
        <Box
          sx={{
            width: '350px',
            pb: 3
          }}
        >
          <Typography variant='h5'>Welcome to MindEase</Typography>
          <Typography variant='body1'>
            Sign in to your account and access our compassionate AI chatbot for
            mental health support.
          </Typography>
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isValid,
            dirty
          }) => (
            <Box
              component='form'
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
                // minHeight: '100vh'
              }}
            >
              {/* {errors.email && touched.email && (
                <Alert severity='error'>{errors.email}</Alert>
              )} */}
              <TextField
                label='Email'
                name='email'
                variant='outlined'
                fullWidth
                margin='normal'
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
              />

              {/* {errors.password && touched.password && (
                <Alert severity='error'>{errors.password}</Alert>
              )} */}
              <TextField
                label='Password'
                name='password'
                variant='outlined'
                fullWidth
                margin='normal'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockRounded />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControlLabel control={<Checkbox />} label='Remember me' />

              <Button
                variant='contained'
                color='primary'
                type='submit'
                fullWidth
                disabled={!(isValid && dirty)}
              >
                Login
              </Button>

              <Link to='/signup'>New User? Sign Up</Link>
            </Box>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default LoginPage
