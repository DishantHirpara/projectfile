import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText 
} from '@mui/material';
import { 
  Person, 
  MeetingRoom, 
  Apartment, 
  CurrencyRupee, 
  Verified, 
  TrendingUp, 
  StarBorder 
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import '../styles/AdminDashboard.scss';

const StatCard = ({ title, value, icon, isLoading, color }) => (
  <Card elevation={3} className={`stat-card ${color}`}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" className="stat-title">{title}</Typography>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h4" className="stat-value">{value}</Typography>
          )}
        </Box>
        <Box className="stat-icon-container">
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const RecentBookingsCard = ({ bookings, isLoading }) => (
  <Card elevation={3} className="bookings-card">
    <CardHeader 
      title="Recent Bookings" 
      titleTypographyProps={{ variant: 'h6', className: 'card-title' }}
    />
    <Divider />
    <CardContent>
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography>No recent bookings found.</Typography>
      ) : (
        <List className="booking-list">
          {bookings.map((booking, index) => (
            <ListItem key={booking._id || index} className="booking-item">
              <ListItemAvatar>
                <Avatar className="booking-avatar">
                  {booking.customerId?.firstName?.charAt(0) || 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" className="booking-name">
                    {booking.customerId?.firstName} {booking.customerId?.lastName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" className="booking-details">
                      {booking.listingId?.title || 'Property booking'}
                    </Typography>
                    <Typography variant="body2" className="booking-date">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <Box className={`booking-status ${booking.paymentStatus || 'pending'}`}>
                {booking.paymentStatus || 'pending'}
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </CardContent>
  </Card>
);

const FeatureCard = ({ title, icon, description }) => (
  <Card elevation={3} className="feature-card">
    <CardContent>
      <Box className="feature-icon">{icon}</Box>
      <Typography variant="h6" className="feature-title">{title}</Typography>
      <Typography variant="body2" className="feature-description">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const token = useSelector((state) => state.token);
  const [stats, setStats] = useState({
    userCount: 0,
    listingCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
    recentBookings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const featuresData = [
    { 
      title: 'Manage Users', 
      icon: <Person />, 
      description: 'View and manage user accounts, profiles, and permissions.' 
    },
    { 
      title: 'Property Management', 
      icon: <Apartment />, 
      description: 'Add, edit, or remove property listings and update availability.' 
    },
    { 
      title: 'Booking Administration', 
      icon: <MeetingRoom />, 
      description: 'Track and manage all bookings, reservations, and payment statuses.' 
    }
  ];

  return (
    <div className="admin-dashboard">      
      <Grid container spacing={3} className="stats-container">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={stats.userCount} 
            icon={<Person />} 
            isLoading={isLoading} 
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Properties" 
            value={stats.listingCount} 
            icon={<Apartment />} 
            isLoading={isLoading} 
            color="pink"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Bookings" 
            value={stats.bookingCount} 
            icon={<MeetingRoom />} 
            isLoading={isLoading} 
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={<CurrencyRupee />} 
            isLoading={isLoading} 
            color="orange"
          />
        </Grid>
      </Grid>
      
      <Typography variant="h5" className="section-title">
        Admin Features
      </Typography>
      
      <Grid container spacing={3} className="features-container">
        {featuresData.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="h5" className="section-title">
        Recent Activity
      </Typography>
      
      <Grid container spacing={3} className="activity-container">
        <Grid item xs={12} md={7}>
          <RecentBookingsCard bookings={stats.recentBookings} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card elevation={3} className="quicklinks-card">
            <CardHeader 
              title="Quick Stats" 
              titleTypographyProps={{ variant: 'h6', className: 'card-title' }}
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="quicklink-avatar verification">
                      <Verified />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Verified Properties"
                    secondary={`${Math.round(stats.listingCount * 0.8)} of ${stats.listingCount}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="quicklink-avatar trends">
                      <TrendingUp />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Booking Rate"
                    secondary="13% increase this month"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className="quicklink-avatar reviews">
                      <StarBorder />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Average Rating"
                    secondary="4.7 out of 5"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard; 