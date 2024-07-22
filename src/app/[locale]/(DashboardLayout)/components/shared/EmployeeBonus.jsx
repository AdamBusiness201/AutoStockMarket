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

const BonusRecords = ({ employeeId, deductions = false }) => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee bonus records
  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.get(
          `/api/employee/${employeeId}/${deductions ? "deduction" : "bonus"}`
        );
        setBonuses(
          deductions ? response.data.deductions : response.data.bonuses
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee bonuses:", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchBonuses();
  }, [employeeId, deductions]);

  // Function to export data to XLSX
  const exportToXLSX = () => {
    const headers = [
      { dateReceived: "Date Received", amount: "Amount", reason: "Reason" },
    ];

    const data = bonuses.length > 0 ? bonuses : headers;

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["dateReceived", "amount", "reason"],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bonus Records");
    XLSX.writeFile(workbook, "EmployeeBonusRecords.xlsx");
  };

  return (
    <Box marginTop={5}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" marginBottom={5}>
            <Typography variant="h6" gutterBottom>
              Employee {deductions ? "Deduction" : "Bonus"} Records
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToXLSX}>
              Export to XLSX
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="employee bonus table">
              <TableHead>
                <TableRow>
                  <TableCell>Date Received</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bonuses.length > 0 ? (
                  bonuses.map((bonus) => (
                    <TableRow key={bonus._id}>
                      <TableCell>{bonus.dateReceived}</TableCell>
                      <TableCell>{bonus.amount}</TableCell>
                      <TableCell>{bonus.reason}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
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

export default BonusRecords;
