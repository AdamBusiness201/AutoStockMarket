import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme, Typography, Stack, Card, CardContent, Box, CircularProgress } from "@mui/material";

const AnalyticsDashboard = ({ title, data, chartData, chartType, icon, iconLink, loading }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;
  // Debug: Log chartData and chartType
  console.log("Chart Data:", chartData);
  console.log("Chart Type:", chartType);

  const chartOptions = {
    chart: {
      type: chartType,
      background: 'transparent',
    },
    labels: chartData?.labels || [],
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'black',
        },
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
    },
    stroke: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    ...chartType !== 'pie' && {
      xaxis: {
        categories: chartData?.categories,
      },
      yaxis: {
        title: {
          text: "Value",
        },
      },
    },
  };

  const chartSeries = chartData?.series || [];

  return (
    <Card>
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box component="a" href={iconLink}>
                {icon}
              </Box>
              <Box>
                <Typography variant="h6" color="textSecondary">
                  {title}
                </Typography>
                <Typography variant="h4">{data}</Typography>
              </Box>
            </Stack>
            {chartType && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type={chartType}
                height={300}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
