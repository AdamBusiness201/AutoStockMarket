'use client';
import React, { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem
} from "@mui/material";
import axios from "axios";
import Loading from "@/app/loading";
import * as XLSX from "xlsx";
import { useTranslations } from 'next-intl'; // Import useTranslations hook

const AttendancePage = () => {
  const t = useTranslations('default.employeeAttendance'); // Initialize translations
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceAnalyticsData, setAttendanceAnalyticsData] = useState([]);
  const [attendanceSummaryData, setAttendanceSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/attendance");
      if (response.status === 200) {
        setAttendanceData(response.data.attendanceRecords);
        setAttendanceAnalyticsData(response.data.analytics);
        setAttendanceSummaryData(response.data.attendanceSummary);
      } else {
        console.error("Failed to fetch attendance data");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert(t('errorFetchingData')); // Use translation for error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAttendance = async (record) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put("/api/attendance", record);
      if (response.status === 200) {
        fetchAttendanceData();
        console.log("Attendance submitted:", response.data);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleUpdateAttendance = (index, key, value) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index][key] = value;
    setAttendanceData(updatedAttendanceData);
  };

  const handleAssignCurrentTime = (index, key) => {
    const updatedAttendanceData = [...attendanceData];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    updatedAttendanceData[index][key] = currentTime;
    setAttendanceData(updatedAttendanceData);
  };

  const exportToXLSX = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <PageContainer title={t('attendanceAndAbsence')} description={t('overview')}>
      <DashboardCard title={t('attendanceToday')}>
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToXLSX(attendanceData, "AttendanceToday.xlsx")}
            sx={{ marginBottom: 2 }}
          >
            {t('exportToXlsx')}
          </Button>
          <TableContainer component={Paper}>
            {isLoading ? (
              <Loading />
            ) : (
              <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('employeeName')}</TableCell>
                    <TableCell>{t('attendanceStatus')}</TableCell>
                    <TableCell>{t('shift')}</TableCell>
                    <TableCell>{t('timeIn')}</TableCell>
                    <TableCell>{t('timeOut')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData?.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.employee.name}</TableCell>
                      <TableCell>
                        <Select
                          value={record.attendanceStatus}
                          onChange={(e) => handleUpdateAttendance(index, 'attendanceStatus', e.target.value)}
                        >
                          <MenuItem value="Present">Present</MenuItem>
                          <MenuItem value="Absent">Absent</MenuItem>
                          <MenuItem value="Late">Late</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={record.shift}
                          onChange={(e) => handleUpdateAttendance(index, 'shift', e.target.value)}
                        >
                          <MenuItem value="Morning">Morning</MenuItem>
                          <MenuItem value="Afternoon">Afternoon</MenuItem>
                          <MenuItem value="Night">Night</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => handleAssignCurrentTime(index, 'timeIn')}
                        >
                          {t('timeIn')}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => handleAssignCurrentTime(index, 'timeOut')}
                        >
                          {t('timeOut')}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => handleSubmitAttendance(record)}
                        >
                          {t('assign')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </>
      </DashboardCard>

      <DashboardCard title={t('attendanceSummary')}>
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToXLSX(attendanceAnalyticsData, "AttendanceSummary.xlsx")}
            sx={{ marginBottom: 2 }}
          >
            {t('exportToXlsx')}
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="attendance summary table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('employeeName')}</TableCell>
                  <TableCell>{t('salary')}</TableCell>
                  <TableCell>{t('valuePerDay')}</TableCell>
                  <TableCell>{t('numberOfWorkingDays')}</TableCell>
                  <TableCell>{t('numberOfAbsentDays')}</TableCell>
                  <TableCell>{t('valueOfAbsences')}</TableCell>
                  <TableCell>{t('violations')}</TableCell>
                  <TableCell>{t('advances')}</TableCell>
                  <TableCell>{t('netSalary')}</TableCell>
                  <TableCell>{t('commission')}</TableCell>
                  <TableCell>{t('total')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceAnalyticsData?.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.salary}</TableCell>
                    <TableCell>{record.valuePerDay.toFixed(2)}</TableCell>
                    <TableCell>{record.workingDays}</TableCell>
                    <TableCell>{record.absentDays}</TableCell>
                    <TableCell>{record.valueOfAbsences.toFixed(2)}</TableCell>
                    <TableCell>{record.violations}</TableCell>
                    <TableCell>{record.advances}</TableCell>
                    <TableCell>{record.netSalary.toFixed(2)}</TableCell>
                    <TableCell>{record.commission}</TableCell>
                    <TableCell>{record.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </DashboardCard>

      <DashboardCard title={t('attendanceDetails')}>
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToXLSX(attendanceSummaryData, "AttendanceDetails.xlsx")}
            sx={{ marginBottom: 2 }}
          >
            {t('exportToXlsx')}
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="attendance details table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('employeeName')}</TableCell>
                  <TableCell>{t('absencePeriod')}</TableCell>
                  <TableCell>{t('totalAbsences')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceSummaryData?.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.absencePeriod}</TableCell>
                    <TableCell>{record.totalAbsences}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </DashboardCard>
    </PageContainer>
  );
};

export default AttendancePage;
