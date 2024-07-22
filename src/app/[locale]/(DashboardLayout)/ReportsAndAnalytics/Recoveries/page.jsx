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

const RecoveriesPage = () => {
  const [recoveriesData, setRecoveriesData] = useState([]);

  useEffect(() => {
    const fetchRecoveriesData = async () => {
      try {
        // Adjust this to your API endpoint for fetching recoveries data
        const response = await fetch("API_ENDPOINT_TO_FETCH_RECOVERIES_DATA");
        
        if (response.ok) {
          const data = await response.json();
          setRecoveriesData(data);
        } else {
          console.error("Failed to fetch recoveries data");
        }
      } catch (error) {
        console.error("Error fetching recoveries data:", error);
      }
    };

    fetchRecoveriesData();
  }, []);

  return (
    <PageContainer title="Recoveries" description="Details recoveries for different accounts and their amounts">
      <DashboardCard title="Recoveries Overview">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="recoveries table">
            <TableHead>
              <TableRow>
                <TableCell>Account Name (اسم الحساب)</TableCell>
                <TableCell>Recovery Amount (مبلغ التعويض)</TableCell>
                <TableCell>Description (البيان)</TableCell>
                <TableCell>Date (التاريخ)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recoveriesData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.accountName}</TableCell>
                  <TableCell>{record.recoveryAmount}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default RecoveriesPage;
