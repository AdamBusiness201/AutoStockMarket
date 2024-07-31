'use client';
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Analytics from '@/app/(DashboardLayout)/components/shared/Analytics';
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const timeRanges = [
  { label: 'This Week', value: 'thisWeek' },
  { label: 'Last Week', value: 'lastWeek' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Lifetime', value: 'lifetime' },
];

const Dashboard = ({ params }) => {
  const [selectedRange, setSelectedRange] = useState('thisWeek'); // Default time range

  const handleTabChange = (event, newValue) => {
    setSelectedRange(newValue);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard" lang={params.lang}>
      {/* Time Range Tabs */}
      <Box mb={2}>
        <Tabs
          value={selectedRange}
          onChange={handleTabChange}
          aria-label="time range tabs"
        >
          {timeRanges.map((range) => (
            <Tab key={range.value} label={range.label} value={range.value} />
          ))}
        </Tabs>
      </Box>

      {/* Dashboard Card */}
      <DashboardCard title={`Dashboard of ${timeRanges.find(range => range.value === selectedRange)?.label}`}>
        <Analytics locale={params.locale} timeRange={selectedRange}/>
      </DashboardCard>
    </PageContainer>
  );
};

export default Dashboard;
