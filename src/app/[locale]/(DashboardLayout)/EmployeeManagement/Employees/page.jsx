"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateEmployeeModal from "@/app/(DashboardLayout)/components/shared/CreateEmployee"; // CreateEmployeeModal component to be implemented
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

const EmployeesPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    position: "",
    // Add more filter fields as needed
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Number of items per page
  const [error, setError] = useState(""); // Define error state
  const initialEmployeeData = {
    name: "",
    position: "",
    hireDate: new Date().toISOString().split("T")[0], // Current date in 'YYYY-MM-DD' format
    salary: 0,
    benefits: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    admin: "", // If applicable, provide an admin ID here
  };

  // Define fetchEmployees function
  const fetchEmployees = async () => {
    try {
      console.log("fetching employees");
      const response = await axios.get("/api/employee", {
        params: {
          ...filters,
          page: currentPage,
          perPage: perPage,
        },
      });
      setEmployees(response.data.employees);
      setError(""); // Clear error on successful fetch
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again later.");
      setEmployees([]); // Set employees array to empty in case of error
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage]);

  const handleRowClick = (id) => {
    router.push(`/en/EmployeeManagement/Employees/${id}`);
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
    <PageContainer title="Employees" description="Employees Management">
      <DashboardCard title="Employees">
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
              aria-label="add new employee"
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
              name="position"
              label="Position"
              variant="outlined"
              size="small"
              value={filters.position}
              onChange={handleFilterChange}
            />
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table aria-label="employees table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Hire Date</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees?.map((employee) => (
                <TableRow
                  key={employee._id}
                  onClick={() => handleRowClick(employee._id)}
                  style={{ cursor: "pointer" }}
                  hover={true}
                >
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  {/* Display more employee details as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(employees?.length / perPage)}
          page={currentPage}
          onChange={(event, page) => handlePaginationChange(page)}
          style={{ marginTop: 10 }}
        />
      </DashboardCard>
      <CreateEmployeeModal // Render CreateEmployeeModal component
        open={modalOpen}
        handleClose={() => {confirm("Are you sure you want to close?");setModalOpen(false)}}
        fetchEmployees={fetchEmployees}
        initialEmployeeData={initialEmployeeData}
      />
    </PageContainer>
  );
};

export default EmployeesPage;
