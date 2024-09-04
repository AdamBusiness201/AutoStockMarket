'use client'
import React from "react";
import { CircularProgress, Box } from "@mui/material";
import '../loading.scss'; // Make sure to style this properly in your CSS file

const Loading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
        zIndex: 1300, // To make sure it's on top of other content
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow for a floating effect
          width: "50%"

        }}
      >
        <Box
          component="img"
          src="/images/logos/asm_logo.png"
          alt="Logo"
          width={500} // Adjust the size as needed
          height={250} // Adjust the size as needed
          className="pulse"
        />
        <CircularProgress sx={{ mt: 2, color: '#1976d2' }} /> {/* Color to match theme */}
      </Box>
    </Box>
  );
};

export default Loading;
