import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Popover, List, ListItem, ListItemText } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from './Profile';
import axios from 'axios';
import LanguageSelector from '../../components/shared/LanguageSelector';


// Define your notification API endpoint
const NOTIFICATION_API_ENDPOINT = '/api/notification';

const Header = ({ toggleMobileSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
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

  // Function to handle opening the popover
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Determine whether popover is open
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

        {/* Notification icon with badge */}
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          aria-controls="notifications-menu"
          aria-haspopup="true"
          onClick={handlePopoverOpen}
        >
          <Badge badgeContent={notifications.count} color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <LanguageSelector />
        {/* Notifications Popover */}
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
              width: '300px', // Adjust width as needed
              borderRadius: '8px', // Add border radius
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow
            },
          }}
        >
          <Box sx={{ p: 1, px: 2 }}>
            <List sx={{ overflowY: 'auto', maxHeight: '300px' }}> {/* Add overflow and max-height */}
              {notifications.length>0 ?( notifications?.notifications?.map((notification, index) => (
                <ListItem key={index} disablePadding sx={{ borderBottom: '1px solid #f0f2f5' }}> {/* Add border bottom */}
                  <ListItemText primary={notification.message} primaryTypographyProps={{ variant: 'body1' }} /> {/* Adjust typography */}

                </ListItem>
              ))) : (
                <ListItem disablePadding sx={{ textAlign: "center" }}> {/* Add border bottom */}
                  <ListItemText primary={"No Notifications"} primaryTypographyProps={{ variant: 'body1' }} /> {/* Adjust typography */}

                </ListItem>
              )}
            </List>
          </Box>
        </Popover>


        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
