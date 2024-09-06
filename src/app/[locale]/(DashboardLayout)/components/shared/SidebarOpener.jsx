'use client';
import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import Cookie from 'js-cookie';

const SidebarOpener = ({ toggleSidebar, isSidebarOpen }) => {

  const handleToggleSidebar = () => {
    toggleSidebar(!isSidebarOpen);
  };

  return (
    <IconButton
      onClick={handleToggleSidebar} // Use handleToggleSidebar here
      sx={{
        zIndex: 1300,
        background: "#8522c1",
        borderRadius: "50%",
        color: "white",
      }}
    >
      {isSidebarOpen ? <Close /> : <MenuIcon />}
    </IconButton>
  );
};

export default SidebarOpener;
