"use client";
import { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import Loading from "../../loading"; // Import the loading component
import AnalysisCard from "../../components/shared/DashboardAnalysisCard";

const IncomePage = () => {
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [filteredIncomeDetails, setFilteredIncomeDetails] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchIncomeDetails = async () => {
      setLoading(true); // Set loading state to true when fetching starts
      try {
        const response = await fetch("/api/income");
        if (response.ok) {
          const data = await response.json();
          setIncomeDetails(data.incomeDetails);
          setFilteredIncomeDetails(data.incomeDetails);
          setError("");
        } else {
          console.error("Failed to fetch income data");
          setError("Failed to fetch income data. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching income data:", error);
        setError("Failed to fetch income data. Please try again later.");
      } finally {
        setLoading(false); // Set loading state to false when fetching ends
      }
    };

    fetchIncomeDetails();
  }, []);

  useEffect(() => {
    if (incomeDetails) {
      const filteredDetails = incomeDetails.soldCarsDetails.filter((carDetail) => {
        const saleDate = new Date(carDetail.saleDate);
        const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
        const to = toDate ? new Date(toDate) : new Date();
        return saleDate >= from && saleDate <= to;
      });
      setFilteredIncomeDetails({
        ...incomeDetails,
        soldCarsDetails: filteredDetails,
      });
    }
  }, [fromDate, toDate, incomeDetails]);

  return (
    <PageContainer title="Income" description="Total Income and Car Details">
      <DashboardCard title="Income">
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>


        {loading ? (
          <Loading />
        ) : error ? (
          <div>{error}</div>
        ) : filteredIncomeDetails ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title="Total Income"
                  number={filteredIncomeDetails.totalIncome}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title="Number of Cars"
                  number={filteredIncomeDetails.totalCars}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="income details table">
                <TableHead>
                  <TableRow>
                    <TableCell>Car ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Net Profit</TableCell>
                    <TableCell>Sale Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIncomeDetails.soldCarsDetails.map((carDetail) => (
                    <TableRow key={carDetail._id}>
                      <TableCell>{carDetail.car._id}</TableCell>
                      <TableCell>{carDetail.car.name}</TableCell>
                      <TableCell>{carDetail.car.color}</TableCell>
                      <TableCell>{carDetail.car.model}</TableCell>
                      <TableCell>{carDetail.netProfit}</TableCell>
                      <TableCell>{new Date(carDetail.saleDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : null}
      </DashboardCard>
    </PageContainer>
  );
};

export default IncomePage;
