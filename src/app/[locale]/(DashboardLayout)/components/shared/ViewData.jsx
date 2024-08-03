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
  Tabs,
  Tab
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Define your styles and schema fields
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

const scrollableContentStyle = {
  maxHeight: '60vh', // Adjust this value as needed
  overflowY: 'auto',
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
  const [tabValue, setTabValue] = useState('attendance');

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
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3}>
            <Box sx={{ borderRight: 1, borderColor: 'divider', ...scrollableContentStyle }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
              >
                {Object.keys(schemaFields).map((schema) => (
                  <Tab
                    label={schema.charAt(0).toUpperCase() + schema.slice(1)}
                    value={schema}
                    key={schema}
                  />
                ))}
              </Tabs>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <Box sx={scrollableContentStyle}>
              <FormGroup>
                {schemaFields[tabValue].map((field) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fields[`${tabValue}.${field}`]}
                        onChange={handleFieldChange}
                        name={`${tabValue}.${field}`}
                      />
                    }
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    key={field}
                  />
                ))}
              </FormGroup>
            </Box>
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
