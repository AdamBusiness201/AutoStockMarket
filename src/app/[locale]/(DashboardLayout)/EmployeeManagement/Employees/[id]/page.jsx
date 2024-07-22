"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateEmployeeModal from "@/app/(DashboardLayout)/components/shared/CreateEmployee";
import EmployeeAttendance from "@/app/(DashboardLayout)/components/shared/EmployeeAttendance";
import BonusRecords from "@/app/(DashboardLayout)/components/shared/EmployeeBonus";
import SalesRecords from "../../../components/shared/EmployeeSales";
import Loading from "@/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Modal,
  TableContainer,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutline,
  PrintOutlined,
  AddOutlined,
} from "@mui/icons-material";

const EmployeeDetailsPage = ({ params }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Fetch employee details
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`/api/employee/${id}`);
      console.log("refetching employee", response.data.employee);
      setEmployee(response.data.employee);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const handleEditEmployee = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    confirm("Are you sure you want to close?");
    setEditModalOpen(false);
  };

  const handlePrintEmployee = () => {
    // Add printing functionality here
    console.log("Printing employee details...");
  };

  const handleDeleteEmployee = async () => {
    try {
      const response = await axios.delete(`/api/employee/${id}`);
      console.log(response.data);
      router.back(); // Redirect to employee list page after deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <PageContainer
      title={`Employee Details | ${employee?.name}`}
      description="Details of the selected employee"
    >
      <DashboardCard>
        <>
          {loading ? (
            <Loading />
          ) : (
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={3}
              >
                <Typography variant="h5" gutterBottom>
                  Employee Details - {employee.name}
                </Typography>
                <Box>
                  <Tooltip
                    title={`Edit ${employee?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={handleEditEmployee}
                      style={{ marginRight: 10 }}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Delete ${employee?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setDeleteConfirmationOpen(true)}
                      style={{ marginRight: 10 }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Print ${employee?.name} Info`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={handlePrintEmployee}
                      style={{ marginRight: 10 }}
                    >
                      <PrintOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table aria-label="employee details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>ID:</strong>
                      </TableCell>
                      <TableCell>{employee._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Name:</strong>
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Position:</strong>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Hire Date:</strong>
                      </TableCell>
                      <TableCell>{employee.hireDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status:</strong>
                      </TableCell>
                      <TableCell>{employee.status} - {employee.statusReason}</TableCell>
                    </TableRow>
                    {/* Add more rows for additional employee details */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <EmployeeAttendance employeeId={id} />
          <BonusRecords employeeId={id} deductions={false} />
          <BonusRecords employeeId={id} deductions={true} />
          <SalesRecords employeeId={id} />
        </>
      </DashboardCard>

      {/* Edit Employee Modal */}
      <CreateEmployeeModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        fetchEmployees={fetchEmployeeDetails}
        initialEmployeeData={employee}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        aria-labelledby="delete-employee-confirmation-title"
        aria-describedby="delete-employee-confirmation-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
          }}
        >
          <Typography
            id="delete-employee-confirmation-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Confirm Deletion
          </Typography>
          <Typography
            id="delete-employee-confirmation-description"
            variant="body1"
            component="div"
            gutterBottom
          >
            Are you sure you want to delete {employee?.name}?
          </Typography>
          <Box textAlign="right">
            <Button
              onClick={() => setDeleteConfirmationOpen(false)}
              color="primary"
              variant="outlined"
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEmployee}
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </PageContainer>
  );
};

export default EmployeeDetailsPage;
