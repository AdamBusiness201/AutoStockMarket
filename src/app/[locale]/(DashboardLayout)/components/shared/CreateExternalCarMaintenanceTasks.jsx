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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import axios from "axios";

const steps = ["Task Details", "Review"];

// Function to fetch customers from the API
const fetchCustomers = async () => {
  try {
    const response = await axios.get("/api/customers");
    if (response.data && response.data.customers) {
      return response.data.customers;
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// Function to fetch existing tasks' chassis numbers
const fetchChassisNumbers = async () => {
  try {
    const response = await axios.get("/api/maintenance_tasks/external/chassis");
    if (response.data && response.data.chassisNumbers) {
      return response.data.chassisNumbers;
    }
  } catch (error) {
    console.error("Error fetching chassis numbers:", error);
    return [];
  }
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Adjusted width
  maxWidth: "1500px", // Max width
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px", // Rounded corners
};

function getStepContent(
  step,
  taskData,
  handleInputChange,
  handleTaskCostChange,
  handleTaskDescriptionChange,
  handleTaskDateChange,
  customers,
  chassisNumbers
) {
  switch (step) {
    case 0: // Task Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Car Name"
              name="externalCarDetails.name"
              value={taskData?.externalCarDetails?.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Color"
              name="externalCarDetails.color"
              value={taskData?.externalCarDetails?.color}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Model"
              name="externalCarDetails.model"
              value={taskData?.externalCarDetails?.model}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Chassis Number"
              name="externalCarDetails.chassisNumber"
              value={taskData?.externalCarDetails?.chassisNumber}
              onChange={handleInputChange}
              // Autocomplete feature with suggestions from existing chassis numbers
              autoComplete="off"
              InputProps={{
                list: "chassisNumbers", // ID of the datalist element
              }}
            />
            <datalist id="chassisNumbers">
              {chassisNumbers?.map((chassisNumber) => (
                <option key={chassisNumber} value={chassisNumber} />
              ))}
            </datalist>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Owner</InputLabel>
              <Select
                name="externalCarDetails.owner"
                value={taskData?.externalCarDetails?.owner}
                onChange={handleInputChange}
              >
                {customers?.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              multiline
              label="Task Description"
              name="taskDescription"
              value={taskData?.taskDescription}
              onChange={handleTaskDescriptionChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Task Cost"
              name="taskCost"
              value={taskData?.taskCost}
              onChange={handleTaskCostChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Task Date"
              type="date"
              name="taskDate"
              value={taskData?.taskDate}
              onChange={handleTaskDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      );
    case 1: // Review
      return (
        <div>
          <Typography variant="h6">Review Task Details</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="review task details">
              <TableBody>
                <TableRow>
                  <TableCell>Car Name</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Color</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.color}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Chassis Number</TableCell>
                  <TableCell>
                    {taskData?.externalCarDetails?.chassisNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Owner</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.owner}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Task Description</TableCell>
                  <TableCell>{taskData?.taskDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Task Cost</TableCell>
                  <TableCell>{taskData?.taskCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Task Date</TableCell>
                  <TableCell>{taskData?.taskDate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );

    default:
      return "Unknown step";
  }
}

const CreateMaintenanceTaskModal = ({
  open,
  handleClose,
  fetchMaintenanceTasks,
  initialTaskData,
  isEditing,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [taskData, setTaskData] = useState(initialTaskData);
  const [customers, setCustomers] = useState([]);
  const [chassisNumbers, setChassisNumbers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const fetchedCustomers = await fetchCustomers();
      setCustomers(fetchedCustomers);
      const fetchedChassisNumbers = await fetchChassisNumbers();
      setChassisNumbers(fetchedChassisNumbers);
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    setTaskData(initialTaskData);
    setActiveStep(0);
  }, [open, initialTaskData]);

  useEffect(() => {
    async function fetchChassis() {
      const fetchedChassisNumbers = await fetchChassisNumbers();
      setTaskData((prevData) => ({
        ...prevData,
        chassisNumbers: fetchedChassisNumbers,
      }));
    }
    fetchChassis();
  }, []);

  const handleReset = () => {
    setActiveStep(0);
    setTaskData(initialTaskData);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(); // Call the handleSubmit function to submit the form data
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    console.log(taskData);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [category, key] = name.split("."); // Assumes name is in the format "category.key"

    setTaskData((prevData) => ({
      ...prevData,
      [category]: {
        // Safely spread prevData[category] if it exists or default to an empty object
        ...(prevData && prevData[category] ? prevData[category] : {}),
        [key]: value,
      },
    }));
  };

  const handleTaskCostChange = (e) => {
    const { value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      taskCost: value,
    }));
  };

  const handleTaskDescriptionChange = (e) => {
    const { value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      taskDescription: value,
    }));
  };

  const handleTaskDateChange = (e) => {
    const { value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      taskDate: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Make a PUT request to update the task data
        const response = await axios.put(
          `/api/maintenance_tasks/external/${taskData?._id}`,
          taskData
        );
        if (response.data.message) {
          // Reset form and close modal if task update is successful
          handleReset();
          handleClose();
          fetchMaintenanceTasks();
        } else {
          console.error("Error updating task:", response.data.error);
        }
      } else {
        console.log(taskData)
        const response = await axios.post(
          "/api/maintenance_tasks/external",
          taskData
        );
        if (response.data.message) {
          // Reset form and close modal if task creation is successful
          handleReset();
          handleClose();
          fetchMaintenanceTasks();
        } else {
          console.error("Error creating task:", response.data.error);
        }
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
          {getStepContent(
            activeStep,
            taskData,
            handleInputChange,
            handleTaskCostChange,
            handleTaskDescriptionChange, // Correct position for description change
            handleTaskDateChange, // Correct position for date change
            customers,
            chassisNumbers
          )}
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

export default CreateMaintenanceTaskModal;
