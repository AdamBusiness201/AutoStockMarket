'use client'
import React from 'react';
import { Box, Container, CardActions, Col, Row, Stack, Button, Typography, IconButton, Grid, Card, CardContent, useMediaQuery } from '@mui/material';
import { FiArrowRight, FiBox, FiCopy, FiSmile, FiSliders, FiGrid, FiThumbsUp, FiLock, FiSearch, FiUserPlus, FiFlag, FiTrendingUp, FiToggleLeft, FiTerminal, FiCode } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import Logo from './layout/shared/logo/Logo';


const Home = ({params: { locale }}) => {
  return (
    <Box>
      <HeroSection locale={locale}/>
      <HighlightsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
    </Box>
  );
};

const HeroSection = ({locale}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #552e8db3, transparent)',
        py: 10,
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} lg={12}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ textAlign: "center", fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', lg: '3rem' },textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', lineHeight: "3.25rem", color: "white" }}
            >
              Build beautiful software faster
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", mb: 4, fontSize: { xs: '1rem', lg: '1.25rem' }, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}
            >
              Our system simplifies car store management, streamlining inventory, sales, and customer relations for a seamless experience.
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" color="primary" href={`${locale}/authentication/register`} size="large" sx={{ mr: 2 }}>
                Sign Up
              </Button>
              <Button variant="outlined" href={`${locale}/authentication/login`} size="large" endIcon={<FiArrowRight />}>
                Login
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const HighlightsSection = () => {
  return (
    <Box sx={{ py: 10, textAlign: 'start', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography variant="h5" color="textSecondary">
          Get started with <em>advanced car store management</em>. Our system includes inventory tracking, sales analytics, customer management, and automated notifications.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, backgroundColor: 'primary.main', p: 2, borderRadius: '25px' }}>
          <Typography color="yellow" component="span">yarn add </Typography>
          <Typography color="cyan" component="span">@car-store-management/system</Typography>
          <IconButton color="inherit" aria-label="Copy install command" sx={{ ml: 2 }}>
            <FiCopy />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};
const PricingSection = () => {
  const plans = [
    {
      title: 'Basic',
      price: '$19',
      features: [
        'Inventory Tracking',
        'Basic Sales Analytics',
        'Customer Management',
      ],
    },
    {
      title: 'Pro',
      price: '$49',
      features: [
        'Advanced Inventory Tracking',
        'Detailed Sales Analytics',
        'Customer Management',
        'Automated Notifications',
      ],
    },
    {
      title: 'Enterprise',
      price: 'Contact Us',
      features: [
        'All Pro Features',
        'Custom Integrations',
        'Priority Support',
        'Dedicated Account Manager',
      ],
    },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" color="primary.main" gutterBottom>
          Pricing Plans
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 6 }}>
          Choose the plan that suits your needs best.
        </Typography>
        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" color="primary.main" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" gutterBottom>
                    {plan.price}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {plan.features.map((feature, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        {feature}
                      </Box>
                    ))}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', marginBottom: 3 }}>
                  <Button variant="contained" color="primary">
                    Choose Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};




const FeaturesSection = () => {
  const features = [
    { title: "Accessible", icon: FiSmile, description: "All components strictly follow WAI-ARIA standards." },
    { title: "Themable", icon: FiSliders, description: "Fully customize all components to your brand with theme support and style props." },
    { title: "Composable", icon: FiGrid, description: "Compose components to fit your needs and mix them together to create new ones." },
    { title: "Productive", icon: FiThumbsUp, description: "Designed to reduce boilerplate and fully typed, build your product at speed." },
    { title: "Components", icon: FiBox, description: "All premium components are available on a private NPM registery, no more copy pasting and always up-to-date." },
    { title: "Starterkits", icon: FiLock, description: "Example apps in Next.JS, Electron. Including authentication, billing, example pages, everything you need to get started FAST." },
    { title: "Documentation", icon: FiSearch, description: "Extensively documented, including storybooks, best practices, use-cases and examples." },
    { title: "Onboarding", icon: FiUserPlus, description: "Add user onboarding flows, like tours, hints and inline documentation without breaking a sweat." },
    { title: "Feature flags", icon: FiFlag, description: "Implement feature toggles for your billing plans with easy to use hooks. Connect Flagsmith, or other remote config services once you're ready." },
    { title: "Upselling", icon: FiTrendingUp, description: "Components and hooks for upgrade flows designed to make upgrading inside your app frictionless." },
    { title: "Themes", icon: FiToggleLeft, description: "Includes multiple themes with darkmode support, always have the perfect starting point for your next project." },
    { title: "Generators", icon: FiTerminal, description: "Extend your design system while maintaining code quality and consistency with built-in generators." },
    { title: "Monorepo", icon: FiCode, description: <Link href="https://turborepo.com">Turborepo</Link> },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Not your standard dashboard template.
        </Typography>
        <Typography paragraph>
          Saas UI Pro includes everything you need to build modern frontends. Use it as a template for your next product or foundation for your design system.
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    <feature.icon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    {feature.title}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const TestimonialsSection = () => {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
          Testimonials
        </Typography>
        <Typography>
          “Saas UI helped us set up a beautiful modern UI in no time. It saved us hundreds of hours in development time and allowed us to focus on business logic for our specific use-case from the start.” - Renata Alink, Founder
        </Typography>
      </Container>
    </Box>
  );
};

const FaqSection = () => {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
          FAQ
        </Typography>
        <Typography>
          Find answers to the most frequently asked questions.
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;
