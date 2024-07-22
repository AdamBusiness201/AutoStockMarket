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
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const steps = ["Installment Details", "Review"];

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

function getStepContent(step, installmentData, handleInputChange) {
  switch (step) {
    case 0: // Installment Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Installment Date"
              type="date"
              name="installmentDate"
              value={installmentData?.installmentDate}
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
              value={installmentData?.amount}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={installmentData?.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              control={<Switch checked={installmentData?.paid} onChange={(e) => handleInputChange({
                target: {
                  name: "paid",
                  value: e.target.checked,
                },
              })} />}
              label="Paid"
            />
          </Grid>
        </Grid>
      );
    case 1: // Review
      return (
        <TableContainer component={Paper}>
          <Table aria-label="installment details">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Installment Date</TableCell>
                <TableCell>{installmentData?.installmentDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Amount</TableCell>
                <TableCell>{installmentData?.amount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Description</TableCell>
                <TableCell>{installmentData?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Paid</TableCell>
                <TableCell>{installmentData?.paid ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );

    default:
      return "Unknown step";
  }
}

const CreateInstallmentModal = ({ open, handleClose, fetchInstallments, initialInstallmentData, car }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [installmentData, setInstallmentData] = useState(initialInstallmentData || {});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setInstallmentData(initialInstallmentData);
    setActiveStep(0);
  }, [open, initialInstallmentData]);

  const handleReset = () => {
    setActiveStep(0);
    setInstallmentData(initialInstallmentData);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInstallmentData({ ...installmentData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const url = installmentData?._id ? `/api/installments/${installmentData._id}` : "/api/installments";
      const method = installmentData?._id ? 'put' : 'post';
      const response = await axios[method](url, { ...installmentData, car });
      if (response.data) {
        handleReset();
        handleClose();
        fetchInstallments();
        setSuccessMessage(response.data.message);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: "Flip",
        });
      } else {
        setErrorMessage(response.data.error);
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: "Flip",
        });
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: "Flip",
      });
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
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition="Flip"
      />

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
              {getStepContent(activeStep, installmentData, handleInputChange)}
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
          {errorMessage && (
            <Box sx={{ color: 'error.main', mt: 2 }}>
              <Typography variant="body1">{errorMessage}</Typography>
            </Box>
          )}
          {successMessage && (
            <Box sx={{ color: 'success.main', mt: 2 }}>
              <Typography variant="body1">{successMessage}</Typography>
            </Box>
          )}
        </Box>
      </Modal></>
  );
};


export default CreateInstallmentModal;
