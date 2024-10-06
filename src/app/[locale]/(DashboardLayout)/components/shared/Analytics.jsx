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
import { useRouter } from 'next/navigation';
import AnalysisCard from './DashboardAnalysisCard';
import CarAnalytics from "./CarAnalytics";

const Analytics = ({ locale, today = false, timeRange }) => {
  const [analytics, setAnalytics] = useState({});
  const [sourceOfSellingStats, setSourceOfSellingStats] = useState([]);
  const [maintenanceAnalaysis, setMaintenanceAnalaysis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(today ? moment(new Date()).format('YYYY-MM-DD') : null);
  const [endDate, setEndDate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [filteredData, setFilteredData] = useState({});
  const t = useTranslations('default.dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const url = `/api/analytics?timeRange=${timeRange}`;
      const queryParams = {};

      if (startDate) queryParams.startDate = moment(startDate).format('YYYY-MM-DD');
      if (endDate) queryParams.endDate = moment(endDate).format('YYYY-MM-DD');
      if (filter !== 'all') queryParams.category = filter;

      const [mainAnalyticsResponse, soldCarsResponse, maintenanceAnalaysisResponse] = await Promise.all([
        axios.get(url, { params: queryParams }),
        axios.get('/api/analytics/sold-cars'),
        axios.get('/api/analytics/maintenance'),
      ]);
      console.log("soldCarsResponse");
      setAnalytics(mainAnalyticsResponse.data);
      setFilteredData(mainAnalyticsResponse.data);
      setSourceOfSellingStats(soldCarsResponse.data);
      setMaintenanceAnalaysis(maintenanceAnalaysisResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, filter, timeRange]);

  const formatNumber = (number) => {
    if (number === undefined || number === null) return '-';
    return new Intl.NumberFormat(locale).format(number);
  };
  console.log(sourceOfSellingStats);
  return (
    <Box>
      <ViewDataModal open={modalOpen} handleClose={() => { setModalOpen(false) }} locale={locale} />
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button variant="contained" color="primary" onClick={() => router.push(`/${locale}/CarsInventory/Cars?CreateCar=true`)}>
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
              <MenuItem value="showroom">{t('e_showroom')}</MenuItem>
              <MenuItem value="sales">{t('sales')}</MenuItem>
              <MenuItem value="maintenance">{t('maintenance')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Conditionally Render Components Based on Filter */}
      <Box>
        {filter === 'all' || filter === 'showroom' ? (
          <CarAnalytics isDashboard={true} />
        ) : null}

        {filter === 'sales' || filter === 'all' ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <AnalyticsDashboard
                  title={t('totalCarsPrices')}
                  data={filteredData?.totalSellingPrices}
                  chartData={{
                    labels: sourceOfSellingStats?.sourceOfSellingStats?.map(src => src._id || t('sourceOfSelling.unknown')) || [],
                    series: Array.isArray(sourceOfSellingStats) 
                      ? sourceOfSellingStats.map(src => src.totalCars) 
                      : []
                  }}
                  chartType="pie"
                  icon={<IconCurrencyDollar width={24} />}
                  loading={isLoading}
                />
              </Grid>
              {sourceOfSellingStats?.sourceOfSellingStats?.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <AnalysisCard
                    title={stat._id || t('sourceOfSelling.unknown')}
                    number={stat.totalCars}
                    description={`${t('sourceOfSelling.totalPrice')} ${formatNumber(stat.totalPrice)}`}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : null}
        {filter === 'finance' || filter === 'all' ? (
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
        ) : null}
        {filter === 'maintenance' || filter === 'all' ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <AnalyticsDashboard
                title={t('totalMaintenanceCosts')}
                data={maintenanceAnalaysis?.totalTasks}
                chartData={filteredData?.maintenanceAmountsChartData}
                chartType="line"
                icon={<IconCurrencyDollar width={24} />}
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
          </Grid>
        ) : null}
      </Box>

      <Grid container spacing={2} mt={2}>
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
