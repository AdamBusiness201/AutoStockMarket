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
    const fetchExpensesData = async () => {
      try {
        // Adjust this to your API endpoint for fetching exhibition expenses data
        const response = await fetch("API_ENDPOINT_TO_FETCH_EXPENSES_DATA");
        
        if (response.ok) {
          const data = await response.json();
          setExpensesData(data);
        } else {
          console.error("Failed to fetch exhibition expenses data");
        }
      } catch (error) {
        console.error("Error fetching exhibition expenses data:", error);
      }
    };

    fetchExpensesData();
  }, []);

  return (
    <PageContainer title="Exhibition Expenses" description="Overview of expenses incurred during the exhibition">
      <DashboardCard title="Expenses Overview">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="exhibition expenses table">
            <TableHead>
              <TableRow>
                <TableCell>Day (اليوم)</TableCell>
                <TableCell>Month (الشهر)</TableCell>
                <TableCell>Date (التاريخ)</TableCell>
                <TableCell>Type (النوع)</TableCell>
                <TableCell>Description (البيان)</TableCell>
                <TableCell>Value (القيمة)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.day}</TableCell>
                  <TableCell>{record.month}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.value}</TableCell>
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
