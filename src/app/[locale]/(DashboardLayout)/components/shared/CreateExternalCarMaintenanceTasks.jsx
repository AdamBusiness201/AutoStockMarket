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
import ClearableTextField from "./ClearableTextField";
import axios from "axios";
import { useTranslations } from 'next-intl';

const steps = ["Task Details", "Review"];

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
  width: "80%",
  maxWidth: "1500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

function getStepContent(
  step,
  taskData,
  handleInputChange,
  handleTaskCostChange,
  handleTaskDescriptionChange,
  handleTaskDateChange,
  customers,
  chassisNumbers,
  t
) {
  switch (step) {
    case 0: // Task Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.carName")}
              name="externalCarDetails.name"
              value={taskData?.externalCarDetails?.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.color")}
              name="externalCarDetails.color"
              value={taskData?.externalCarDetails?.color}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.model")}
              name="externalCarDetails.model"
              value={taskData?.externalCarDetails?.model}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.chassisNumber")}
              name="externalCarDetails.chassisNumber"
              value={taskData?.externalCarDetails?.chassisNumber}
              onChange={handleInputChange}
              autoComplete="off"
              InputProps={{
                list: "chassisNumbers",
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
              <InputLabel>{t("taskDetails.owner")}</InputLabel>
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
            <ClearableTextField
              fullWidth
              multiline
              label={t("taskDetails.taskDescription")}
              name="taskDescription"
              value={taskData?.taskDescription}
              onChange={handleTaskDescriptionChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.taskCost")}
              name="taskCost"
              value={taskData?.taskCost}
              onChange={handleTaskCostChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("taskDetails.taskDate")}
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
          <Typography variant="h6">{t("review.title")}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label={t("review.tableTitle")}>
              <TableBody>
                <TableRow>
                  <TableCell>{t("review.carName")}</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.color")}</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.color}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.model")}</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.chassisNumber")}</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.chassisNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.owner")}</TableCell>
                  <TableCell>{taskData?.externalCarDetails?.owner}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.taskDescription")}</TableCell>
                  <TableCell>{taskData?.taskDescription}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.taskCost")}</TableCell>
                  <TableCell>{taskData?.taskCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("review.taskDate")}</TableCell>
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
  const t = useTranslations('default.externalCarMaintenance.modal'); // Assuming 'modal' namespace for translations

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

  const handleReset = () => {
    setActiveStep(0);
    setTaskData(initialTaskData);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
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
    const [category, key] = name.split(".");

    setTaskData((prevData) => ({
      ...prevData,
      [category]: {
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
        const response = await axios.put(
          `/api/maintenance_tasks/external/${taskData?._id}`,
          taskData
        );
        if (response.data.message) {
          handleReset();
          handleClose();
          fetchMaintenanceTasks();
        } else {
          console.error("Error updating task:", response.data.error);
        }
      } else {
        const response = await axios.post(
          "/api/maintenance_tasks/external",
          taskData
        );
        if (response.data.message) {
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
    e.returnValue = "";
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
              <StepLabel>{t(`steps.${label}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          {getStepContent(
            activeStep,
            taskData,
            handleInputChange,
            handleTaskCostChange,
            handleTaskDescriptionChange,
            handleTaskDateChange,
            customers,
            chassisNumbers,
            t
          )}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              {t("buttons.back")}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? t("buttons.finish") : t("buttons.next")}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ marginLeft: 1, fontWeight: "bold" }}
            >
              {t("buttons.cancel")}
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateMaintenanceTaskModal;
