"use client";
import { useEffect, useState } from "react";
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
          setError("Failed to fetch maintenance data. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        setError("Failed to fetch maintenance data. Please try again later.");
      } finally {
        setLoading(false); // Set loading state to false when fetching ends
      }
    };

    fetchMaintenanceDetails();
  }, []);

  return (
    <PageContainer title="Maintenance" description="Total Maintenance Costs and Task Details">
      <DashboardCard title="Maintenance">
        {loading ? (
          <Loading />
        ) : error ? (
          <div>{error}</div>
        ) : maintenanceDetails ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title="Total Maintenance Cost"
                  number={maintenanceDetails.totalMaintenanceCost}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AnalysisCard
                  title="Number of Tasks"
                  number={maintenanceDetails.totalTasks}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="maintenance details table">
                <TableHead>
                  <TableRow>
                    <TableCell>Car ID</TableCell>
                    <TableCell>Task Description</TableCell>
                    <TableCell>Task Date</TableCell>
                    <TableCell>Task Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceDetails.tasksDetails.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task?.car?._id}</TableCell>
                      <TableCell>{task.taskDescription}</TableCell>
                      <TableCell>{new Date(task.taskDate).toLocaleString()}</TableCell>
                      <TableCell>{task.taskCost}</TableCell>
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
