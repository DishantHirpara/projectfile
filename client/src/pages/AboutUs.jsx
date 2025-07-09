import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Home as HomeIcon,
  Security as SecurityIcon,
  FormatQuote as FormatQuoteIcon,
  SupportAgent as SupportAgentIcon,
  SentimentSatisfiedAlt as SatisfactionIcon,
} from '@mui/icons-material';

import '../styles/AboutUs.scss';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Dishant Hirpara',
      role: 'Founder & CEO',
      image: '/assets/dishant_photo.jpeg',
      bio: 'Dishant founded Shree Hari Rental Property with a vision to transform how people experience travel accommodations. His background in hospitality and technology helped shape our customer-first approach.'
    },
    {
      name: 'Dhavan Hirpara',
      role: 'CTO',
      image: '/assets/team/team2.jpg',
      bio: 'Dhavan oversees all technical aspects of Shree Hari Rental Property. With 15 years of experience in software development, he ensures our platform remains cutting-edge and user-friendly.'
    },
    {
      name: 'Priya Hirpara',
      role: 'Head of Customer Experience',
      image: '/assets/team/team3.jpg',
      bio: 'Priya is passionate about ensuring every guest has an exceptional stay. She leads our customer support team and helps hosts optimize their listings.'
    },
    {
      name: 'Rajesh Hirpara',
      role: 'Marketing Director',
      image: '/assets/team/team4.jpg',
      bio: 'Rajesh brings creative vision to our brand. His innovative marketing strategies have helped Shree Hari Rental Property grow into the trusted platform it is today.'
    }
  ];

  const values = [
    {
      title: 'Trust & Safety',
      description: 'We prioritize the safety of our community through comprehensive verification processes and 24/7 support.',
      icon: <SecurityIcon />
    },
    {
      title: 'Customer Satisfaction',
      description: 'We go above and beyond to ensure both hosts and guests have exceptional experiences through our platform.',
      icon: <SatisfactionIcon />
    },
    {
      title: 'Community',
      description: 'We foster a global community that breaks down barriers and creates meaningful connections.',
      icon: <HomeIcon />
    },
    {
      title: 'Support',
      description: 'Our dedicated support team is available around the clock to assist with any questions or concerns.',
      icon: <SupportAgentIcon />
    }
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="about-hero">
        <div className="overlay"></div>
        <Container>
          <Typography variant="h3" component="h1" className="page-title">
            About Shree Hari Rental Property
          </Typography>
          <Typography variant="h5" className="hero-subtitle">
            Your Home Away From Home
          </Typography>
        </Container>
      </div>
      
      {/* Our Story Section */}
      <section className="about-section">
        <Container>
          <Typography variant="h3" className="section-title">
            Our Story
          </Typography>
          
          <Grid container spacing={4} className="story-content">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                Shree Hari Rental Property was founded in 2018 with a simple yet powerful vision: to create a world where you can belong anywhere. What began as an idea to help travelers find unique accommodations has evolved into a global platform that connects people from all walks of life.
              </Typography>
              <Typography variant="body1" paragraph>
                Our founders recognized that traditional accommodations often lacked the personal touch and authenticity that modern travelers craved. They envisioned a platform where hosts could share their spaces and local knowledge, while guests could experience destinations like a local.
              </Typography>
              <Typography variant="body1">
                Today, Shree Hari Rental Property hosts have welcomed over 1 million guests in more than 100 countries. We continue to grow our community of hosts and travelers, united by the belief that meaningful travel experiences create a more connected world.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <img 
                src="/assets/barn_cat.jpg" 
                alt="Shree Hari Rental Property Story" 
                className="story-image"
              />
            </Grid>
          </Grid>
        </Container>
      </section>
      
      {/* Our Values Section */}
      <section className="values-section">
        <Container>
          <Typography variant="h3" className="section-title">
            Our Values
          </Typography>
          
          <Grid container spacing={4} className="values-grid">
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={2} className="value-card">
                  <div className="value-icon">
                    {value.icon}
                  </div>
                  <Typography variant="h5" className="value-title">
                    {value.title}
                  </Typography>
                  <Typography variant="body2">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
      
      {/* Testimonial Section */}
      <section className="about-section">
        <Container>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <FormatQuoteIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" paragraph>
                  "Shree Hari Rental Property has transformed our travel experiences. We've stayed in the most incredible homes and met amazing hosts who made our trips unforgettable. It's more than just accommodation - it's about authentic connections."
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                Akshay & Aayushi Patel
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Shree Hari Rental Property users since 2024
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>
      
      {/* Team Section */}
      <section className="about-section team-section">
        <Container>
          <Typography variant="h3" className="section-title">
            Meet Our Team
          </Typography>
          
          <Grid container spacing={4} className="team-grid">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={2} className="team-card">
                  <Avatar 
                    src={member.image} 
                    alt={member.name}
                    className="team-avatar"
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography variant="h6" className="team-name">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" className="team-role">
                    {member.role}
                  </Typography>
                  <Typography variant="body2" className="team-bio">
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Grid container spacing={4} className="stats-grid">
            <Grid item xs={12} sm={4}>
              <Box className="stat-item">
                <Typography variant="h2" className="stat-number">
                  1k+
                </Typography>
                <Typography variant="h6" className="stat-label">
                  Happy Guests
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box className="stat-item">
                <Typography variant="h2" className="stat-number">
                  10+
                </Typography>
                <Typography variant="h6" className="stat-label">
                  Countries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box className="stat-item">
                <Typography variant="h2" className="stat-number">
                  500+
                </Typography>
                <Typography variant="h6" className="stat-label">
                  Properties
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs; 