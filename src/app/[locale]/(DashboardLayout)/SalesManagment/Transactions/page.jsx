"use client";
import { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateTransactionModal from "../../components/shared/CreateTransactionModal";
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
  Pagination,
  IconButton,

} from "@mui/material";
import { Add } from "@mui/icons-material";
import Loading from "../../loading"; // Import the loading component

const TransactionsPage = () => {
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [modalOpen, setModalOpen] = useState(false); // Add loading state
  const fetchTransactions = async () => {
    setLoading(true); // Set loading state to true when fetching starts
    try {
      const queryParams = new URLSearchParams(filters);
      queryParams.set("page", currentPage);
      queryParams.set("perPage", perPage);
      const response = await fetch(
        `/api/transactions?${queryParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        setError("");
      } else {
        console.error("Failed to fetch transaction data");
        setError("Failed to fetch transaction data. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setError("Failed to fetch transaction data. Please try again later.");
    } finally {
      setLoading(false); // Set loading state to false when fetching ends
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

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageContainer title="Transactions" description="Transactions History">
      <DashboardCard title="Transactions">
        <CreateTransactionModal open={modalOpen} fetchTransactions={fetchTransactions} handleClose={() => { confirm("Are you sure you want to close?"); setModalOpen(false) }} />
        <>
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Box mr={1}>
              <IconButton
                onClick={() => setModalOpen(true)}
                aria-label="add new car"
                color="primary"
              >
                <Add />
              </IconButton>
            </Box>
            <TextField
              name="type"
              label="Type"
              variant="outlined"
              size="small"
              value={filters.type}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
            />
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              variant="outlined"
              size="small"
              value={filters.startDate}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              variant="outlined"
              size="small"
              value={filters.endDate}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="minAmount"
              label="Min Amount"
              type="number"
              variant="outlined"
              size="small"
              value={filters.minAmount}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="maxAmount"
              label="Max Amount"
              type="number"
              variant="outlined"
              size="small"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="carId"
              label="Car ID"
              variant="outlined"
              size="small"
              value={filters.carId}
              onChange={handleFilterChange}
            />
          </Box>
          {!loading ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Car Name | Chassis Number</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>
                        {transaction.car ? `${transaction.car?.name} | ${transaction.car?.chassisNumber}` : "-"}

                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)
            : (<Loading />)}
          <Pagination
            count={Math.ceil(transactions.length / perPage)}
            page={currentPage}
            onChange={(event, page) => handlePaginationChange(page)}
            style={{ marginTop: 10 }}
          />
        </>
      </DashboardCard>
    </PageContainer>
  );
};

export default TransactionsPage;
