'use client'
import React from "react";
import { CircularProgress, Box, Skeleton } from "@mui/material";
import './loading.scss'

const Loading = (width = 500, height = 250) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        component="img"
        src="/images/logos/asm_logo.png" // Replace with your logo image path
        alt="Logo"
        width={width} // Adjust the size as needed
        height={height} // Adjust the size as needed
        className="pulse"
      />
      <CircularProgress sx={{ mt: 2 }} /> {/* Circular progress indicator */}
    </Box>
  );
};

export default Loading;

