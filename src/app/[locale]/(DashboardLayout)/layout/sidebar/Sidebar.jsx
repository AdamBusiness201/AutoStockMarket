'use client';
import React, { useState } from 'react';
import { useMediaQuery, Box, Drawer, IconButton } from '@mui/material';
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
      <IconButton
        onClick={handleToggleSidebar}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: isSidebarOpen ? sidebarWidth : 16,
          zIndex: 1300,
          transition: 'left 0.3s',
          background: "#f7f7f7",
          borderEndStartRadius: "0px",
          borderStartStartRadius: "0px"
        }}
      >
        {isSidebarOpen ? <Close /> : <MenuIcon/>}
      </IconButton>
      <Drawer
        anchor={lgUp ? 'left' : 'left'}
        open={isSidebarOpen}
        onClose={handleToggleSidebar}
        variant={lgUp ? 'temporary' : 'temporary'}
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxShadow: (theme) => theme.shadows[8],
            boxSizing: 'border-box',
            background: '#f7f7f7',
            ...(locale === 'ar' ? { right: '0px' } : { left: '0px' }),
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
    </>
  );
};

export default Sidebar;
