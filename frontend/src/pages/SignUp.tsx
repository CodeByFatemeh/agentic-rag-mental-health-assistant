import React, { useCallback } from 'react'
import { Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  // Alert,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  AccountCircle,
  LockRounded,
  EmailRounded,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import AuthService from '../services/authService.js'
import { SignupFormValues } from '@/types'

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required')
})

const SignupPage = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const handlePasswordVisibility = useCallback(
    (field: 'password' | 'confirmPassword') => {
      if (field === 'password') {
        setShowPassword(prev => !prev)
      } else if (field === 'confirmPassword') {
        setShowConfirmPassword(prev => !prev)
      }
    },
    []
  )

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        // minHeight: '100vh',
        backgroundImage: `url('/path/to/background-image.jpg')`, // background image
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
          padding: 4,
          borderRadius: 2,
          boxShadow: '10px 10px 20px #000'
          // border: 'none'
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
            Find support and guidance on your mental health journey with our
            compassionate AI chatbot.
          </Typography>
        </Box>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={async (
            values: SignupFormValues,
            { setSubmitting, setErrors }: FormikHelpers<SignupFormValues>
          ) => {
            try {
              // Call AuthService signup API
              const response = await AuthService.signup({
                name: values.name,
                email: values.email,
                password: values.password
              })

              console.log('Signup successful:', response)
            } catch (error: unknown) {
              console.error('Signup failed:', error)

              if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { errors?: { path: string, msg: string }[] } } };
            
                if (axiosError.response?.data?.errors) {
                  // Extract validation errors from backend response
                  const backendErrors: Record<string, string> = {};
            
                  axiosError.response.data.errors.forEach((err) => {
                    backendErrors[err.path] = err.msg; // Map error path to message
                  });
            
                  setErrors(backendErrors); // Set Formik errors dynamically
                }
              } else {
                // Generic error message
                setErrors({ email: 'Signup failed, please try again.' });
              }
            } finally {
              setSubmitting(false)
            }
          }}
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
          }: {
            handleSubmit: (
              e?: React.FormEvent<HTMLFormElement> | undefined
            ) => void
            handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
            handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
            values: {
              name: string
              email: string
              password: string
              confirmPassword: string
            }
            touched: {
              name?: boolean
              email?: boolean
              password?: boolean
              confirmPassword?: boolean
            }
            errors: {
              name?: string
              email?: string
              password?: string
              confirmPassword?: string
            }
            isValid: boolean
            dirty: boolean
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
              <TextField
                label='Name'
                name='name'
                variant='outlined'
                fullWidth
                margin='normal'
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
              />
              {/* {errors.name && touched.name && (
                <Alert severity='error'>{errors.name}</Alert>
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
                      <EmailRounded />
                    </InputAdornment>
                  )
                }}
              />
              {/* {errors.email && touched.email && (
                <Alert severity='error'>{errors.email}</Alert>
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
                        onClick={() => handlePasswordVisibility('password')}
                        edge='end'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {/* {errors.password && touched.password && (
                <Alert severity='error'>{errors.password}</Alert>
              )} */}

              <TextField
                label='Confirm Password'
                name='confirmPassword'
                variant='outlined'
                fullWidth
                margin='normal'
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
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
                        onClick={() =>
                          handlePasswordVisibility('confirmPassword')
                        }
                        edge='end'
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              {/* {errors.confirmPassword && touched.confirmPassword && (
                <Alert severity='error'>{errors.confirmPassword}</Alert>
              )} */}

              <FormControlLabel control={<Checkbox />} label='Remember me' />

              <Button
                variant='contained'
                color='primary'
                type='submit'
                fullWidth
                disabled={!(isValid && dirty)}
              >
                Sign Up
              </Button>

              <Link to='/login'>Already have an account? Login</Link>
            </Box>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default SignupPage
