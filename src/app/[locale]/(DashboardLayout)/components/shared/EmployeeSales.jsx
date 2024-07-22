import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Box,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import Loading from "../../loading";
import * as XLSX from "xlsx";

const SalesRecords = ({ employeeId }) => {
  const [soldCars, setSoldCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee's sold cars
  useEffect(() => {
    const fetchSoldCars = async () => {
      try {
        const response = await axios.get(
          `/api/employee/${employeeId}/sales_cars`
        );
        setSoldCars(response.data.soldCars);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee's sold cars:", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchSoldCars();
  }, [employeeId]);

  // Function to export data to XLSX
  const exportToXLSX = () => {
    const headers = [
      {
        car: "Car",
        previousOwner: "Previous Owner",
        purchaser: "Purchaser",
        purchaseDate: "Purchase Date",
        purchasePrice: "Purchase Price",
        sourceOfSelling: "Source of Selling"
      }
    ];

    const data = Array.isArray(soldCars) && soldCars.length > 0 ? soldCars : headers;

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["car", "previousOwner", "purchaser", "purchaseDate", "purchasePrice", "sourceOfSelling"]
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sold Cars Records");
    XLSX.writeFile(workbook, "EmployeeSoldCarsRecords.xlsx");
  };

  return (
    <Box marginTop={5}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" marginBottom={5}>
            <Typography variant="h6" gutterBottom>
              Employee Sold Cars
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToXLSX}>
              Export to XLSX
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="employee sold cars table">
              <TableHead>
                <TableRow>
                  <TableCell>Car</TableCell>
                  <TableCell>Previous Owner</TableCell>
                  <TableCell>Purchaser</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>Purchase Price</TableCell>
                  <TableCell>Source of Selling</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(soldCars) && soldCars.length > 0 ? (
                  soldCars.map((soldCar) => (
                    <TableRow key={soldCar._id}>
                      <TableCell>{soldCar.car}</TableCell>
                      <TableCell>{soldCar.previousOwner}</TableCell>
                      <TableCell>{soldCar.purchaser}</TableCell>
                      <TableCell>{soldCar.purchaseDate}</TableCell>
                      <TableCell>{soldCar.purchasePrice}</TableCell>
                      <TableCell>{soldCar.sourceOfSelling}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default SalesRecords;
