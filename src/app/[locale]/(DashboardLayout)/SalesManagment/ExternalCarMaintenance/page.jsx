'use client'
import React, { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateMaintenanceTaskModal from "@/app/(DashboardLayout)/components/shared/CreateExternalCarMaintenanceTasks";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import Loading from "../../loading"; // Import the loading component

const CarMaintenanceExhibitionPage = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState({
    externalCarDetails: {
      name: "",
      color: "",
      model: "",
      chassisNumber: "",
      Owner: "",
    },
    taskDescription: "",
    taskCost: 0,
    taskDate: new Date().toISOString(),
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };


  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const response = await fetch("/api/maintenance_tasks/external");
      if (response.ok) {
        const data = await response.json();
        setMaintenanceData(data.maintenanceDetails.tasksDetails);
        setLoading(false);
      } else {
        console.error("Failed to fetch car maintenance data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching car maintenance data:", error);
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Car Maintenance Exhibition"
      description="Maintenance expenses for exhibition cars"
    >
      <DashboardCard title="External Cars Maintenance">
        {loading ? (
          <Loading />
        ) : (
          <>
          {/* Add Task button to open modal */}
          <Button variant="contained" onClick={handleOpenModal}>
              Add Task
            </Button>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="car maintenance table">
                <TableHead>
                  <TableRow>
                    <TableCell>Car Name</TableCell>
                    <TableCell>Maintenance Value</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Chassis Number</TableCell>
                    <TableCell>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceData.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task?.externalCarDetails?.name}</TableCell>
                      <TableCell>{task?.taskCost}</TableCell>
                      <TableCell>{task?.taskDescription}</TableCell>
                      <TableCell>{task?.taskDate}</TableCell>
                      <TableCell>{task?.externalCarDetails?.color}</TableCell>
                      <TableCell>{task?.externalCarDetails?.model}</TableCell>
                      <TableCell>{task?.externalCarDetails?.chassisNumber}</TableCell>
                      <TableCell>{task?.externalCarDetails?.Owner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Modal for adding new maintenance task */}
            <CreateMaintenanceTaskModal
            open={openModal}
            handleClose={() => {confirm("Are you sure you want to close?");setOpenModal(false)}}
            fetchMaintenanceTasks={fetchMaintenanceData}
            initialTaskData={newTask}
            isEditing={false}
          />
          </>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default CarMaintenanceExhibitionPage;
