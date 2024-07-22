'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  TextField,
  Box,
  Button,
} from "@mui/material";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    transactionId: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/invoices?${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices);
        } else {
          console.error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [filters]);

  const handleRowClick = (invoiceId) => {
    router.push(`/en/SalesManagment/Invoices/${invoiceId}`);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      transactionId: '',
    });
  };

  return (
    <PageContainer title="Invoices" description="List of all invoices">
      <DashboardCard title="Invoice List">
        <Box mb={2} display="flex" alignItems="center">
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2 }}
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2 }}
          />
          <TextField
            name="minAmount"
            label="Min Amount"
            type="number"
            value={filters.minAmount}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2 }}
          />
          <TextField
            name="maxAmount"
            label="Max Amount"
            type="number"
            value={filters.maxAmount}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2 }}
          />
          <TextField
            name="transactionId"
            label="Transaction ID"
            value={filters.transactionId}
            onChange={handleFilterChange}
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow 
                  key={invoice._id} 
                  hover={true} 
                  onClick={() => handleRowClick(invoice._id)} 
                  style={{ cursor: 'pointer' }} 
                >
                  <TableCell>{invoice._id}</TableCell>
                  <TableCell>{invoice?.transaction?._id}</TableCell>
                  <TableCell>{invoice?.customer?.name}</TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleString()}</TableCell>
                  <TableCell>{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default InvoicesPage;
