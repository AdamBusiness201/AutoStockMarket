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
import { useTranslations } from 'next-intl'; // Import useTranslations hook

const InstallmentsList = ({ installments }) => {
  const t = useTranslations('default'); // Initialize translation function
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalInstallments, setTotalInstallments] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      let total = 0;
      installments.forEach(installment => {
        total += installment.amount;
      });

      setTotalInstallments(installments.length);
      setTotalAmount(total);
    };

    calculateTotals();
  }, [installments]);

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

  const paginatedInstallments = installments.slice(
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
          {t('installmentsList.title')}
        </Typography>
        <IconButton>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('installmentsList.totalInstallments')}
              number={totalInstallments}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('installmentsList.totalAmount')}
              number={`$${totalAmount.toFixed(2)}`}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('installmentsList.date')}</TableCell>
                <TableCell>{t('installmentsList.amount')}</TableCell>
                <TableCell>{t('installmentsList.description')}</TableCell>
                <TableCell>{t('installmentsList.paid')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInstallments.map((installment) => (
                <TableRow key={installment._id}>
                  <TableCell>
                    {new Date(installment.installmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${installment.amount.toFixed(2)}</TableCell>
                  <TableCell>{installment.description}</TableCell>
                  <TableCell>
                    {installment.paid ? t('installmentsList.yes') : t('installmentsList.no')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={installments.length}
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

export default InstallmentsList;
