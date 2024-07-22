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

const Analytics = ({ params, today = false }) => {
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(today ? moment(new Date()).format('YYYY-MM-DD') : null);
  const [endDate, setEndDate] = useState(null);
  const [filter, setFilter] = useState('all'); // State for selected filter
  const [filteredData, setFilteredData] = useState({}); // State for filtered data
  const t = useTranslations('default.dashboard');

  const fetchData = async () => {
    try {
      const url = `/api/analytics`;
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
      console.log(response.data);
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
  }, [startDate, endDate, filter]);

  return (
    <Box>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => console.log(t('addNewCar'))}>
            {t('addNewCar')}
          </Button>
          <Button variant="contained" color="secondary" onClick={() => console.log(t('createRowDataView'))}>
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
            data={filteredData?.totalCars}
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
            data={filteredData?.totalSoldCars}
            chartData={{ labels: [t('totalCars'), t('totalSoldCars')], series: [filteredData?.totalCars, filteredData?.totalSoldCars] }}
            chartType="pie"
            icon={<IconCar width={24} />}
            iconLink={"/en/CarsInventory/SoldCars"}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <AnalyticsDashboard
            title={t('totalTransactions')}
            data={filteredData?.totalTransactions}
            chartData={filteredData?.transactionAmountsChartData}
            chartType="line"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalReceived')}
            data={filteredData?.totalReceived}
            chartData={{ labels: [t('totalReceived'), t('totalExpenses')], series: [filteredData?.totalReceived, filteredData?.totalExpenses] }}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalExpenses')}
            data={filteredData?.totalExpenses}
            chartData={{ labels: [t('totalReceived'), t('totalExpenses')], series: [filteredData?.totalReceived, filteredData?.totalExpenses] }}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalCustomers')}
            data={filteredData?.totalCustomers}
            chartData={filteredData?.customerCountsChartData}
            chartType="line"
            icon={<IconMan width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <AnalyticsDashboard
            title={t('totalMaintenanceCosts')}
            data={filteredData?.totalMaintenanceCosts}
            chartData={filteredData?.maintenanceAmountsChartData}
            chartType="line"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalCustomerDebt')}
            data={filteredData?.totalCustomerDebt}
            chartData={filteredData?.customerDebtAmountsChartData}
            chartType="column"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalCarsPrices')}
            data={filteredData?.totalSellingPrices}
            chartData={{ labels: [t('carValues'), t('soldCarsPrices')], series: [filteredData?.carValuesAmount, filteredData?.totalSellingPrices] }}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalSellingPrices')}
            data={filteredData?.carDetails?.sellingPrice}
            chartData={filteredData?.sellingPriceBreakdownChartData}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalProfit')}
            data={filteredData?.earnings}
            chartData={filteredData?.profitAmountsChartData}
            chartType="column"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalPartners')}
            data={filteredData?.totalPartners}
            chartData={filteredData?.partnerCountsChartData}
            chartType="line"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsDashboard
            title={t('totalPartnersPercentages')}
            data={`${filteredData?.totalPartnerPercentage}%`}
            chartData={filteredData?.partnerPercentageBreakdownChartData}
            chartType="pie"
            icon={<IconCurrencyDollar width={24} />}
            loading={isLoading}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={12}>
          <YearlyBreakup />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {!today && (
          <>
            <Grid item xs={12}>
              <SalesOverview monthlyTransactions={filteredData?.monthlyTransactions || []} title={t('salesOverview')} />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <RecentTransactions transactions={filteredData?.recentTransactions} title={t('recentTransactions')} />
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <TopEmployees title={t('topEmployees')} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Analytics;
