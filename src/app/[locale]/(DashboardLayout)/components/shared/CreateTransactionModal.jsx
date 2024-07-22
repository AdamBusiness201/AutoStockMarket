import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  TableCell,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  InputAdornment,
  Autocomplete, // Import Autocomplete
  Select,
} from "@mui/material";
import axios from "axios";

const steps = ["Transaction Details", "Review"];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "1500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

function getStepContent(step, transactionData, handleInputChange, carOptions, car) {
  switch (step) {
    case 0: // Transaction Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Transaction Type"
              name="type"
              value={transactionData?.type}
              onChange={handleInputChange}
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={transactionData?.date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={transactionData?.amount}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={transactionData?.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={carOptions}
              getOptionLabel={(option) => `${option.name} | ${option.chassisNumber}`} // Concatenating name and chassisNumber
              renderInput={(params) => <TextField {...params} label="Car" />}
              value={car} // Set the initial value of the Autocomplete
              onChange={(event, value) => handleInputChange({ target: { name: "car", value: value?._id } })}
            />
          </Grid>
        </Grid>
      );
    case 1: // Review
      return (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="transaction details">
              <TableBody>
                {/* Render transaction data */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    Transaction Type
                  </TableCell>
                  <TableCell>{transactionData?.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Date
                  </TableCell>
                  <TableCell>{transactionData?.date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Amount
                  </TableCell>
                  <TableCell>{transactionData?.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Description
                  </TableCell>
                  <TableCell>{transactionData?.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Car
                  </TableCell>
                  <TableCell>{transactionData?.car?.name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );

    default:
      return "Unknown step";
  }
}

const CreateTransactionModal = ({
  open,
  handleClose,
  fetchTransactions,
  initialTransactionData,
  isEditing,
  car
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [transactionData, setTransactionData] = useState(initialTransactionData);
  const [carOptions, setCarOptions] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // State for the selected car

  useEffect(() => {
    setTransactionData(initialTransactionData);
    setActiveStep(0);
    fetchCarOptions();
    // Set the selected car when the 'car' prop changes
    setSelectedCar(car ? car : null);
  }, [open, initialTransactionData, car]); // Include 'car' in the dependency array

  const fetchCarOptions = async () => {
    try {
      const response = await axios.get("/api/car");
      setCarOptions(response.data.cars);
    } catch (error) {
      console.error("Error fetching car options:", error);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setTransactionData(initialTransactionData);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(); // Call the handleSubmit function to submit the form data
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  const sendTransactionToApi = async (data) => {
    // Make a POST request to create a new transaction
    const response = await axios.post("/api/transactions", data);
    if (response.data.message) {
      // Reset form and close modal if transaction creation is successful
      handleReset();
      handleClose();
      fetchTransactions();
    } else {
      console.error("Error creating transaction:", response.data.error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Make a PUT request to update the transaction data
        const response = await axios.put(`/api/transactions/${transactionData?._id}`, transactionData);
        if (response.data.message) {
          // Reset form and close modal if transaction update is successful
          handleReset();
          handleClose();
          fetchTransactions();
        } else {
          console.error("Error updating transaction:", response.data.error);
        }
      } else {
        await sendTransactionToApi(transactionData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const preventClose = useCallback((e) => {
    e.preventDefault();
    e.returnValue = ""; // Chrome requires returnValue to be set
  }, []);

  useEffect(() => {
    if (open) {
      window.addEventListener("beforeunload", preventClose);
    } else {
      window.removeEventListener("beforeunload", preventClose);
    }

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, [open, preventClose]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {getStepContent(activeStep, transactionData, handleInputChange, carOptions, selectedCar)}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateTransactionModal;
