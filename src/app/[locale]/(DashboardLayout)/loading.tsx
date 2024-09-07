'use client';
import React from "react";
import { CircularProgress, Box } from "@mui/material";
import '../loading.scss'; // Ensure this file is correctly imported

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        height: "100vh", // Ensure it covers the full viewport height
        overflow: 'hidden', // To contain the animation
        position: 'relative', // Positioning for the road and car images
      }}
    >
      <Box
        className="road"
        sx={{
          position: 'absolute',
          bottom: '20px', // Adjust the distance from the bottom as needed
          width: '100%',
          height: '100px', // Height of the road
          zIndex: 1, // Ensure it's below the car
        }}
      />
      <Box
        component="img"
        src="/images/logos/asm_logo1.png"
        alt="Logo"
        width={500} // Adjust the size as needed
        height={400} // Adjust the size as needed
        className="car-image" // Apply animation class
        sx={{ position: 'relative', zIndex: 2 }} // Ensure the car is above the road
      />
      <CircularProgress sx={{ mt: 2, color: '#1976d2' }} /> {/* Color to match theme */}
    </Box>
  );
};

export default Loading;
