"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  Pagination,
} from "@mui/material";

const TransactionsPage = () => {
  const t = useTranslations('default'); // Initialize the translation hook
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions`);
        if (response.ok) {
          const data = await response.json();
          const today = new Date().toISOString().split("T")[0];
          const todayTransactions = data.transactions.filter(
            (transaction) => transaction.date.split("T")[0] === today
          );
          setTransactions(todayTransactions);
        } else {
          console.error(t('transactions.fetchError'));
        }
      } catch (error) {
        console.error(t('transactions.fetchError'), error);
      }
    };

    fetchTransactions();
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const todayDate = isClient
    ? currentDateTime.toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
    : t('transactions.loadingDateTime');

  return (
    <PageContainer title={t('transactions.title')} description={t('transactions.description')}>
      <DashboardCard title={`${t('transactions.title')} ${t('transactions.of')} ${todayDate}`}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label={t('transactions.tableHeaders.transactionsTable')}>
            <TableHead>
              <TableRow>
                <TableCell>{t('transactions.tableHeaders.id')}</TableCell>
                <TableCell>{t('transactions.tableHeaders.type')}</TableCell>
                <TableCell>{t('transactions.tableHeaders.date')}</TableCell>
                <TableCell>{t('transactions.tableHeaders.amount')}</TableCell>
                <TableCell>{t('transactions.tableHeaders.description')}</TableCell>
                <TableCell>{t('transactions.carId')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction._id}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.car ? (
                      <Link
                        href={`/en/CarsInventory/Cars/${transaction.car._id}`}
                        target="_blank"
                        passHref
                        legacyBehavior
                      >
                        <a>{transaction.car._id}</a>
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(transactions.length / perPage)}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          style={{ marginTop: 10 }}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default TransactionsPage;
