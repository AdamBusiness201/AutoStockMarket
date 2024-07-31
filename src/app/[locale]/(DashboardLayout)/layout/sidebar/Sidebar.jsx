'use client';
import React, { useState } from 'react';
import { useMediaQuery, Box, Drawer, IconButton, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Close } from '@mui/icons-material';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';

const Sidebar = ({ locale }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const sidebarWidth = '270px';

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <CssBaseline />
      <IconButton
        onClick={handleToggleSidebar}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: isSidebarOpen && lgUp ? sidebarWidth : 0,
          zIndex: 1300,
          transition: 'left 0.3s',
          background: "#8522c1",
          borderEndStartRadius: "0px",
          borderStartStartRadius: "0px",
          color: "white",
          '&:hover': {
            background: "#8522c1"
          }
        }}
        disableRipple
      >
        {isSidebarOpen ? <Close /> : <MenuIcon />}
      </IconButton>
      <Drawer
        anchor='left'
        open={isSidebarOpen}
        onClose={handleToggleSidebar}
        variant={lgUp ? 'persistent' : 'temporary'}
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxShadow: (theme) => theme.shadows[8],
            boxSizing: 'border-box',
            background: '#f7f7f7',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            p={3}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1100,
              bgcolor: '#f7f7f7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Logo />
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <SidebarItems locale={locale} />
          </Box>
        </Box>
      </Drawer>
      {lgUp && isSidebarOpen && (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: 'width 0.3s',
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
