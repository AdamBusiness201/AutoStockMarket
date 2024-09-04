import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  TablePagination,
  Grid
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AnalysisCard from './DashboardAnalysisCard';
import { formatNumber } from '../../../../../utils/numberUtils';
import { useTranslations } from 'next-intl'; // Import useTranslations hook

const CarTransactionsList = ({ transactions }) => {
  const t = useTranslations('default'); // Initialize translation function
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      let total = 0;
      transactions.forEach(transaction => {
        total += transaction.amount;
      });

      setTotalTransactions(transactions.length);
      setTotalAmount(total);
    };

    calculateTotals();
  }, [transactions]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleToggle}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="h6" gutterBottom>
          {t('carTransactionsList.title')}
        </Typography>
        <IconButton>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carTransactionsList.totalTransactions')}
              number={formatNumber(totalTransactions)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carTransactionsList.totalAmount')}
              number={`$${totalAmount.toFixed(2)}`}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('carTransactionsList.type')}</TableCell>
                <TableCell>{t('carTransactionsList.date')}</TableCell>
                <TableCell>{t('carTransactionsList.amount')}</TableCell>
                <TableCell>{t('carTransactionsList.description')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default CarTransactionsList;
