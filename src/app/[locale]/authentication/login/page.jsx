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
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import Cookies from "js-cookie";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sx={{
            backgroundImage: 'url("/images/backgrounds/login-bg.jpg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
        <Grid
          item
          xs={12}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'rgb(10 9 9 / 11%)', // Slightly transparent white background
            backdropFilter: 'blur(10px)', // Blur effect for background
            zIndex: 1,
            minHeight: '100vh',
          }}
        >
          <Box
            sx={{
              padding: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
              backdropFilter: "blur(10px)", // Blur effect
              borderRadius: 5,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Shadow effect
              border: "1px solid rgba(255, 255, 255, 0.3)", // Border to enhance glass effect
            }}
          >
            <Image src="/images/logos/asm_logo.png" alt="Company Logo" width={200} height={100} />
            <Box sx={{ mt: 3 }}>
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
                onClick={handleSubmit}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
              <Grid container sx={{ mt: 1 }}>
                <Grid item xs>
                  <Link href="#" variant="body2" sx={{color: "#522e8d"}}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" sx={{color: "#522e8d"}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
