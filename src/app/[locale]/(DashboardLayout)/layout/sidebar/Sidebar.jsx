'use client';
import React, { useState, useEffect } from 'react';
import { useMediaQuery, Box, Drawer, CssBaseline } from '@mui/material';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';
import Cookie from 'js-cookie';

const Sidebar = ({ locale, isSidebarOpen, toggleSidebar }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const sidebarWidth = '270px';


  return (
    <>
      <CssBaseline />
      <Drawer
        anchor={locale === "ar" ? "right" : 'left'}
        open={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
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
