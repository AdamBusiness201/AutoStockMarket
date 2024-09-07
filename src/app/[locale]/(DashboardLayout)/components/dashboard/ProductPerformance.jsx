import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import axios from 'axios';

const TopEmployees = ({ title }) => {
  const [salesMemberStats, setSalesMemberStats] = useState([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchSalesMemberStats = async () => {
      try {
        const response = await axios.get('/api/analytics/sold-cars'); // Replace with your API endpoint
        console.log(response.data.salesMemberStats)
        setSalesMemberStats(response.data.salesMemberStats);
      } catch (error) {
        console.error('Error fetching sales member stats:', error);
      }
    };

    fetchSalesMemberStats();
  }, []);

  return (
    <DashboardCard title={title}>
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
            mt: 2
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Employee
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Position
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Cars Sold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Sales
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesMemberStats.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>
                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>
                    {employee._id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {employee.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {employee.position}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: '4px',
                      backgroundColor: 'primary.main', // Customize chip color if needed
                      color: '#fff'
                    }}
                    size="small"
                    label={employee.totalCars}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">${employee.totalSales.toLocaleString()}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default TopEmployees;
