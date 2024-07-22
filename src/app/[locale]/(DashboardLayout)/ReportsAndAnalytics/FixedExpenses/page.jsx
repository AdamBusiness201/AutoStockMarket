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

const FinancialOverviewPage = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [salariesData, setSalariesData] = useState([]);

  useEffect(() => {
    // Fetch expenses data
    const fetchExpensesData = async () => {
      try {
        const response = await fetch("/api/expenses");
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

    // Fetch salaries data
    const fetchSalariesData = async () => {
      try {
        const response = await fetch("/api/salaries");
        if (response.ok) {
          const data = await response.json();
          setSalariesData(data);
        } else {
          console.error("Failed to fetch salaries data");
        }
      } catch (error) {
        console.error("Error fetching salaries data:", error);
      }
    };

    fetchExpensesData();
    fetchSalariesData();
  }, []);

  const renderTable = (data, title) => (
    <DashboardCard title={title}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={`${title} table`}>
          <TableHead>
            <TableRow>
              <TableCell>البيان (Description)</TableCell>
              <TableCell>القيمة (Amount)</TableCell>
              <TableCell>تحليل (Analysis)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.description}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.analysis}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );

  return (
    <PageContainer title="Financial Overview" description="Overview of expenses and salaries">
      {renderTable(expensesData, "Expenses Fixed (المصروفات الثابته)")}
      {renderTable(salariesData, "Salaries (رواتب)")}
    </PageContainer>
  );
};

export default FinancialOverviewPage;
