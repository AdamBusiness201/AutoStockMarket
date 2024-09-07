import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
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
  Autocomplete,
} from "@mui/material";
import ClearableTextField from "./ClearableTextField";
import axios from "axios";
import { useTranslations } from "next-intl"; // Import useTranslations hook

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

function getStepContent(step, transactionData, handleInputChange, carOptions, car, t) {
  switch (step) {
    case 0: // Transaction Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              select
              label={t("transactionType")}
              name="type"
              value={transactionData?.type}
              onChange={handleInputChange}
            >
              <MenuItem value="Income">{t("income")}</MenuItem>
              <MenuItem value="Expense">{t("expense")}</MenuItem>
            </ClearableTextField>
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("date")}
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
            <ClearableTextField
              fullWidth
              label={t("amount")}
              name="amount"
              value={transactionData?.amount}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("description")}
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
              renderInput={(params) => <ClearableTextField {...params} label={t("car")} />}
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
                    {t("transactionType")}
                  </TableCell>
                  <TableCell>{transactionData?.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {t("date")}
                  </TableCell>
                  <TableCell>{transactionData?.date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {t("amount")}
                  </TableCell>
                  <TableCell>{transactionData?.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {t("description")}
                  </TableCell>
                  <TableCell>{transactionData?.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {t("car")}
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
  car,
}) => {
  const t = useTranslations('default.transactions.transactionsModal'); // Use useTranslations hook
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
      console.error(t("errorFetchingCars"), error); // Use translated error message
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
    try {
      const response = await axios.post("/api/transactions", data);
      if (response.data.message) {
        // Reset form and close modal if transaction creation is successful
        handleReset();
        handleClose();
        fetchTransactions();
      } else {
        console.error(t("errorCreatingTransaction"), response.data.error); // Use translated error message
      }
    } catch (error) {
      console.error(t("errorCreatingTransaction"), error); // Use translated error message
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const response = await axios.put(`/api/transactions/${transactionData?._id}`, transactionData);
        if (response.data.message) {
          handleReset();
          handleClose();
          fetchTransactions();
        } else {
          console.error(t("errorUpdatingTransaction"), response.data.error); // Use translated error message
        }
      } else {
        await sendTransactionToApi(transactionData);
      }
    } catch (error) {
      console.error(t("errorUpdatingTransaction"), error); // Use translated error message
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
              <StepLabel>{t(label.toLowerCase().replace(" ", ""))}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {getStepContent(activeStep, transactionData, handleInputChange, carOptions, selectedCar, t)}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              {t("back")}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? t("finish") : t("review")}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ marginInlineStart: 1, fontWeight: "bold" }}
            >
              {t("cancel")}
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateTransactionModal;
