"use client";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl'; // Import useTranslations hook

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateTransactionModal from "../../components/shared/CreateTransactionModal";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Pagination, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import Loading from "../../loading"; // Import the loading component

const TransactionsPage = () => {
  const t = useTranslations('default'); // Initialize the translation hook

  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    carId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      queryParams.set("page", currentPage);
      queryParams.set("perPage", perPage);
      const response = await fetch(`/api/transactions?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages); // Set total pages from response
        setError("");
      } else {
        setError(t('transactions.fetchError'));
      }
    } catch (error) {
      setError(t('transactions.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage, perPage]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaginationChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageContainer title={t('transactions.title')} description={t('transactions.description')}>
      <DashboardCard title={t('transactions.title')}>
        <CreateTransactionModal
          open={modalOpen}
          fetchTransactions={fetchTransactions}
          handleClose={() => setModalOpen(false)} // Remove confirm dialog
        />
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box mr={1}>
            <IconButton
              onClick={() => setModalOpen(true)}
              aria-label={t('transactions.addNewCar')}
              color="primary"
            >
              <Add />
            </IconButton>
          </Box>
          <TextField
            name="type"
            label={t('transactions.type')}
            variant="outlined"
            size="small"
            value={filters.type}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="startDate"
            label={t('transactions.startDate')}
            type="date"
            variant="outlined"
            size="small"
            value={filters.startDate}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="endDate"
            label={t('transactions.endDate')}
            type="date"
            variant="outlined"
            size="small"
            value={filters.endDate}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="minAmount"
            label={t('transactions.minAmount')}
            type="number"
            variant="outlined"
            size="small"
            value={filters.minAmount}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="maxAmount"
            label={t('transactions.maxAmount')}
            type="number"
            variant="outlined"
            size="small"
            value={filters.maxAmount}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="carId"
            label={t('transactions.carId')}
            variant="outlined"
            size="small"
            value={filters.carId}
            onChange={handleFilterChange}
            style={{ marginInlineStart: 10 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        {loading ? (
          <Loading message={t('transactions.loading')} />
        ) : (
          <>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label={t('transactions.tableHeaders.transactionsTable')}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('transactions.tableHeaders.type')}</TableCell>
                    <TableCell>{t('transactions.tableHeaders.date')}</TableCell>
                    <TableCell>{t('transactions.tableHeaders.amount')}</TableCell>
                    <TableCell>{t('transactions.tableHeaders.car')}</TableCell>
                    <TableCell>{t('transactions.tableHeaders.description')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'AED',
                      }).format(transaction.amount)}</TableCell>
                      <TableCell>
                        {transaction.car ? `${transaction.car?.name} | ${transaction.car?.chassisNumber}` : "-"}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={totalPages} // Dynamic total pages
              page={currentPage}
              onChange={handlePaginationChange}
              style={{ marginTop: 10 }}
            />
          </>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default TransactionsPage;
