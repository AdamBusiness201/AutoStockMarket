"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateCustomerModal from "../../../components/shared/CreateCustomerModal";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Box,
  TableContainer,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Modal,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import CreateTransactionModal from "../../../components/shared/CreateTransactionModal"
import CreateInstallmentModal from "../../../components/shared/CreateInstallmentModal";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  SellOutlined,
  MoneyOutlined,
  PrintOutlined,
  GarageOutlined,
  BuildOutlined,
  EditOutlined,
  DeleteOutline,
  MoneyOffOutlined
} from "@mui/icons-material";
import CreateCarModal from "../../../components/shared/CreateCarModal";
import MaintenanceTasksList from "../../../components/shared/CarMaintenanceTasks";
import InstallmentsList from "../../../components/shared/CarInstallments";
import PartnersList from "../../../components/shared/CarPartners";
import CarTransactionsList from "../../../components/shared/CarTransactions"
import Loading from "../../../loading";

const initialCarDetails = {
  value: "",
  sellingPrice: "",
  capital: "",
  netProfit: "",
};

const CarDetailsPage = ({ params }) => {
  const [car, setCar] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isAddMaintenanceModalOpen, setIsAddMaintenanceModalOpen] =
    useState(false);
  const [carDetails, setCarDetails] = useState(initialCarDetails);
  const [maintenanceCosts, setMaintenanceCosts] = useState("");
  const [partnersList, setPartnersList] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [maintenanceTask, setMaintenanceTask] = useState({
    taskDescription: "",
    taskDate: "",
    taskCost: "",
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const router = useRouter();
  const { id } = params;

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`/api/car/${id}`);
      console.log(response);
      setCar(response.data.car);
      setCarDetails(response.data.carDetails);
      setPartnersList(response.data.partners);
      setMaintenanceCosts(response.data.carDetails.maintenanceCosts);
      setCustomers(response.data.customers);
      setEmployees(response.data.employees);
      setTransactions(response.data.transactions);
      setInstallments(response.data.installments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/car/${id}?customersOnly=true`);
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/car/${id}?TransactionsOnly=true`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };
  const fetchInstallments = async () => {
    try {
      const response = await axios.get(`/api/car/${id}?TransactionsOnly=true`);
      setInstallments(response.data.installments);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };
  // Calculate the sum of all partnership percentages
  const sumPercentages = partnersList.reduce(
    (total, partner) => total + partner.partnershipPercentage,
    0
  );
  useEffect(() => {
    fetchMaintenanceTasks();
    fetchCarDetails();
  }, [id]);

  const handleSellCar = async () => {
    const updatedCarDetails = {
      ...carDetails,
      purchaser: selectedPurchaser,
      source: selectedSource,
      salesMember: selectedSalesMember,
    };

    try {
      const response = await axios.post(
        `/api/car/${id}/sell-car`,
        updatedCarDetails
      );
      console.log("Response data:", response.data);
      setIsSellModalOpen(false);
      setCarDetails(initialCarDetails);
    } catch (error) {
      console.error("Error selling car:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const componentRef = React.useRef();

  const printAsPDF = async () => {
    try {
      const input = document.getElementById("car-details");
      const canvas = await html2canvas(input);
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 0, 0);
      pdf.save("car_details.pdf");
    } catch (error) {
      console.error("Error printing as PDF:", error);
    }
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update state with the current input value
    setCarDetails({
      ...carDetails,
      [name]: value,
    });
  };
  const totalInstallmentsAmount = installments.reduce((acc, installment) => {
    return installment.paid && acc + installment.amount;
  }, 0);
  useEffect(() => {
    if (carDetails.value > 0) {
      const totalTransactionsAmount = transactions.reduce((acc, transaction) => {
        return transaction.type === "expense" && acc + transaction.amount;
      }, 0);
      console.log(totalTransactionsAmount);
      // Parse input values to floats, defaulting to 0 if parsing fails
      const parsedValue = parseFloat(carDetails.value) || 0;
      const parsedSellingPrice = parseFloat(carDetails.sellingPrice) || 0;
      const parsedMaintenanceCosts =
        parseFloat(carDetails.maintenanceCosts) || 0;

      // Calculate net profit using only the current input value
      const netProfit =
        parsedSellingPrice - (totalTransactionsAmount);

      // Log calculation process
      console.log("--- Calculation Process ---");
      console.log("Selling Price:", parsedSellingPrice);
      console.log("Input Value:", parsedValue);
      console.log("Maintenance Costs:", parsedMaintenanceCosts);
      console.log(
        "Net Profit = Selling Price - (Input Value + Maintenance Costs)"
      );
      console.log(
        "Net Profit =",
        parsedSellingPrice,
        "-",
        parsedValue,
        "-",
        parsedMaintenanceCosts,
        "=",
        netProfit
      );

      // Update state with the calculated net profit
      setCarDetails((prevState) => ({
        ...prevState,
        netProfit: isNaN(netProfit) ? "" : netProfit.toFixed(2), // Ensure netProfit is a valid number
      }));
    }
  }, [
    carDetails.value,
    carDetails.sellingPrice,
    carDetails.maintenanceCosts,
    isSellModalOpen,
  ]);

  const handleMaintenanceInputChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddMaintenanceTask = async () => {
    try {
      const response = await axios.post(
        `/api/car/${id}/add-maintenance-task`,
        maintenanceTask
      );
      console.log(response.data);
      setIsAddMaintenanceModalOpen(false);
      fetchCarDetails();
      fetchMaintenanceTasks();
      setMaintenanceTask({
        taskDescription: "",
        taskDate: "",
        taskCost: "",
      });
    } catch (error) {
      console.error("Error adding maintenance task:", error);
    }
  };

  const handleDeleteCar = async () => {
    try {
      const response = await axios.delete(`/api/car/${id}`);
      console.log(response.data);
      router.back(); // Navigates back one step
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const fetchMaintenanceTasks = async () => {
    try {
      const response = await axios.get(`/api/car/${id}/add-maintenance-task`);
      setMaintenanceTasks(response.data.maintenanceTasks);
    } catch (error) {
      console.error("Error fetching maintenance tasks:", error);
    }
  };
  const tasksRef = useRef(null);
  // Define state to store the selected purchaser
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);

  // Define the handlePurchaserChange function
  const handlePurchaserChange = (value) => {
    setSelectedPurchaser(value?._id);
  };
  // Define state to store the selected purchaser
  const [selectedSalesMember, setSelectedSalesMember] = useState(null);

  // Define the handlePurchaserChange function
  const handleSalesMemberChange = (value) => {
    setSelectedSalesMember(value?._id);
  };
  // Define state to store the selected purchaser
  const [selectedSource, setSelectedSource] = useState(null);

  // Define the handlePurchaserChange function
  const handleSourceChange = (value) => {
    setSelectedSource(value?._id);
  };
  const sellingSources = [
    "OLX",
    "eBay",
    "Amazon",
    "Craigslist",
    "Facebook Marketplace",
  ]; // Example array of selling sources
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  return (
    <PageContainer
      title={`Car Details | ${car?.name} | ${car?.model}`}
      description="Details of the selected car"
    >
      <CreateTransactionModal open={transactionModalOpen} car={car} fetchTransactions={fetchTransactions} handleClose={() => setTransactionModalOpen(false)} />
      <CreateInstallmentModal open={installmentModalOpen} car={car} fetchInstallments={fetchInstallments} handleClose={() => setInstallmentModalOpen(false)} />
      <DashboardCard>
        <>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Loading />
            </Box>
          ) : (
            <Box>
              <CreateCustomerModal // Render CreateCustomerModal component
                open={customerModalOpen}
                handleClose={() => {confirm("Are you sure you want to close?");setCustomerModalOpen(false)}}
                fetchCustomers={() => {
                  fetchCustomers();
                  setSelectedPurchaser(customers[0]._id);
                  console.log(selectedPurchaser);
                }}
              />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 5 }}
              >
                <Typography variant="h5" gutterBottom>
                  Car Details - {car?.name}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Tooltip
                    title={`Add Expenses for ${car?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setTransactionModalOpen(true)}
                      style={{ marginRight: 10 }}
                    >
                      <MoneyOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Add Installment for ${car?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setInstallmentModalOpen(true)}
                      style={{ marginRight: 10 }}
                    >
                      <MoneyOffOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Sell ${car?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setIsSellModalOpen(true)}
                      style={{ marginRight: 10 }}
                    >
                      <SellOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Edit ${car?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setModalOpen(true)}
                      style={{ marginRight: 10 }}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Print ${car?.name} Info`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={printAsPDF}
                      style={{ marginRight: 10 }}
                    >
                      <PrintOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Delete ${car?.name}`}
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
                    title={`Add Maintenance Task For ${car?.name}`}
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setIsAddMaintenanceModalOpen(true)}
                    >
                      <BuildOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer component={Paper} id="car-details">
                <Table aria-label="car details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>ID:</strong>
                      </TableCell>
                      <TableCell>{car?._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Name:</strong>
                      </TableCell>
                      <TableCell>{car?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Color:</strong>
                      </TableCell>
                      <TableCell>{car?.color}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Model:</strong>
                      </TableCell>
                      <TableCell>{car?.model}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Chassis Number:</strong>
                      </TableCell>
                      <TableCell>{car?.chassisNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Owner:</strong>
                      </TableCell>
                      <TableCell>{car?.owner?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Purchase Details:</strong>
                      </TableCell>
                      <TableCell>{car?.purchaseDetails}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Maintenance:</strong>
                      </TableCell>
                      <TableCell
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontStyle: "italic",
                        }}
                        onClick={() =>
                          tasksRef.current.scrollIntoView({
                            behavior: "smooth",
                          })
                        }
                      >
                        See Car Maintenance Tasks
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Price:</strong>
                      </TableCell>
                      <TableCell>
                        <strong>
                          {carDetails.value} ({sumPercentages}% Partnership,{" "}
                          {carDetails.value -
                            (sumPercentages / 100) * carDetails.value}{" "}
                          for ASM)
                          (Paid {totalInstallmentsAmount})
                        </strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Current Location:</strong>
                      </TableCell>
                      <TableCell>{car?.currentLocation}</TableCell>
                    </TableRow>

                    {car?.currentLocation === "Sold" && (
                      <>
                        <TableRow>
                          <TableCell>
                            <strong>Selling Price:</strong>
                          </TableCell>
                          <TableCell>{carDetails.sellingPrice}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <strong>Maintenance Costs:</strong>
                          </TableCell>
                          <TableCell>{carDetails.maintenanceCosts}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Net Profit:</strong>
                          </TableCell>
                          <TableCell>{carDetails.netProfit}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Delete Confirmation Modal */}
              <Modal
                open={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                aria-labelledby="delete-car-confirmation-title"
                aria-describedby="delete-car-confirmation-description"
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
                    id="delete-car-confirmation-title"
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    Confirm Deletion
                  </Typography>
                  <Typography
                    id="delete-car-confirmation-description"
                    variant="body1"
                    component="div"
                    gutterBottom
                  >
                    Are you sure you want to delete {car?.name}?
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
                      onClick={handleDeleteCar}
                      color="error"
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Modal>
              <Modal
                open={isSellModalOpen}
                onClose={() => {
                  setIsSellModalOpen(false);
                  setCarDetails(initialCarDetails);
                }}
                aria-labelledby="sell-car-modal-title"
                aria-describedby="sell-car-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5,
                    width: 1200,
                  }}
                >
                  <Typography
                    id="sell-car-modal-title"
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    Sell {car?.name} Confirmation
                  </Typography>
                  <Typography
                    id="sell-car-modal-description"
                    variant="body1"
                    component="div"
                    gutterBottom
                  >
                    Are you sure you want to sell {car?.name}?
                  </Typography>

                  <Grid container spacing={2}>
                    {" "}
                    {/* Set spacing between Grid items */}
                    <Grid item xs={4}>
                      {" "}
                      {/* Each input takes up half of the space */}
                      <Autocomplete
                        options={customers}
                        getOptionLabel={(option) => `${option?.name} - ${option?.contactDetails}`} // Combine name and phone number
                        getOptionSelected={(option, value) => option._id === value._id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Purchaser"
                            name="purchaser"
                            fullWidth
                            margin="normal"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {params.InputProps.endAdornment}
                                  <Button onClick={() => setCustomerModalOpen(true)}>
                                    Add New
                                  </Button>{" "}
                                  {/* Button to open dialog for adding new customer */}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        onChange={(event, value) => handlePurchaserChange(value)}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Selling Price"
                        name="sellingPrice"
                        value={carDetails.sellingPrice}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Value"
                        name="value"
                        value={carDetails.value}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Capital"
                        name="capital"
                        value={carDetails.capital}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Maintenance Costs"
                        name="maintenanceCosts"
                        value={maintenanceCosts}
                        fullWidth
                        margin="normal"
                        disabled // Set disabled to true to make it disabled but still visible
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Net Profit"
                        name="netProfit"
                        value={carDetails.netProfit}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* Each input takes up half of the space */}
                      <Autocomplete
                        options={employees}
                        getOptionLabel={(option) =>
                          `${option.name} - ${option?.contactInfo?.phone}`
                        }
                        getOptionSelected={(option, value) =>
                          option._id === value._id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sales"
                            name="sales"
                            margin="normal"
                          />
                        )}
                        onChange={(event, value) =>
                          handleSalesMemberChange(value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* Autocomplete for source of selling */}
                      <Autocomplete
                        options={sellingSources}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Source of Selling"
                            name="sourceOfSelling"
                            margin="normal"
                            helperText="Select the source of selling (Only if Outsource)"
                          />
                        )}
                        onChange={(event, value) => handleSourceChange(value)}
                      />
                    </Grid>
                  </Grid>

                  <Box textAlign="right">
                    <Button
                      onClick={() => {
                        setIsSellModalOpen(false);
                        setCarDetails(initialCarDetails);
                      }}
                      color="primary"
                      variant="outlined"
                      style={{ marginRight: "10px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSellCar}
                      color="success"
                      variant="outlined"
                    >
                      Sell
                    </Button>
                  </Box>
                </Box>
              </Modal>

              <Modal
                open={isAddMaintenanceModalOpen}
                onClose={() => setIsAddMaintenanceModalOpen(false)}
                aria-labelledby="add-maintenance-task-modal-title"
                aria-describedby="add-maintenance-task-modal-description"
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
                    borderRadius: 5, // Adding borderRadius for rounded corners
                  }}
                >
                  <Typography
                    id="add-maintenance-task-modal-title"
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    Add Maintenance Task
                  </Typography>
                  <TextField
                    label="Task Description"
                    name="taskDescription"
                    value={maintenanceTask.taskDescription}
                    onChange={handleMaintenanceInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Task Date"
                    name="taskDate"
                    type="date"
                    value={maintenanceTask.taskDate}
                    onChange={handleMaintenanceInputChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    label="Task Cost"
                    name="taskCost"
                    type="number"
                    value={maintenanceTask.taskCost}
                    onChange={handleMaintenanceInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <Box textAlign="right">
                    <Button
                      onClick={() => setIsAddMaintenanceModalOpen(false)}
                      color="primary"
                      variant="outlined"
                      style={{ marginRight: 10 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMaintenanceTask}
                      color="success"
                      variant="outlined"
                    >
                      Add Task
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Box>
          )}
        </>
        <div ref={tasksRef}>
          <CreateCarModal
            open={modalOpen}
            handleClose={() => {confirm("Are you sure you want to close?");setModalOpen(false)}}
            fetchCars={fetchCarDetails}
            initialCarData={car}
            isEditing={true}
          />
        </div>
      </DashboardCard>
      <DashboardCard>
        <MaintenanceTasksList maintenanceTasks={maintenanceTasks} />
      </DashboardCard>
      <DashboardCard>
        <PartnersList partners={partnersList} car={carDetails} />
      </DashboardCard>
      <DashboardCard>
        <CarTransactionsList transactions={transactions} />
      </DashboardCard>
      <DashboardCard>
        <InstallmentsList installments={installments} />
      </DashboardCard>
    </PageContainer>
  );
};

export default CarDetailsPage;
