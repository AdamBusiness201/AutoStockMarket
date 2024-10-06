'use client';
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Analytics from '@/app/(DashboardLayout)/components/shared/Analytics';
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useTranslations } from 'next-intl';
import CreateCarModal from '../components/shared/CreateCarModal';

const timeRanges = [
  { label: 'thisWeek', value: 'thisWeek' },
  { label: 'lastWeek', value: 'lastWeek' },
  { label: 'thisMonth', value: 'thisMonth' },
  { label: 'lastMonth', value: 'lastMonth' },
  { label: 'lifetime', value: 'lifetime' },
];

const Dashboard = ({ params }) => {
  const [selectedRange, setSelectedRange] = useState('lifetime'); // Default time range
  const t = useTranslations('default.Dashboard');

  const handleTabChange = (event, newValue) => {
    setSelectedRange(newValue);
  };

  return (
    <PageContainer title={t('title')} description={t('description')} lang={params.lang}>
      {/* Time Range Tabs */}
      <Box mb={2}>
        <Tabs
          value={selectedRange}
          onChange={handleTabChange}
          aria-label="time range tabs"
        >
          {timeRanges.map((range) => (
            <Tab key={range.value} label={t(`timeRanges.${range.value}`)} value={range.value} />
          ))}
        </Tabs>
      </Box>

      {/* Dashboard Card */}
      <DashboardCard title={`${t('dashboardTitle')}${t(`timeRanges.${selectedRange}`)}`}>
        <Analytics locale={params.locale} timeRange={selectedRange}/>
      </DashboardCard>
    </PageContainer>
  );
};

export default Dashboard;
