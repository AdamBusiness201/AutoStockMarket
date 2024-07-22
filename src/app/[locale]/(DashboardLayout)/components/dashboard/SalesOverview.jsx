import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Chart from "react-apexcharts";
import moment from "moment";

const SalesOverview = ({ monthlyTransactions, title }) => {
  const [month, setMonth] = useState("");
  const [chartData, setChartData] = useState({
    earnings: monthlyTransactions?.length > 0 ? [monthlyTransactions[0].earnings] : [],
    expenses: monthlyTransactions?.length > 0 ? [monthlyTransactions[0].expenses] : [],
  });
  const [monthlyData, setMonthlyData] = useState([]);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  
  useEffect(() => {
    const formattedMonthlyData = (monthlyTransactions ?? []).map((item) => ({
      ...item,
      monthName: moment().month(item._id.month - 1).format("MMMM YYYY"),
    }));
    setMonthlyData(formattedMonthlyData);

    // Set the default month to the latest available month
    if (formattedMonthlyData.length > 0 && !month) {
      setMonth(formattedMonthlyData[formattedMonthlyData.length - 1]._id.month.toString());
    }
  }, [month, monthlyTransactions]);

  useEffect(() => {
    const earnings = monthlyTransactions?.map((transaction) => transaction.earnings) ?? [];
    const expenses = monthlyTransactions?.map((transaction) => transaction.expenses) ?? [];
    setChartData({ earnings, expenses });
  }, [monthlyTransactions]);

  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        show: true,
      },
      title: {
        text: "Amount ($)",
      },
    },
    xaxis: {
      categories: monthlyData.map((data) => data.monthName),
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
      },
      title: {
        text: "Months",
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: "Earnings this month",
      data: chartData.earnings,
    },
    {
      name: "Expenses this month",
      data: chartData.expenses,
    },
  ];

  return (
    <DashboardCard
      title={title}
      action={
        <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
          {monthlyData.map((data, index) => (
            <MenuItem key={index} value={data._id.month.toString()}>
              {data.monthName}
            </MenuItem>
          ))}
        </Select>
      }
    >
      <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="370px" />
    </DashboardCard>
  );
};

export default SalesOverview;
