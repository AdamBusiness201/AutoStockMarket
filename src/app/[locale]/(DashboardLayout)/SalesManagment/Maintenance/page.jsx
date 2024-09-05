"use client";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl'; // Import useTranslations hook
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
  Box,
  Grid
} from "@mui/material";
import Loading from "../../loading"; // Import the loading component
import AnalysisCard from "../../components/shared/DashboardAnalysisCard";

const MaintenancePage = () => {
  const t = useTranslations('default.maintenance'); // Initialize translations

  const [maintenanceDetails, setMaintenanceDetails] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      setLoading(true); // Set loading state to true when fetching starts
      try {
        const response = await fetch("/api/maintenance_tasks"); // Adjust API endpoint to match your backend
        if (response.ok) {
          const data = await response.json();
          setMaintenanceDetails(data.maintenanceDetails);
          setError("");
        } else {
          console.error("Failed to fetch maintenance data");
          setError(t('errorFetchingData'));
        }
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        setError(t('errorFetchingData'));
      } finally {
        setLoading(false); // Set loading state to false when fetching ends
      }
    };

    fetchMaintenanceDetails();
  }, [t]);

  return (
    <PageContainer title={t('maintenance')} description={t('totalMaintenanceCost') + ' and ' + t('numberOfTasks')}>
      <DashboardCard title={t('maintenance')}>
        {loading ? (
          <Loading />
        ) : error ? (
          <div>{error}</div>
        ) : maintenanceDetails ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title={t('totalMaintenanceCost')}
                  number={maintenanceDetails.totalMaintenanceCost}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title={t('numberOfTasks')}
                  number={maintenanceDetails.totalTasks}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="maintenance details table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('carID')}</TableCell>
                    <TableCell>{t('taskDescription')}</TableCell>
                    <TableCell>{t('taskDate')}</TableCell>
                    <TableCell>{t('taskCost')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceDetails.tasksDetails.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task?.car?._id}</TableCell>
                      <TableCell>{task.taskDescription}</TableCell>
                      <TableCell>{new Date(task.taskDate).toLocaleString()}</TableCell>
                      <TableCell>{new Intl.NumberFormat().format(task.taskCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : null}
      </DashboardCard>
    </PageContainer>
  );
};

export default MaintenancePage;
