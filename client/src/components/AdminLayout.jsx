import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  IconButton,
  Container, 
  Button, 
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Dashboard, 
  People, 
  Business, 
  BookOnline, 
  Logout, 
  Menu as MenuIcon,
  ExpandMore,
  Person,
  Home,
  Email
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../redux/state';
import UserProfileModal from './UserProfileModal';
import '../styles/AdminLayout.scss';

const AdminLayout = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/admin/login');
    handleClose();
  };

  const goToHome = () => {
    navigate('/');
  };

  const openProfileModal = () => {
    handleClose();
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Properties', icon: <Business />, path: '/admin/properties' },
    { text: 'Bookings', icon: <BookOnline />, path: '/admin/bookings' },
    { text: 'Contacts', icon: <Email />, path: '/admin/contacts' },
    { text: 'Profile', icon: <Person />, path: '/admin/profile' },
  ];

  return (
    <div className="admin-layout">
      {/* Top Navigation Bar */}
      <AppBar position="fixed" className="admin-navbar">
        <Toolbar className="admin-toolbar">
          <div className="admin-logo" onClick={goToHome}>
            <a href='/'><img src="/assets/logo_1.png" alt="Shree Hari Rental Property" /></a>
          </div>
          
          <IconButton
            className="menu-button"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <NavLink 
                key={item.text}
                to={item.path}
                className={({ isActive }) => 
                  isActive ? "admin-nav-link active" : "admin-nav-link"
                }
              >
                {item.text}
              </NavLink>
            ))}
          </Box>
          
          <div className="admin-profile">
            <Button
              onClick={handleMenu}
              className="profile-button"
              startIcon={<MenuIcon />}
              endIcon={
                user?.profileImagePath ? (
                  <Avatar
                    src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`}
                    alt={user.firstName}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Person />
                )
              }
            >
              Admin
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={openProfileModal}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={goToHome}>
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText>Go to Website</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        className="admin-drawer"
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <div className="drawer-header">
          <Typography variant="h6">Shree Hari Rental Property Admin</Typography>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <NavLink 
              to={item.path} 
              key={item.text}
              className="drawer-link"
              onClick={handleDrawerToggle}
            >
              {({ isActive }) => (
                <ListItem 
                  button 
                  className={isActive ? "active" : ""}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )}
            </NavLink>
          ))}
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      
      {/* Main Content Area */}
      <Box
        component="main"
        className="admin-content"
      >
        {/* Hero Banner Section */}
        <div className="admin-banner">
          <Typography variant="h3" component="h1">
            Admin Dashboard
          </Typography>
          <Typography variant="h6">
            Welcome to the Admin Dashboard
          </Typography>
        </div>
        
        {/* Page Content */}
        <Container maxWidth="xl" className="page-container">
          <Outlet />
        </Container>
      </Box>

      {/* User Profile Modal */}
      <UserProfileModal 
        open={profileModalOpen} 
        onClose={closeProfileModal} 
        user={user} 
      />
    </div>
  );
};

export default AdminLayout; 