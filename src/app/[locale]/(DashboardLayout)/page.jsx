'use client'
import React, { useState } from 'react';
import { Box, Button, Collapse, Typography, IconButton, Link } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Analytics from '@/app/(DashboardLayout)/components/shared/Analytics';
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const Dashboard = ({ params }) => {
  const [isQuickActionsOpen, setQuickActionsOpen] = useState(true);

  const handleQuickActionsToggle = () => {
    setQuickActionsOpen(!isQuickActionsOpen);
  };

  const handleAddNewCar = () => {
    // Add logic to handle adding a new car
    console.log("Add new car button clicked!");
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard" lang={params.lang}>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={handleQuickActionsToggle}
            cursor="pointer"
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>

            <IconButton>
              {isQuickActionsOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>

          </Box>
          <Collapse in={isQuickActionsOpen}>
            <Box>
              <Link href="/en/CarsInventory/Cars?CreateCar=true" target="_blank" underline="none">
                <DashboardCard title={"Add New Car"} />
              </Link>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Analytics />
      </DashboardCard>
    </PageContainer>
  );
};

export default Dashboard;
