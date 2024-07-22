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
} from "@mui/material";

const ExpensesExhibitionPage = () => {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    // Fetch expenses data here
    const fetchExpensesData = async () => {
      try {
        // Replace this with the actual API endpoint to fetch expenses data
        const response = await fetch("API_ENDPOINT_TO_FETCH_EXPENSES_DATA");
        if (response.ok) {
          const data = await response.json();
          setExpensesData(data);
        } else {
          console.error("Failed to fetch expenses data");
        }
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };

    fetchExpensesData();
  }, []);

  return (
    <PageContainer title="Expenses Exhibition" description="Details of exhibition expenses">
      <DashboardCard title="Exhibition Expenses">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="expenses table">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesData.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.day}</TableCell>
                  <TableCell>{expense.month}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.type}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default ExpensesExhibitionPage;
