
'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateCustomerModal from "@/app/(DashboardLayout)/components/shared/CreateCustomerModal";
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

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    contactDetails: "",
    // Add more filter fields as needed
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(50); // Number of items per page
  const [error, setError] = useState(""); // Define error state

  // Define fetchCustomers function
  const fetchCustomers = async () => {
    try {
      console.log("fetching customers");
      const response = await axios.get("/api/customers", {
        params: {
          ...filters,
          page: currentPage,
          perPage: perPage,
        },
      });
      setCustomers(response.data.customers);
      setError(""); // Clear error on successful fetch
    } catch (error) {
      console.error("Error fetching customers:", error.response.data);
      setError("Failed to fetch customers. Please try again later.");
      setCustomers([]); // Set customers array to empty in case of error
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters, currentPage]);

  const handleRowClick = (id) => {
    router.push(`/en/CustomerManagement/Customers/${id}`);
  };

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
    <PageContainer title="Customers" description="Customers Management">
      <DashboardCard title="Customers">
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          {/* Plus icon on the left */}
          <Box mr={1}>
            <IconButton
              onClick={() => setModalOpen(true)}
              aria-label="add new customer"
              color="primary"
            >
              <Add />
            </IconButton>
          </Box>

          {/* Input fields on the right */}
          <Box flexGrow={1}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              size="small"
              value={filters.name}
              onChange={handleFilterChange}
              style={{ marginRight: 10 }}
            />
            <TextField
              name="contactDetails"
              label="Contact Details"
              variant="outlined"
              size="small"
              value={filters.contactDetails}
              onChange={handleFilterChange}
            />
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table aria-label="customers table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>National ID</TableCell>
                <TableCell>Debts</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow
                  key={customer._id}
                  onClick={() => handleRowClick(customer._id)}
                  style={{ cursor: "pointer" }}
                  hover={true}
                >
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.contactDetails?.phone}</TableCell>
                  <TableCell>{customer.contactDetails?.email}</TableCell>
                  <TableCell>{customer.contactDetails?.nationality}</TableCell>
                  <TableCell>{customer.contactDetails?.nationalID}</TableCell>
                  <TableCell>{customer.debts}</TableCell>
                  {/* Display more customer details as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(customers?.length / perPage)}
          page={currentPage}
          onChange={(event, page) => handlePaginationChange(page)}
          style={{ marginTop: 10 }}
        />
      </DashboardCard>
      <CreateCustomerModal // Render CreateCustomerModal component
        open={modalOpen}
        handleClose={() => {
          confirm("Are you sure you want to close?");
          setModalOpen(false)
        }}
        fetchCustomers={fetchCustomers}
      />
    </PageContainer>
  );
};

export default CustomersPage;

