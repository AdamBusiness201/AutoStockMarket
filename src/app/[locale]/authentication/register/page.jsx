'use client'
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Paper, Grid, CssBaseline, Alert, CircularProgress } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AuthRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status
  const [success, setSuccess] = useState(false); // State to track success status
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Input validations
    const errors = {};
    if (name === 'username' && value.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      errors.email = 'Invalid email address';
    } else if (name === 'password') {
      checkPasswordStrength(value);
    }
    setFormErrors(errors);
  };

  const checkPasswordStrength = (password) => {
    // Basic password strength check
    const strengthRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (strengthRegex.test(password)) {
      setPasswordStrength('Strong');
    } else if (password.length >= 8) {
      setPasswordStrength('Medium');
    } else if (password.length > 0) {
      setPasswordStrength('Weak');
    } else {
      setPasswordStrength('');
    }

    // Password suggestions
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123']; // Add more common passwords if needed
    const suggestions = commonPasswords.filter((commonPassword) => commonPassword.includes(password.toLowerCase()));
    setPasswordSuggestions(suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setLoading(true); // Set loading state to true when form is submitted
      try {
        const response = await axios.post('/api/admin/sign-up', formData);
        console.log(response.data);
        setSuccess(true); // Set success state to true after successful registration
      } catch (err) {
        setError(err.response?.data?.error || 'An unexpected error occurred');
      } finally {
        setLoading(false); // Reset loading state after request completes
      }
    }
  };

  return (
    <PageContainer title="Register" description="Register for Car Store Management">
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      ></Box>
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <CssBaseline />
        <Paper elevation={0} sx={{ my: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '20px' }}>
          <Typography component="h1" variant="h5" sx={{ color: 'primary.main' }}>
            Register
          </Typography>
          {!success ? ( // Render the registration form if success state is false
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    label="Username"
                    autoFocus
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    sx={{ background: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{ background: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password || (passwordStrength && `Password strength: ${passwordStrength}`)}
                    sx={{ background: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px' }}
                  />
                  {passwordSuggestions.length > 0 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      Common passwords detected: {passwordSuggestions.join(', ')}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color='primary'
                sx={{ mt: 3, mb: 2, borderRadius: '20px' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </Box>
          ) : ( // Render the success message if success state is true
            <Typography variant="body1" sx={{ mt: 2 }}>
              Registration successful! You can now log in.
            </Typography>
          )}
        </Paper>
      </Container>
    </PageContainer>
  );
};

export default AuthRegister;
