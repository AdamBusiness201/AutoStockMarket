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
  MenuItem, // Import MenuItem for select list
  InputAdornment,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx library
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { currencies } from './currencies'

const steps = ["Car Details", "Ownership", "Partnership", "Finance", "Review"];


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
const InvoiceTable = ({ invoices }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Invoice Number</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell>{invoice.number}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

function getStepContent(step, carData, partners, handleInputChange, handlePartnerInputChange, removePartner, financeData, handleFinanceInputChange, idType, setIdType, handleIdTypeChange) {

  console.log(carData)
  switch (step) {
    case 0: // Car Details
      return (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Car Name"
              name="name"
              value={carData?.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={carData?.color}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={carData?.model}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Chassis Number"
              name="chassisNumber"
              value={carData?.chassisNumber}
              onChange={handleInputChange}
              autoCapitalize="true"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Engine Number"
              name="engineNumber"
              value={carData?.engineNumber}
              onChange={handleInputChange}
              autoCapitalize="true"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Plate Number"
              name="plateNumber"
              value={carData?.plateNumber}
              onChange={handleInputChange}
              autoCapitalize="true"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Odometer Number"
              name="odometerNumber"
              value={carData?.odometerNumber}
              onChange={handleInputChange}
              autoCapitalize="true"
            />
          </Grid>
        </Grid>
      );

    case 1: // Ownership
      return (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Owner"
              name="owner"
              value={carData?.owner}
              onChange={handleInputChange}
              autoComplete="false"
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="id-type-label">ID Type</InputLabel>
              <Select
                labelId="id-type-label"
                id="id-type"
                value={idType}
                label="ID Type"
                onChange={handleIdTypeChange}
              >
                <MenuItem value="ownerID">Owner National Identification Number</MenuItem>
                <MenuItem value="ownerDrivingLicense">Driving License</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {idType === "ownerID" ? (
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Owner National Identification Number"
                name="ownerID"
                value={carData?.ownerID}
                onChange={handleInputChange}
                autoComplete="false"
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Driving License"
                name="ownerDrivingLicense"
                value={carData?.ownerDrivingLicense}
                onChange={handleInputChange}
                autoComplete="false"
              />
            </Grid>
          )}

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Maintenance"
              name="maintenance"
              value={carData?.maintenance}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Current Location"
              name="currentLocation"
              value={carData?.currentLocation}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Purchase Details"
              name="purchaseDetails"
              value={carData?.purchaseDetails}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      );

    case 2: // Partnership
      return (
        <Grid container spacing={2}>
          {partners.length > 0 ? (partners.map((partner, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="subtitle1">
                {index === 0 ? "First" : index === 1 ? "Second" : index === 2 ? "Third" : `${index + 1}th`} Partner
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Partner Name"
                    name={`partners.name`}
                    value={partner.name}
                    onChange={(e) => handlePartnerInputChange(e, index)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Partner Type"
                    name={`partner.type`}
                    value={partner.type}
                    onChange={(e) => handlePartnerInputChange(e, index)}
                  >
                    {["Supplier", "Partner", "Other"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Partner Email"
                    name={`partner.email`}
                    value={partner.email}
                    onChange={(e) => handlePartnerInputChange(e, index)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Partner Phone"
                    name={`partner.phone`}
                    value={partner.phone}
                    onChange={(e) => handlePartnerInputChange(e, index)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Partnership Percentage"
                    name={`partner.percentage`}
                    value={partner.percentage}
                    onChange={(e) => handlePartnerInputChange(e, index)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
              {index > 0 && ( // Render remove button for all partners except the first one
                <Button sx={{ marginY: 3 }} variant="outlined" color="error" onClick={() => removePartner(index)}>
                  Remove Partner
                </Button>
              )}
            </Grid>
          ))) : (
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Click Add Partner To Add Partners to this Car
              </Typography>
            </Grid>)}
        </Grid>
      );

    case 3: // Finance
      return (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Entry Date"
              type="date"
              name="entryDate"
              value={carData?.entryDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              name="price"
              value={financeData.price}
              onChange={handleFinanceInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Currency"
              name="currency"
              value={financeData.currency}
              onChange={handleFinanceInputChange}
              select // Add select attribute to render a select list
            >
              {currencies?.map((currency) => ( // Assuming you have an array named currencies containing all currencies
                <MenuItem key={currency.symbol} value={currency.code}>
                  {currency.symbol} - {currency.code} - {currency.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount in Words"
              name="amountInWords"
              value={financeData.amountInWords}
              onChange={handleFinanceInputChange}
              disabled
            />
          </Grid>


          <Grid item xs={4}>
            <TextField
              fullWidth
              select
              label="Payment Method"
              name="paymentMethod"
              value={financeData.paymentMethod}
              onChange={handleFinanceInputChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Installment">Installment</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Paid Cash/Cheque Number"
              name="paidCashOrChequeNumber"
              value={financeData.paidCashOrChequeNumber}
              onChange={handleFinanceInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Bank"
              name="bank"
              value={financeData.bank}
              onChange={handleFinanceInputChange}
            />
          </Grid>
          {financeData.paymentMethod === "Installment" && (
            <>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="First Installment"
                  type="number"
                  name="firstInstallment"
                  value={financeData.firstInstallment}
                  onChange={handleFinanceInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Remaining Amount"
                  name="remainingAmount"
                  value={financeData.remainingAmount}
                  onChange={handleFinanceInputChange}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
      );

    case 4: // Finalize
      return (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="car details">
              <TableBody>
                {/* Render car data */}
                <TableRow>
                  <TableCell component="th" scope="row">Car Name</TableCell>
                  <TableCell>{carData?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Color</TableCell>
                  <TableCell>{carData?.color}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Model</TableCell>
                  <TableCell>{carData?.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Chassis Number</TableCell>
                  <TableCell>{carData?.chassisNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Engine Number</TableCell>
                  <TableCell>{carData?.engineNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Plate Number</TableCell>
                  <TableCell>{carData?.plateNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Odometer Number</TableCell>
                  <TableCell>{carData?.odometerNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Owner</TableCell>
                  <TableCell>{carData?.owner}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Owner National Identification Number</TableCell>
                  <TableCell>{carData?.ownerID}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Driving License</TableCell>
                  <TableCell>{carData?.ownerDrivingLicense}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Maintenance</TableCell>
                  <TableCell>{carData?.maintenance}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Current Location</TableCell>
                  <TableCell>{carData?.currentLocation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Purchase Details</TableCell>
                  <TableCell>{carData?.purchaseDetails}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Entry Date</TableCell>
                  <TableCell>{carData?.entryDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Price</TableCell>
                  <TableCell>{financeData?.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Currency</TableCell>
                  <TableCell>{financeData?.currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Paid Cash/Cheque Number</TableCell>
                  <TableCell>{financeData?.paidCashOrChequeNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Bank</TableCell>
                  <TableCell>{financeData?.bank}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Payment Method</TableCell>
                  <TableCell>{financeData?.paymentMethod}</TableCell>
                </TableRow>
                {financeData?.paymentMethod === "Installment" && (
                  <>
                    <TableRow>
                      <TableCell component="th" scope="row">First Installment</TableCell>
                      <TableCell>{financeData?.firstInstallment}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Remaining Amount</TableCell>
                      <TableCell>{financeData?.remainingAmount}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Partner</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.map((partner, index) => (
                  <TableRow key={index}>
                    <TableCell>Partner {index + 1}</TableCell>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>{partner.type}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>{partner.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );

    default:
      return "Unknown step";
  }
}


const CreateCarModal = ({
  open,
  handleClose,
  fetchCars,
  initialCarData,
  isEditing,
}) => {
  const [idType, setIdType] = useState("ownerID");

  const handleIdTypeChange = (event) => {
    setIdType(event.target.value);
  };
  console.log(currencies)
  const [activeStep, setActiveStep] = useState(0);
  const [carData, setCarData] = useState(initialCarData);
  const initialFinanceData = {
    price: '',
    currency: 'USD',
    amountInWords: '',
    paidCashOrChequeNumber: '',
    bank: '',
    paymentMethod: 'Cash',
    firstInstallment: '',
    remainingAmount: '',
  }
  const initialPartnersData = []
  const [financeData, setFinanceData] = useState(initialFinanceData);
  const [errorMessage, setErrorMessage] = useState('');
  const [partners, setPartners] = useState(initialPartnersData);

  const [invoices, setInvoices] = useState([]); // State to store invoices
  function convertNumberToWords(amount, language = 'en') {
    const englishWords = {
      a: [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
      ],
      b: [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
      ],
    };

    const arabicWords = {
      a: [
        '',
        'واحد',
        'اثنان',
        'ثلاثة',
        'أربعة',
        'خمسة',
        'ستة',
        'سبعة',
        'ثمانية',
        'تسعة',
        'عشرة',
        'أحد عشر',
        'اثنا عشر',
        'ثلاثة عشر',
        'أربعة عشر',
        'خمسة عشر',
        'ستة عشر',
        'سبعة عشر',
        'ثمانية عشر',
        'تسعة عشر',
      ],
      b: [
        '',
        '',
        'عشرون',
        'ثلاثون',
        'أربعون',
        'خمسون',
        'ستون',
        'سبعون',
        'ثمانون',
        'تسعون',
      ],
    };

    const words = language === 'ar' ? arabicWords : englishWords;

    const numToString = (n) => {
      if (n < 20) return words.a[n];
      if (n < 100) return words.b[Math.floor(n / 10)] + (n % 10 ? '-' + words.a[n % 10] : '');
      if (n < 1000)
        return (
          words.a[Math.floor(n / 100)] +
          (language === 'ar' ? ' مائة' : ' hundred') +
          (n % 100 ? ' ' + numToString(n % 100) : '')
        );
      return (
        numToString(Math.floor(n / 1000)) +
        (language === 'ar' ? ' ألف' : ' thousand') +
        (n % 1000 ? ' ' + numToString(n % 1000) : '')
      );
    };

    return numToString(amount);
  }

  // Function to add a new partner
  const addPartner = () => {
    setPartners([...partners, { name: "", type: "Partner", email: "", phone: "", percentage: 0 }]);
  };

  // Function to remove a partner
  const removePartner = (index) => {
    const updatedPartners = [...partners];
    updatedPartners.splice(index, 1);
    setPartners(updatedPartners);
  };

  // Function to handle input change for partners
  const handlePartnerInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPartners = [...partners];
    updatedPartners[index] = { ...updatedPartners[index], [name.split(".")[1]]: value };

    // Calculate the total percentage
    const totalPercentage = updatedPartners.reduce((total, partner) => total + parseInt(partner.percentage || 0), 0);

    // If the total percentage exceeds 100, prevent updating the state
    if (totalPercentage <= 100) {
      setPartners(updatedPartners);
      setErrorMessage(""); // Clear error message if total percentage is valid
    } else {
      // Optionally, you can display an error message or handle the exceeding case here
      setErrorMessage("Total percentage exceeds 100!");
      // You can choose to set an error state here if needed
    }
  };

  const handleFinanceInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === 'price' || name === 'firstInstallment') {
      const newPrice = name === 'price' ? parseFloat(value) : parseFloat(financeData.price);
      const newFirstInstallment = name === 'firstInstallment' ? parseFloat(value) : parseFloat(financeData.firstInstallment);

      const remainingAmount = isNaN(newPrice - newFirstInstallment) ? '' : (newPrice - newFirstInstallment).toFixed(2);
      const amountInWords = convertNumberToWords(newPrice, 'en') + ' | ' + convertNumberToWords(newPrice, 'ar');

      setFinanceData((prevData) => ({
        ...prevData,
        [name]: value,
        remainingAmount,
        amountInWords,
      }));
    } else {
      setFinanceData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  useEffect(() => {
    setCarData(initialCarData);
    setActiveStep(0);
  }, [open, initialCarData]);

  const handleReset = () => {
    setActiveStep(0);
    setCarData(initialCarData);
    setFinanceData(initialFinanceData);
    setPartners(initialPartnersData);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "value" && { firstInstallment: value }), // Automatically set firstInstallment
    }));
    console.log(carData)
  };
  const sendCarToApi = async (data) => {
    // Make a POST request to create a new car
    const response = await axios.post("/api/car", data);
    if (response.data.message) {
      setInvoices(response.data.invoices); // Store invoices in state

      console.log(response.data)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: "Flip"
      })
      handleReset();
      handleClose();
      fetchCars();;


    } else {
      console.error("Error creating car:", response.data.error);
      toast.error(response?.data?.error, {
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

  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true); // Set loading state to true
    try {
      const mergedData = { ...carData, partners, finance: financeData };
      console.log(mergedData);
      if (isEditing) {
        // Make a PUT request to update the car data
        const response = await axios.put(`/api/car/${carData?._id}`, mergedData);
        if (response.data.message) {
          setInvoices(response.data.invoices); // Store invoices in state
          handleReset();
          handleClose();
          fetchCars();
        } else {
          console.error("Error updating car:", response.data.error);
        }
      } else {
        await sendCarToApi(mergedData)
      }
      setLoading(false); // Set loading state to true
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.error, {
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
      setLoading(false); // Set loading state to true
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true); // Set loading state to true
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Process excelData as needed (e.g., send it to the server)
        console.log("Excel data:", excelData);

        // Iterate through each row (skipping the header row)
        for (let i = 1; i < excelData.length; i++) {
          const rowData = excelData[i];
          const excelCarData = {
            name: rowData[0],
            color: rowData[1],
            model: rowData[2],
            chassisNumber: rowData[3],
            owner: rowData[4],
            purchaseDetails: rowData[5],
            entryDate: new Date(rowData[6]), // Assuming the entryDate is in the correct format
            maintenance: rowData[7],
            currentLocation: rowData[8],
          };

          await sendCarToApi(excelCarData)
        }

        setLoading(false); // Set loading state to false after processing
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      setLoading(false); // Set loading state to false in case of error
    }
  };
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const validateStep = (step) => {
    let isValid = true;
    let errorMsg = "";
    switch (step) {
      case 0:
        isValid = carData?.name && carData?.color && carData?.model && carData?.chassisNumber;
        if (!isValid) errorMsg = "All fields are required in Car Details.";
        break;
      case 1:
        isValid = carData?.owner && carData?.purchaseDetails && carData?.maintenance && carData?.currentLocation;
        if (!isValid) errorMsg = "All fields are required in Ownership.";
        break;
      default:
        isValid = true;
    }
    setIsNextDisabled(!isValid);
    setErrorMessage(!isValid ? errorMsg : "");
  };
  useEffect(() => {
    validateStep(activeStep);
  }, [activeStep, carData, partners]);
  const handleExportTemplate = () => {
    const templateData = [
      {
        name: "",
        color: "",
        model: "",
        chassisNumber: "",
        engineNumber: "",
        plateNumber: "",
        odometerNumber: "",
        owner: "",
        ownerID: "",
        ownerDrivingLicense: "",
        maintenance: "",
        currentLocation: "",
        purchaseDetails: "",
        entryDate: "",
        partners: [
          {
            name: "",
            type: "",
            email: "",
            phone: "",
            percentage: "",
          },
        ],
        finance: {
          price: "",
          currency: "",
          expenses: "",
        },
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "CarDataTemplate.xlsx");
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={modalStyle}>
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
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div style={{ paddingTop: 20, paddingBottom: 20 }}>

            <Box sx={{ maxHeight: '300px', overflowY: 'auto', paddingY: 3 }}>
              {getStepContent(activeStep, carData, partners, handleInputChange, handlePartnerInputChange, removePartner, financeData, handleFinanceInputChange, idType, setIdType, handleIdTypeChange)}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>

              <input
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                id="contained-button-file"
                multiple={false}
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  {loading ? "Loading" : "Upload Excel"}
                </Button>
              </label>
              <Button variant="contained" color="primary" sx={{ marginLeft: 1 }} onClick={handleExportTemplate}>
                Download Template
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ marginLeft: 1 }}
              >
                Back
              </Button>



              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep === 2 && (
                <Button variant="outlined" onClick={addPartner} sx={{ marginRight: 2 }}>Add Partner</Button>
              )}
              <Button onClick={handleNext} disabled={isNextDisabled} variant="outlined" sx={{ fontWeight: "bold" }}>
                {activeStep === steps.length - 1 ? "Finish" : errorMessage ? `Next - ${errorMessage}` : "Next"}
              </Button>

            </Box>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CreateCarModal;
