'use client'
import React, { useState } from 'react';
import { Box, Button, Collapse, Typography, IconButton, Link } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const DocumentationPage = ({ params }) => {
  const [openSections, setOpenSections] = useState({
    quickStart: true,
    addNewCar: false,
    addCarExpenses: false,
    addCarInstallments: false,
    findCarDetails: false,
    editCarDetails: false,
    printCarDetails: false,
    deleteCar: false,
    addMaintenanceTask: false,
    sellCar: false,
    userGuide: false,
    faq: false,
  });

  const handleToggle = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <PageContainer title="Documentation" description="How to use the system" lang={params.lang}>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("quickStart")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Start Guide
            </Typography>
            <IconButton>
              {openSections.quickStart ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.quickStart}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">
                Here you will find a quick start guide to help you get up and running with the system.
                <br />
                <Link href="/path/to/quick-start" target="_blank" underline="none">
                  Read more
                </Link>
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>

      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("addNewCar")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Add a New Car
            </Typography>
            <IconButton>
              {openSections.addNewCar ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.addNewCar}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Step 1: Open the Add Car Modal</Typography>
              <Typography variant="body1" gutterBottom>
                To add a new car to the system, navigate to the Cars page from the sidebar and click on the plus icon (+) to open the adding modal.
              </Typography>

              <Typography variant="h6">Step 2: Enter Car Details</Typography>
              <Typography variant="body1" gutterBottom>
                Fill in the following fields:
                <ul>
                  <li>
                    <strong>Car Name:</strong> The name of the car.
                  </li>
                  <li>
                    <strong>Color:</strong> The color of the car.
                  </li>
                  <li>
                    <strong>Model:</strong> The model of the car.
                  </li>
                  <li>
                    <strong>Chassis Number:</strong> The unique identifier for the car chassis.
                  </li>
                  <li>
                    <strong>Price:</strong> The selling price of the car.
                  </li>
                  <li>
                    <strong>First Installment:</strong> The amount of the first payment if the car is being purchased in installments.
                  </li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 3: Enter Ownership Information</Typography>
              <Typography variant="body1" gutterBottom>
                In the second step, provide the following details:
                <ul>
                  <li>
                    <strong>Owner:</strong> The name of the car owner.
                  </li>
                  <li>
                    <strong>Purchase Details:</strong> Information about the purchase transaction.
                  </li>
                  <li>
                    <strong>Entry Date:</strong> The date the car was entered into the system.
                  </li>
                  <li>
                    <strong>Maintenance:</strong> Details about the car maintenance history.
                  </li>
                  <li>
                    <strong>Current Location:</strong> The car current location.
                  </li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 4: Enter Partnership Information</Typography>
              <Typography variant="body1" gutterBottom>
                In the third step, fill in partnership details:
                <ul>
                  <li>
                    <strong>Partner Name:</strong> The name of the partner.
                  </li>
                  <li>
                    <strong>Partner:</strong> The partner role or type.
                  </li>
                  <li>
                    <strong>Partner Type:</strong> The type of partnership (e.g., financial, operational).
                  </li>
                  <li>
                    <strong>Partner Email:</strong> The partner email address.
                  </li>
                  <li>
                    <strong>Partner Phone:</strong> The partner phone number.
                  </li>
                  <li>
                    <strong>Partnership Percentage:</strong> The percentage of ownership or involvement the partner has in the car.
                  </li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 5: Review and Submit</Typography>
              <Typography variant="body1" gutterBottom>
                In the final step, review all the entered data to ensure accuracy. Once verified, submit the form to add the new car to the system.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("findCarDetails")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Get Car Details
            </Typography>
            <IconButton>
              {openSections.findCarDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.findCarDetails}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Step 1: Navigate to the Cars Page</Typography>
              <Typography variant="body1" gutterBottom>
                To view car details, navigate to the Cars page from the sidebar.
              </Typography>

              <Typography variant="h6">Step 2: Locate the Car</Typography>
              <Typography variant="body1" gutterBottom>
                In the Cars table, find the car for which you want to see the details. You can use the search or filter options to make this easier.
              </Typography>

              <Typography variant="h6">Step 3: Click on the Car Row</Typography>
              <Typography variant="body1" gutterBottom>
                Click on the row of the car whose details you want to view. This action will open the details page for the selected car.
              </Typography>

              <Typography variant="h6">Step 4: View Car Details</Typography>
              <Typography variant="body1" gutterBottom>
                The details page will display comprehensive information about the car, including:
                <ul>
                  <li><strong>ID:</strong> The unique identifier of the car.</li>
                  <li><strong>Name:</strong> The name of the car.</li>
                  <li><strong>Color:</strong> The color of the car.</li>
                  <li><strong>Model:</strong> The model of the car.</li>
                  <li><strong>Chassis Number:</strong> The unique identifier for the car chassis.</li>
                  <li><strong>Owner:</strong> The name of the car owner.</li>
                  <li><strong>Purchase Details:</strong> Information about the purchase transaction.</li>
                  <li><strong>Maintenance:</strong> Details about the car maintenance history.</li>
                  <li><strong>Price:</strong> The selling price of the car.</li>
                  <li><strong>Current Location:</strong> The car&apos;s current location.</li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 5: Review Additional Information</Typography>
              <Typography variant="body1" gutterBottom>
                The details page also includes additional sections such as:
                <ul>
                  <li>Maintenance tasks</li>
                  <li>Partners</li>
                  <li>Transactions</li>
                  <li>Installments</li>
                </ul>
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("addCarExpenses")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Add Expenses for a Car
            </Typography>
            <IconButton>
              {openSections.addCarExpenses ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.addCarExpenses}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                To add expenses for a car, first navigate to the Cars page and click on the row of the car you want to manage. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Add Expenses Icon</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Add Expenses icon. This will open the add expenses modal.
              </Typography>

              <Typography variant="h6">Step 3: Enter Expense Details</Typography>
              <Typography variant="body1" gutterBottom>
                In the add expenses modal, fill in the following fields:
                <ul>
                  <li>
                    <strong>Transaction Type:</strong> Select the type of transaction (e.g., fuel, maintenance, etc.).
                  </li>
                  <li>
                    <strong>Date:</strong> Enter the date of the expense in mm/dd/yyyy format.
                  </li>
                  <li>
                    <strong>Amount:</strong> Enter the amount of the expense.
                  </li>
                  <li>
                    <strong>Description:</strong> Provide a brief description of the expense.
                  </li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 4: Review and Submit</Typography>
              <Typography variant="body1" gutterBottom>
                Review all the entered data to ensure accuracy. Once verified, click the Finish button to add the expense to the car&apos;s record.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("addCarInstallments")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Add Installments for a Car
            </Typography>
            <IconButton>
              {openSections.addCarInstallments ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.addCarInstallments}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                To add installments for a car, first navigate to the Cars page and click on the row of the car you want to manage. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Add Installments Icon</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Add Installments icon. This will open the add installments modal.
              </Typography>

              <Typography variant="h6">Step 3: Enter Installment Details</Typography>
              <Typography variant="body1" gutterBottom>
                In the add installments modal, fill in the following fields:
                <ul>
                  <li>
                    <strong>Installment Date:</strong> Select or enter the date of the installment.
                  </li>
                  <li>
                    <strong>Amount:</strong> Enter the amount of the installment.
                  </li>
                  <li>
                    <strong>Description:</strong> Provide a brief description of the installment.
                  </li>
                  <li>
                    <strong>Paid:</strong> Check the box if the installment has been paid. Leave unchecked if it&apos;s pending.
                  </li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 4: Review and Submit</Typography>
              <Typography variant="body1" gutterBottom>
                Review all the entered data to ensure accuracy. Once verified, click the &apos;Finish&apos; button to add the installment to the car&apos;s record.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("editCarDetails")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Edit Car Details
            </Typography>
            <IconButton>
              {openSections.editCarDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.editCarDetails}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                To edit car details, first navigate to the Cars page and click on the row of the car you want to edit. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Edit Icon</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Edit icon. This will open the edit car modal.
              </Typography>

              <Typography variant="h6">Step 3: Update Car Details</Typography>
              <Typography variant="body1" gutterBottom>
                In the edit car modal, update the fields with the new information. All the fields available for adding a new car will be present here for editing.
              </Typography>

              <Typography variant="h6">Step 4: Review and Save Changes</Typography>
              <Typography variant="body1" gutterBottom>
                Review all the updated data to ensure accuracy. Once verified, click the Save Changes button to apply the edits to the car&apos;s record.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("printCarDetails")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Print Car Details
            </Typography>
            <IconButton>
              {openSections.printCarDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.printCarDetails}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                To print car details, follow these steps:
              </Typography>

              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                Navigate to the Cars page and click on the row of the car whose details you want to print. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Print Icon</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Print icon. This will open the print dialog box.
              </Typography>

              <Typography variant="h6">Step 3: Adjust Print Settings (Optional)</Typography>
              <Typography variant="body1" gutterBottom>
                If needed, adjust the print settings such as paper size, orientation, and color options.
              </Typography>

              <Typography variant="h6">Step 4: Print Car Details</Typography>
              <Typography variant="body1" gutterBottom>
                Once the print settings are configured, click the Print button in the print dialog box to print the car details.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("deleteCar")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Delete a Car
            </Typography>
            <IconButton>
              {openSections.deleteCar ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.deleteCar}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                To delete a car, follow these steps:
              </Typography>

              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                Navigate to the Cars page and click on the row of the car you want to delete. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Delete Icon</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Delete icon. This will prompt a confirmation dialog box.
              </Typography>

              <Typography variant="h6">Step 3: Confirm Deletion</Typography>
              <Typography variant="body1" gutterBottom>
                In the confirmation dialog box, confirm that you want to delete the car. This action cannot be undone.
              </Typography>

              <Typography variant="body1">
                Note: Deleting a car will permanently remove it from the system, along with all associated data such as maintenance tasks, partners, transactions, and installments.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("addMaintenanceTask")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Add Maintenance Task
            </Typography>
            <IconButton>
              {openSections.addMaintenanceTask ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.addMaintenanceTask}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                To add a maintenance task for the car, follow these steps:
              </Typography>

              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                Navigate to the Cars page and click on the row of the car you want to add a maintenance task for. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Add Maintenance Task Button</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Add Maintenance Task button. This will open a modal window for adding a maintenance task.
              </Typography>

              <Typography variant="h6">Step 3: Enter Maintenance Task Details</Typography>
              <Typography variant="body1" gutterBottom>
                In the modal window, fill in the following details:
                <ul>
                  <li><strong>Task Description:</strong> Description of the maintenance task.</li>
                  <li><strong>Task Date:</strong> Date when the maintenance task was performed.</li>
                  <li><strong>Task Cost:</strong> Cost associated with the maintenance task.</li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 4: Submit the Maintenance Task</Typography>
              <Typography variant="body1" gutterBottom>
                Review the entered data and click on the Submit or Save button to add the maintenance task for the car.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("sellCar")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              How to Sell the Car
            </Typography>
            <IconButton>
              {openSections.sellCar ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.sellCar}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                To sell a car, follow these steps:
              </Typography>

              <Typography variant="h6">Step 1: Open the Car Details Page</Typography>
              <Typography variant="body1" gutterBottom>
                Navigate to the Cars page and click on the row of the car you want to sell. This will open the details page for that car.
              </Typography>

              <Typography variant="h6">Step 2: Click on the Sell Car Button</Typography>
              <Typography variant="body1" gutterBottom>
                On the car details page, locate and click on the Sell Car button. This will open a confirmation modal for selling the car.
              </Typography>

              <Typography variant="h6">Step 3: Enter Sale Details</Typography>
              <Typography variant="body1" gutterBottom>
                In the confirmation modal, you will see the details of the car being sold. Fill in the following details:
                <ul>
                  <li><strong>Purchaser:</strong> Name of the purchaser.</li>
                  <li><strong>Selling Price:</strong> The selling price of the car.</li>
                  <li><strong>Maintenance Costs:</strong> Costs associated with maintenance.</li>
                  <li><strong>Capital:</strong> Initial investment in the car.</li>
                  <li><strong>Net Profit:</strong> Calculated net profit from the sale.</li>
                  <li><strong>Source of Selling:</strong> Where the sale originated (e.g., showroom, online).</li>
                </ul>
              </Typography>

              <Typography variant="h6">Step 4: Confirm the Sale</Typography>
              <Typography variant="body1" gutterBottom>
                Review the entered data and click on the Confirm or Finish button to proceed with the sale.
              </Typography>

              <Typography variant="h6">Step 5: Redirect to Sold Cars Page</Typography>
              <Typography variant="body1" gutterBottom>
                After confirming the sale, the car will be automatically redirected to the Sold Cars page. You can find it in the sidebar.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>






      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("userGuide")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              User Guide
            </Typography>
            <IconButton>
              {openSections.userGuide ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.userGuide}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">
                Detailed documentation on how to use the system, including screenshots and examples.
                <br />
                <Link href="/path/to/user-guide" target="_blank" underline="none">
                  Read more
                </Link>
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>

      <DashboardCard>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleToggle("faq")}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions (FAQ)
            </Typography>
            <IconButton>
              {openSections.faq ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
          <Collapse in={openSections.faq}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">
                Find answers to the most commonly asked questions about the system.
                <br />
                <Link href="/path/to/faq" target="_blank" underline="none">
                  Read more
                </Link>
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default DocumentationPage;
