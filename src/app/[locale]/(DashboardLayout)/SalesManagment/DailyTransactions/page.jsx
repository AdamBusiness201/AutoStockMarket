"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
          console.error("Failed to fetch transaction data");
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
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
    : "Loading date and time...";

  return (
    <PageContainer title="Transactions" description="Transactions History">
      <DashboardCard title={`Transactions of ${todayDate}`}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Car ID</TableCell>
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
