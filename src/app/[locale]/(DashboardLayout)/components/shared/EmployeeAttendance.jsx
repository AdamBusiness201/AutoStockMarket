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
import { useTranslations } from 'next-intl'; // Assuming next-intl is used for translation

const EmployeeAttendance = ({ employeeId }) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('default.employee.attendance'); // Assuming 'EmployeeAttendance' is the namespace

  // Fetch employee attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `/api/employee/${employeeId}/attendance`
        );
        setAttendances(response.data.attendances);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchAttendance();
  }, [employeeId]);

  // Function to export data to XLSX
  const exportToXLSX = () => {
    const headers = [
      { date: t('date'), attendanceStatus: t('attendanceStatus'), shift: t('shift'), location: t('location'), notes: t('notes') },
    ];

    const data = attendances.length > 0 ? attendances : headers;

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["date", "attendanceStatus", "shift", "location", "notes"],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t('employeeAttendance'));
    XLSX.writeFile(workbook, "EmployeeAttendance.xlsx");
  };

  return (
    <Box marginTop={5}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" marginBottom={5}>
            <Typography variant="h6" gutterBottom>
              {t('employeeAttendance')}
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToXLSX}>
              {t('exportToXLSX')}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="employee attendance table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('date')}</TableCell>
                  <TableCell>{t('attendanceStatus')}</TableCell>
                  <TableCell>{t('shift')}</TableCell>
                  <TableCell>{t('location')}</TableCell>
                  <TableCell>{t('notes')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.length > 0 ? (
                  attendances.map((attendance) => (
                    <TableRow key={attendance._id}>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>{attendance.attendanceStatus}</TableCell>
                      <TableCell>{attendance.shift}</TableCell>
                      <TableCell>{attendance.location}</TableCell>
                      <TableCell>{attendance.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t('noRecords')}
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

export default EmployeeAttendance;
