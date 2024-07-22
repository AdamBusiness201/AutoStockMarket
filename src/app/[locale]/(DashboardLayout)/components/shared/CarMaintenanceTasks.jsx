import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Button,
  TablePagination,
  Grid
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import AnalysisCard from './DashboardAnalysisCard'

const MaintenanceTasksList = ({ maintenanceTasks }) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [highestCostTask, setHighestCostTask] = useState(null);
  const [lowestCostTask, setLowestCostTask] = useState(null);

  useEffect(() => {
    const calculateTotals = () => {
      let tasks = 0;
      let costs = 0;
      let highestCost = -1;
      let lowestCost = Infinity;
      let highestCostTask = null;
      let lowestCostTask = null;

      maintenanceTasks.forEach((task) => {
        tasks++;
        costs += task.taskCost;
        if (task.taskCost > highestCost) {
          highestCost = task.taskCost;
          highestCostTask = task;
        }
        if (task.taskCost < lowestCost) {
          lowestCost = task.taskCost;
          lowestCostTask = task;
        }
      });

      setTotalTasks(tasks);
      setTotalCosts(costs);
      setHighestCostTask(highestCostTask);
      setLowestCostTask(lowestCostTask);
    };

    calculateTotals();
  }, [maintenanceTasks]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const paginatedTasks = maintenanceTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleToggle}
        cursor="pointer"
      >
        <Typography variant="h6" gutterBottom>
          Maintenance Tasks
        </Typography>
        <IconButton>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalysisCard
              title="Total Tasks"
              number={totalTasks}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalysisCard
              title="Total Costs"
              number={totalCosts}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalysisCard
              title="Highest Cost Task"
              number={highestCostTask ? highestCostTask.taskCost : 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalysisCard
              title="Lowest Cost Task"
              number={lowestCostTask ? lowestCostTask.taskCost : 0}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.taskDescription}</TableCell>
                  <TableCell>
                    {new Date(task.taskDate).toLocaleString()}
                  </TableCell>
                  <TableCell>${task.taskCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={maintenanceTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default MaintenanceTasksList;
