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
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Close as CloseIcon, DirectionsCar, People, Receipt, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Define your styles and schema fields
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "1000px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "16px",
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '16px',
  borderBottom: '1px solid #ddd',
};

const bodyStyle = {
  padding: '16px',
  flex: 1,
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 200px)', // Adjust this based on header/footer size
};

const footerStyle = {
  padding: '16px',
  borderTop: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'flex-end',
};

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  cursor: 'pointer',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  '&:hover': {
    borderColor: '#1976d2',
    boxShadow: '0 0 10px rgba(25, 118, 210, 0.5)',
  }
};

const schemaFields = {
  "car": [
    'name', 'color', 'model', 'chassisNumber', 'engineNumber', 'plateNumber', 'odometerNumber', 'owner',
    'purchaseDetails', 'maintenance', 'currentLocation', 'entryDate', 'services', 'carDetails', 'transactions'
  ],
  "employee": [
    'name', 'position', 'hireDate', 'salary', 'benefits', 'contactInfo', 'status', 'statusReason', 'admin',
    'attendance', 'deductions', 'bonus'
  ],
  "transaction": [
    'type', 'date', 'amount', 'remainingAmount', 'bank', 'paymentMethod', 'paidCashOrChequeNumber', 'currency',
    'amountInWords', 'description', 'partners', 'car'
  ],
  "customer": ['name', 'drivingLicense', 'contactDetails', 'debts', 'nationalID'],
};

const icons = {
  "car": <DirectionsCar fontSize="large" color="primary" />,
  "employee": <People fontSize="large" color="primary" />,
  "transaction": <Receipt fontSize="large" color="primary" />,
  "customer": <Person fontSize="large" color="primary" />,
};

const ViewDataModal = ({ open, handleClose, locale }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fields, setFields] = useState({});

  useEffect(() => {
    const initialFieldsState = {};
    Object.keys(schemaFields).forEach(category => {
      schemaFields[category].forEach(field => {
        initialFieldsState[`${category}.${field}`] = false;
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

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  const handleNext = () => {
    setActiveStep(1);
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleOk = async () => {
    const selectedFields = Object.keys(fields).filter(key => fields[key]);
    const params = new URLSearchParams();
    const schemaSet = new Set();

    selectedFields.forEach(field => {
      const [schema, fieldName] = field.split('.');
      params.append('fields', fieldName);
      schemaSet.add(schema);
    });

    schemaSet.forEach(schema => {
      params.append('schema', schema);
    });

    try {
      const response = await axios.get(`/api/row-data?${params.toString()}`);
      const data = response.data;
      console.log(data);

      router.push(`/${locale}/ReportsAndAnalytics/view-data?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={headerStyle} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Customize View</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={bodyStyle}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Select Categories</StepLabel>
            </Step>
            <Step>
              <StepLabel>Select Fields</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2} mt={3}>
              {Object.keys(schemaFields).map((category) => (
                <Grid item xs={6} md={3} key={category}>
                  <Box
                    sx={boxStyle}
                    onClick={() => handleCategoryChange(category)}
                    style={{
                      backgroundColor: selectedCategories.includes(category) ? '#f5f5f5' : 'white'
                    }}
                  >
                    {icons[category]}
                    <Typography variant="h6" sx={{ marginTop: '8px', textTransform: 'capitalize' }}>
                      {`${category}s`}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select fields for selected categories</Typography>
              <FormGroup sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedCategories.flatMap(category =>
                  schemaFields[category].map(field => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={fields[`${category}.${field}`]}
                          onChange={handleFieldChange}
                          name={`${category}.${field}`}
                        />
                      }
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      key={field}
                    />
                  ))
                )}
              </FormGroup>

            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={footerStyle}>
          {activeStep === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={selectedCategories.length === 0}
            >
              Next
            </Button>
          ) :
            (
              <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>
                Back
              </Button>
            )}
          {activeStep === 1 && (
            <Button variant="contained" color="primary" onClick={handleOk}>
              OK
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDataModal;
