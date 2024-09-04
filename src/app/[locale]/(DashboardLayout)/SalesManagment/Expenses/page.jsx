"use client";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl'; // Import useTranslations hook
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
  const t = useTranslations('default'); // Initialize the translation hook
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
          console.error(t("expensesExhibition.fetchError"));
        }
      } catch (error) {
        console.error(t("expensesExhibition.fetchError"), error);
      }
    };

    fetchExpensesData();
  }, []);

  return (
    <PageContainer title={t("expensesExhibition.title")} description={t("expensesExhibition.description")}>
      <DashboardCard title={t("expensesExhibition.cardTitle")}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label={t("expensesExhibition.tableAriaLabel")}>
            <TableHead>
              <TableRow>
                <TableCell>{t("expensesExhibition.tableHeaders.day")}</TableCell>
                <TableCell>{t("expensesExhibition.tableHeaders.month")}</TableCell>
                <TableCell>{t("expensesExhibition.tableHeaders.date")}</TableCell>
                <TableCell>{t("expensesExhibition.tableHeaders.type")}</TableCell>
                <TableCell>{t("expensesExhibition.tableHeaders.description")}</TableCell>
                <TableCell>{t("expensesExhibition.tableHeaders.value")}</TableCell>
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
