"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
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
import CreateCustomerModal from "../../../components/shared/CreateCustomerModal";

const CustomerDetailsPage = ({ params }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Fetch customer details
  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`/api/customers/${id}`);
      setCustomer(response.data.customer);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const handleEditCustomer = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    confirm("Are you sure you want to close?");
    setEditModalOpen(false);
  };

  const handlePrintCustomer = () => {
    // Add printing functionality here
    console.log("Printing customer details...");
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await axios.delete(`/api/customers/${id}`);
      console.log(response.data);
      router.back(); // Redirect to customer list page after deletion
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <PageContainer
      title={`Customer Details | ${customer?.name}`}
      description="Details of the selected customer"
    >
      <DashboardCard>
        <>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={3}
              >
                <Typography variant="h5" gutterBottom>
                  Customer Details - {customer.name}
                </Typography>
                <Box>
                  <Tooltip
                    title={`Edit ${customer?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={handleEditCustomer}
                      style={{ marginRight: 10 }}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Delete ${customer?.name}`}
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
                    title={`Print ${customer?.name} Info`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={handlePrintCustomer}
                      style={{ marginRight: 10 }}
                    >
                      <PrintOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table aria-label="customer details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>ID:</strong>
                      </TableCell>
                      <TableCell>{customer._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Name:</strong>
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Phone:</strong>
                      </TableCell>
                      <TableCell>{customer?.contactDetails?.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Email:</strong>
                      </TableCell>
                      <TableCell>{customer?.contactDetails?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Nationality:</strong>
                      </TableCell>
                      <TableCell>{customer?.contactDetails?.nationality}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>National ID:</strong>
                      </TableCell>
                      <TableCell>{customer?.nationalID}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Debts:</strong>
                      </TableCell>
                      <TableCell>{customer.debts}</TableCell>
                    </TableRow>
                    {/* Add more rows for additional customer details */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      </DashboardCard>

      {/* Edit Customer Modal */}
      <CreateCustomerModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        fetchCustomers={fetchCustomerDetails}
        initialCustomerData={customer}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        aria-labelledby="delete-customer-confirmation-title"
        aria-describedby="delete-customer-confirmation-description"
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
            id="delete-customer-confirmation-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Confirm Deletion
          </Typography>
          <Typography
            id="delete-customer-confirmation-description"
            variant="body1"
            component="div"
            gutterBottom
          >
            Are you sure you want to delete {customer?.name}?
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
              onClick={handleDeleteCustomer}
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

export default CustomerDetailsPage;
