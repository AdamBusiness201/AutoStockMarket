'use client';
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Container, Paper, Grid, CssBaseline, Alert, CircularProgress } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Check } from '@mui/icons-material';
const AuthRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123'];
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
      setLoading(true);
      try {
        const response = await axios.post('/api/admin/sign-up', formData);
        console.log(response.data);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.error || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  };
  const features = [
    {
      title: 'Customer Relationship Management',
      description: 'Manage and maintain customer relationships effectively.'
    },
    {
      title: 'Inventory Management',
      description: 'Keep track of your auto inventory with ease.'
    },
    {
      title: 'Maintenance',
      description: 'Manage and schedule maintenance tasks efficiently.'
    },
    {
      title: 'Human Resource Management',
      description: 'Organize and manage your team seamlessly.'
    },
    {
      title: 'Sales & Purchase Management',
      description: 'Handle sales and purchase transactions professionally.'
    },
    {
      title: 'Reports & Analytics',
      description: 'Gain insights with comprehensive reports and analytics.'
    }
  ];

  return (
    <PageContainer title="Register" description="Register for Car Store Management">
      <CssBaseline />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: 'linear-gradient(to bottom, #522e8d, #8e2de2)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 4,
          }}
        >
          <Box textAlign="start" sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Start managing your auto inventory with ASM AutoStockMaster
            </Typography>
            <Box sx={{ p: 2, paddingLeft: 0 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1, color: 'success.main' }}>
                    <Check />
                  </Typography>
                  <Typography variant="body1">
                    <strong>{feature.title}:</strong> {feature.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="body2" sx={{ mt: 4 }}>
              By signing up you agree to our <a href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</a>.
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: '#f0f0f0',
          }}
        >
          <Paper elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography component="h1" variant="h5" sx={{ color: 'primary.main' }}>
              Register
            </Typography>
            {!success ? (
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
      sx={{
        border: 'none',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        '& .MuiInputBase-root': {
          borderBottom: '2px solid transparent',
        },
        '& .MuiInputBase-root.Mui-focused': {
          borderBottom: '2px solid #8e2de2', // Purple color
        },
      }}
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
      sx={{
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        '& .MuiInputBase-root': {
          borderBottom: '2px solid transparent',
        },
        '& .MuiInputBase-root.Mui-focused': {
          borderBottom: '2px solid #8e2de2', // Purple color
        },
      }}
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
      sx={{
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        '& .MuiInputBase-root': {
          borderBottom: '2px solid transparent',
        },
        '& .MuiInputBase-root.Mui-focused': {
          borderBottom: '2px solid #8e2de2', // Purple color
        },
      }}
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
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Registration successful! You can now log in.
              </Typography>
            )}
          </Paper>
        </Grid>

      </Grid>
    </PageContainer>
  );
};

export default AuthRegister;
