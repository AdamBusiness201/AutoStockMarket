"use client";
import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { useTranslations } from 'next-intl';

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
  Grid,
  TextField,
} from "@mui/material";
import Loading from "../../loading"; // Import the loading component
import AnalysisCard from "../../components/shared/DashboardAnalysisCard";

const IncomePage = () => {
  const t = useTranslations('default');
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [filteredIncomeDetails, setFilteredIncomeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchIncomeDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/income", {
          params: {
            fromDate,
            toDate
          }
        });
        if (response.data) {
          setIncomeDetails(response.data.incomeDetails);
          setFilteredIncomeDetails(response.data.incomeDetails);
          setError("");
        } else {
          console.error(t("income.fetchError"));
          setError(t("income.fetchError"));
        }
      } catch (error) {
        console.error(t("income.fetchError"), error);
        setError(t("income.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeDetails();
  }, [fromDate, toDate, t]);

  return (
    <PageContainer title={t("income.title")} description={t("income.description")}>
      <DashboardCard title={t("income.title")}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("income.from")}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("income.to")}
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
                  title={t("income.totalIncome")}
                  number={filteredIncomeDetails.totalIncome}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title={t("income.totalTransactions")}
                  number={filteredIncomeDetails.totalTransactions}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label={t("income.tableHeaders.incomeDetailsTable")}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("income.tableHeaders.carId")}</TableCell>
                    <TableCell>{t("income.tableHeaders.carColor")}</TableCell>
                    <TableCell>{t("income.tableHeaders.carModel")}</TableCell>
                    <TableCell>{t("income.tableHeaders.amount")}</TableCell>
                    <TableCell>{t("income.tableHeaders.date")}</TableCell>
                    <TableCell>{t("income.description")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIncomeDetails.soldCarsDetails.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction?.car?.chassisNumber}</TableCell>
                      <TableCell>{transaction?.car?.color}</TableCell>
                      <TableCell>{transaction?.car?.model}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'AED', // Replace with your currency code
                        }).format(transaction.amount)}
                      </TableCell>

                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
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
