import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from 'next-intl';
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
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import ClearableTextField from "./ClearableTextField";
import axios from "axios";

const steps = ["employeeDetails", "review"];

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

function getStepContent(step, employeeData, handleInputChange, admins, t) {
  switch (step) {
    case 0: // Employee Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("employeeName")}
              name="name"
              value={employeeData?.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("position")}
              name="position"
              value={employeeData?.position}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("salary")}
              name="salary"
              type="number"
              value={employeeData?.salary}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("hireDate")}
              name="hireDate"
              type="date"
              value={employeeData?.hireDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("benefits")}
              name="benefits"
              value={employeeData?.benefits}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("email")}
              name="email"
              type="email"
              value={employeeData?.contactInfo?.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("phone")}
              name="phone"
              value={employeeData?.contactInfo?.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("address")}
              name="address"
              value={employeeData?.contactInfo?.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("nationalID")}
              name="nationalID"
              value={employeeData?.contactInfo?.nationalID}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t("nationality")}
              name="nationality"
              value={employeeData?.contactInfo?.nationality}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="status-select">{t("status")}</InputLabel>
              <Select
                fullWidth
                labelId="status-select"
                id="status-select"
                name="status"
                value={employeeData?.status}
                onChange={handleInputChange}
              >
                <MenuItem value="active">{t("active")}</MenuItem>
                <MenuItem value="inactive">{t("inactive")}</MenuItem>
                <MenuItem value="hold">{t("hold")}</MenuItem>
                <MenuItem value="trainee">{t("trainee")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <ClearableTextField
              fullWidth
              label={t("statusReason")}
              name="statusReason"
              value={employeeData?.statusReason}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="admin-select">{t("admin")}</InputLabel>
              <Select
                fullWidth
                labelId="admin-select"
                id="admin-select"
                name="admin"
                value={employeeData?.admin}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>{t("none")}</em>
                </MenuItem>
                {admins?.map((admin) => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      );
    case 1: // Review
      return (
        <TableContainer component={Paper}>
          <Table aria-label="employee details">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">{t("employeeName")}</TableCell>
                <TableCell>{employeeData?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("position")}</TableCell>
                <TableCell>{employeeData?.position}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("salary")}</TableCell>
                <TableCell>{employeeData?.salary}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("hireDate")}</TableCell>
                <TableCell>{employeeData?.hireDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("benefits")}</TableCell>
                <TableCell>{employeeData?.benefits}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("email")}</TableCell>
                <TableCell>{employeeData?.contactInfo?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("phone")}</TableCell>
                <TableCell>{employeeData?.contactInfo?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("address")}</TableCell>
                <TableCell>{employeeData?.contactInfo?.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("nationalID")}</TableCell>
                <TableCell>{employeeData?.contactInfo?.nationalID}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("nationality")}</TableCell>
                <TableCell>{employeeData?.contactInfo?.nationality}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("status")}</TableCell>
                <TableCell>{employeeData?.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("statusReason")}</TableCell>
                <TableCell>{employeeData?.statusReason}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">{t("admin")}</TableCell>
                <TableCell>{employeeData?.admin}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
    default:
      return "Unknown step";
  }
}

export default function CreateEmployeeModal({ open, onClose, admins }) {
  const [activeStep, setActiveStep] = useState(0);
  const [employeeData, setEmployeeData] = useState({});
  const t = useTranslations('default.employees.employeeModal');

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle form submission
      // Here you would typically send a request to save employeeData
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          {t(steps[activeStep])}
        </Typography>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{t(label)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={2} sx={{maxHeight:"300px", overflowY:'auto'}}>
          {getStepContent(activeStep, employeeData, handleInputChange, admins, t)}
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            {t("back")}
          </Button>
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? t("finish") : t("next")}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ marginLeft: 1, fontWeight: "bold" }}
          >
            {t("cancel")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
