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

const FinancialOverviewPage = () => {
  const t = useTranslations('default.financialOverview');
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

  const renderTable = (data, tableKey) => (
    <DashboardCard title={t(`tables.${tableKey}.title`)}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={`${tableKey} table`}>
          <TableHead>
            <TableRow>
              <TableCell>{t(`tables.${tableKey}.headers.description`)}</TableCell>
              <TableCell>{t(`tables.${tableKey}.headers.amount`)}</TableCell>
              <TableCell>{t(`tables.${tableKey}.headers.analysis`)}</TableCell>
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
    <PageContainer title={t('title')} description={t('description')}>
      {renderTable(expensesData, "expenses")}
      {renderTable(salariesData, "salaries")}
    </PageContainer>
  );
};

export default FinancialOverviewPage;
