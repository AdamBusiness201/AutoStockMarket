'use client';
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Popover, List, ListItem, ListItemText, Typography } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from './Profile';
import axios from 'axios';
import SidebarOpener from '../../components/shared/SidebarOpener';

// Define your notification API endpoint
const NOTIFICATION_API_ENDPOINT = '/api/notification';

const Header = ({ toggleMobileSidebar, toggleSidebar, isSidebarOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: !isScrolled
      ? 'linear-gradient(223deg, #481268, #6a1b9a)' // Gradient with transparency on scroll
      : 'linear-gradient(90deg, #6a1b9a, #6a1b9a)', // Solid purple when not scrolled
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'background 1s ease',
    [theme.breakpoints.up('lg')]: {
      minHeight: '50px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(NOTIFICATION_API_ENDPOINT);
        if (response.status !== 200) {
          throw new Error('Failed to fetch notifications');
        }
        setNotifications(response.data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>



        <Stack direction="row" alignItems="center">
          <SidebarOpener toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            aria-controls="notifications-menu"
            aria-haspopup="true"
            onClick={handlePopoverOpen}
            sx={{
              background: "#8522c1",
              marginX: 1,
            }}
          >
            <Badge badgeContent={notifications.count} color="primary">
              <IconBellRinging size="21" stroke="1.5" color='white' />
            </Badge>
          </IconButton>
        </Stack>

        <Popover
          id="notifications-menu"
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: '300px',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 1, px: 2 }}>
            <List sx={{ overflowY: 'auto', maxHeight: '300px' }}>
              {notifications?.notifications?.length > 0 ? (
                notifications.notifications.map((notification, index) => (
                  <ListItem key={index} disablePadding sx={{ borderBottom: '1px solid #f0f2f5' }}>
                    <ListItemText primary={notification.message} primaryTypographyProps={{ variant: 'body1' }} />
                  </ListItem>
                ))
              ) : (
                <ListItem disablePadding sx={{ textAlign: "center" }}>
                  <ListItemText primary={"No Notifications"} primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
              )}
            </List>
          </Box>
        </Popover>
        {/* Centered Logo and Title */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Box
            component="img"
            src="/images/logos/logo-asm.png"
            alt="Logo"
            sx={{ height: '90px', marginRight: '8px' }} // Adjust height and margin as needed
          /> */}
          <Typography variant="h6" component="div" color="white">
            Auto Stock Master
          </Typography>
        </Box>
        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
