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
import { useTranslations } from 'next-intl';

const ExpensesExhibitionPage = () => {
  const t = useTranslations('default.expenses');
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
    <PageContainer title={t('title')} description={t('description')}>
      <DashboardCard title={t('title')}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="exhibition expenses table">
            <TableHead>
              <TableRow>
                <TableCell>{t('table.day')}</TableCell>
                <TableCell>{t('table.month')}</TableCell>
                <TableCell>{t('table.date')}</TableCell>
                <TableCell>{t('table.type')}</TableCell>
                <TableCell>{t('table.description')}</TableCell>
                <TableCell>{t('table.value')}</TableCell>
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
