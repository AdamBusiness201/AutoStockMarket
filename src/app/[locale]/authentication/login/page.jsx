'use client'

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import Cookies from "js-cookie";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://b-circles.co/">
        B-Circles
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/admin/sign-in", formData);
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        router.push("/en");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Grid container component="main" sx={{
        background: 'transparent',
        height: '100vh',
        backgroundImage: 'linear-gradient(to bottom, #361e62, #000)', // Gradient background
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          component={Paper}
          elevation={6}
          square
          sx={{
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: 1,
            minHeight: '100vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              width: { xs: '90%', md: '70%' },
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
              backdropFilter: "blur(10px)", // Blur effect
              borderRadius: 3,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Shadow effect
              border: "1px solid rgba(255, 255, 255, 0.3)", // Border to enhance glass effect
              overflow: 'hidden'
            }}
          >
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: '#f0f0f0' }}>
  <Box sx={{ textAlign: 'center' }}>
    <Logo width={225}/>
    <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold', color: '#522e8d' }} gutterBottom>
      Welcome Back!
    </Typography>
    <Typography variant="h6" sx={{ mt: 2, mb: 2, color: '#666' }}>
      What you need to manage your business in one software!
    </Typography>
    <Typography variant="body1" sx={{ color: '#888' }}>
      Sign in to continue to your account.
    </Typography>
  </Box>
</Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', p: 4, backgroundColor: "rgba(255, 255, 255, 0.8)", }}>

              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#522e8d'  }}>
                  Sign in
                </Typography>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  required
                  value={formData.username}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="password"
                  label="Password"
                  fullWidth
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  sx={{ borderRadius: 10, backgroundColor: "#522e8d" }}
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs>
                    <Link href="#" variant="body2" sx={{ color: "#522e8d" }}>
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2" sx={{ color: "#522e8d" }}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
  );
}
