import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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

const schemaFields = {
  "attendance": ['employee', 'date', 'attendanceStatus', 'shift', 'location', 'notes', 'timeIn', 'timeOut'],
  "bonus": ['employee', 'amount', 'reason', 'dateReceived'],
  "carDetails": ['car', 'value', 'currency', 'amountInWords', 'sellingPrice', 'capital', 'maintenanceCosts', 'netProfit', 'purchaseCompleted'],
  "car": ['name', 'color', 'model', 'chassisNumber', 'engineNumber', 'plateNumber', 'odometerNumber', 'owner', 'purchaseDetails', 'maintenance', 'currentLocation', 'entryDate', 'services'],
  "customer": ['name', 'drivingLicense', 'contactDetails', 'debts', 'nationalID'],
  "deduction": ['employee', 'amount', 'reason', 'date'],
  "employee": ['name', 'position', 'hireDate', 'salary', 'benefits', 'contactInfo', 'status', 'statusReason', 'admin'],
  "installment": ['installmentDate', 'amount', 'description', 'car', 'paid'],
  "invoice": ['transaction', 'customerType', 'customer', 'invoiceDate', 'totalAmount'],
  "maintenanceTask": ['car', 'externalCarDetails', 'taskDescription', 'taskDate', 'taskCost'],
  "partner": ['name', 'type', 'contactInfo', 'partnershipPercentage', 'cars'],
  "soldCar": ['car', 'previousOwner', 'purchaser', 'purchaseDate', 'purchasePrice', 'salesMember', 'sourceOfSelling'],
  "transaction": ['type', 'date', 'amount', 'remainingAmount', 'bank', 'paymentMethod', 'paidCashOrChequeNumber', 'currency', 'amountInWords', 'description', 'partners', 'car']
};

const ViewDataModal = ({ open, handleClose, locale }) => {
  const router = useRouter();
  const [fields, setFields] = useState({});

  useEffect(() => {
    // Initialize fields state with all available schema fields
    const initialFieldsState = {};
    Object.keys(schemaFields).forEach(schema => {
      schemaFields[schema].forEach(field => {
        initialFieldsState[`${schema}.${field}`] = false;
      });
    });
    setFields(initialFieldsState);
  }, []);

  const handleFieldChange = (event) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.checked,
    });
  };

  const handleOk = () => {
    const selectedFields = Object.keys(fields).filter(key => fields[key]);
    const params = new URLSearchParams();
    selectedFields.forEach(field => {
      const [schema, fieldName] = field.split('.');
      params.append('schema', schema);
      params.append('fields', fieldName);
    });
    router.push(`/${locale}/ReportsAndAnalytics/view-data?${params.toString()}`);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Customize View</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} pr={2} mt={2} sx={{ maxHeight: "300px", overflowY: "auto" }}>
          <Grid item xs={12}>
            {Object.keys(schemaFields).map((schema) => (
              <Accordion key={schema}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{schema.charAt(0).toUpperCase() + schema.slice(1)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    {schemaFields[schema].map((field) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fields[`${schema}.${field}`]}
                            onChange={handleFieldChange}
                            name={`${schema}.${field}`}
                          />
                        }
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        key={field}
                      />
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleOk}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDataModal;
