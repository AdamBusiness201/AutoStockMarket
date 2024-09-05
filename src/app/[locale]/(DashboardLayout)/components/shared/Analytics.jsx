import React, { useEffect, useState } from 'react';
import { Grid, Box, TextField, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import axios from 'axios';
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import TopEmployees from '../dashboard/ProductPerformance';
import AnalyticsDashboard from '@/app/(DashboardLayout)/components/dashboard/AnalyticsDashboard';
import { IconCurrencyDollar, IconCar, IconMan } from "@tabler/icons-react";
import moment from 'moment';
import { useTranslations } from 'next-intl';
import ViewDataModal from './ViewData'; // Import the modal

const Analytics = ({ locale, today = false, timeRange }) => {
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(today ? moment(new Date()).format('YYYY-MM-DD') : null);
  const [endDate, setEndDate] = useState(null);
  const [filter, setFilter] = useState('all'); // State for selected filter
  const [filteredData, setFilteredData] = useState({}); // State for filtered data
  const t = useTranslations('default.dashboard');
  const [modalOpen, setModalOpen] = useState(false);

  const formatNumber = (number) => {
    return new Intl.NumberFormat(locale).format(number);
  };

  const fetchData = async () => {
    try {
      const url = `/api/analytics?timeRange=${timeRange}`;
      const queryParams = {};

      if (startDate) {
        queryParams.startDate = moment(startDate).format('YYYY-MM-DD');
      }
      if (endDate) {
        queryParams.endDate = moment(endDate).format('YYYY-MM-DD');
      }

      // Adding filter query parameters
      if (filter !== 'all') {
        queryParams.category = filter;
      }

      const response = await axios.get(url, { params: queryParams });
      setAnalytics(response.data);
      setFilteredData(response.data); // Initialize filtered data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, filter, timeRange]);

  return (
    <Box>
      <ViewDataModal open={modalOpen} handleClose={() => { setModalOpen(false) }} locale={locale} />
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button variant="contained" color="primary" onClick={() => console.log(t('addNewCar'))}>
            {t('addNewCar')}
          </Button>
          <Button variant="outlined" onClick={() => { setModalOpen(true) }}>
            {t('createRowDataView')}
          </Button>
        </Grid>
        {!today && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label={t('fromDate')}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label={t('toDate')}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('filter')}</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label={t('filter')}
            >
              <MenuItem value="all">{t('all')}</MenuItem>
              <MenuItem value="finance">{t('finance')}</MenuItem>
              <MenuItem value="sales">{t('sales')}</MenuItem>
              <MenuItem value="maintenance">{t('maintenance')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={8}>
          <AnalyticsDashboard
            title={t('totalCars')}
            data={formatNumber(filteredData?.totalCars)}
            chartData={filteredData?.carValueChartData}
            chartType="line"
            icon={<IconCar width={24} />}
            iconLink={"/en/CarsInventory/Cars"}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalSoldCars')}
            data={formatNumber(filteredData?.totalSoldCars)}
            chartData={{ labels: [t('totalCars'), t('totalSoldCars')], series: [filteredData?.totalCars, filteredData?.totalSoldCars].map(formatNumber) }}
            chartType="pie"
            icon={<IconCar width={24} />}
            iconLink={"/en/CarsInventory/SoldCars"}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <AnalyticsDashboard
            title={t('totalTransactions')}
            data={formatNumber(filteredData?.totalTransactions)}
            chartData={filteredData?.transactionAmountsChartData}
            chartType="line"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalReceived')}
            data={formatNumber(filteredData?.totalReceived)}
            chartData={{ labels: [t('totalReceived'), t('totalExpenses')], series: [filteredData?.totalReceived, filteredData?.totalExpenses].map(formatNumber) }}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        {/* Continue applying formatNumber to the rest of the data */}
        {/* The rest of your components go here... */}
      </Grid>
    </Box>
  );
};

export default Analytics;
