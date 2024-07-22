"use client";
import { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Analytics from "@/app/(DashboardLayout)/components/shared/Analytics"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const DailyReportsPage = () => {
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [cashFlowSummary, setCashFlowSummary] = useState([]);

  useEffect(() => {
    // Fetch daily transactions data
    const fetchDailyTransactions = async () => {
      try {
        // Replace this with actual API endpoint
        const response = await fetch("API_ENDPOINT_TO_FETCH_DAILY_TRANSACTIONS");
        if (response.ok) {
          const data = await response.json();
          setDailyTransactions(data);
        } else {
          console.error("Failed to fetch daily transactions data");
        }
      } catch (error) {
        console.error("Error fetching daily transactions data:", error);
      }
    };

    // Fetch cash flow summary data
    const fetchCashFlowSummary = async () => {
      try {
        // Replace this with actual API endpoint
        const response = await fetch("API_ENDPOINT_TO_FETCH_CASH_FLOW_SUMMARY");
        if (response.ok) {
          const data = await response.json();
          setCashFlowSummary(data);
        } else {
          console.error("Failed to fetch cash flow summary data");
        }
      } catch (error) {
        console.error("Error fetching cash flow summary data:", error);
      }
    };

    fetchDailyTransactions();
    fetchCashFlowSummary();
  }, []);

  return (
    <PageContainer title="Daily Reports" description="Summary of daily transactions and cash flows">
      <DashboardCard title="Daily Reports">
        <Analytics today={true} />
        <DashboardCard title="Daily Transactions">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="daily transactions table">
              <TableHead>
                <TableRow>
                  <TableCell>Entry</TableCell>
                  <TableCell>Exit</TableCell>
                  <TableCell>Regarding</TableCell>
                  <TableCell>Filter</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailyTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.entry}</TableCell>
                    <TableCell>{transaction.exit}</TableCell>
                    <TableCell>{transaction.regarding}</TableCell>
                    <TableCell>{transaction.filter}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
        <DashboardCard title="Cash Flow Summary">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="cash flow summary table">
              <TableHead>
                <TableRow>
                  <TableCell>Details</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cashFlowSummary.map((summary) => (
                  <TableRow key={summary.id}>
                    <TableCell>{summary.details}</TableCell>
                    <TableCell>{summary.amount}</TableCell>
                    <TableCell>{summary.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
      </DashboardCard>
    </PageContainer>
  );
};

export default DailyReportsPage;
