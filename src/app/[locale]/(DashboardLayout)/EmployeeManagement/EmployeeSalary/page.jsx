// src/app/(DashboardLayout)/components/pages/SalariesPage.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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

const SalariesPage = () => {
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        // Adjust this to your API endpoint for fetching salary data
        const response = await axios.get("/api/employee/salary");

        if (response.status === 200) {
          setSalaryData(response.data);
        } else {
          console.error("Failed to fetch salary data");
        }
      } catch (error) {
        console.error("Error fetching salary data:", error);
      }
    };

    fetchSalaryData();
  }, []);

  return (
    <PageContainer title="Employee Salaries" description="Overview of employee salaries, deductions, and net pay">
      <DashboardCard title="Salaries Overview">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="salaries table">
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Total Deductions</TableCell>
                <TableCell>Additions</TableCell>
                <TableCell>Net Salary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaryData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.basicSalary}</TableCell>
                  <TableCell>{record.totalDeductions}</TableCell>
                  <TableCell>{record.additions}</TableCell>
                  <TableCell>{record.netSalary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default SalariesPage;
