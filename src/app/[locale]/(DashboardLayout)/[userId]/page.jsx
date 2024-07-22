"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

// Define the component
const UserDataPage = ({ params }) => {
  // State to store user data
  const [userData, setUserData] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        // Send a GET request to the API endpoint to fetch user data
        const response = await axios.get(`/api/admin/${params.userId}`);
        console.log(response);
        // Set user data in the state
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [params.userId]);

  return (
    <PageContainer title="User Data" description="View user data">
      <DashboardCard title={userData?.username}>
        {/* Render user data in a table */}
        {userData ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>{userData?.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{userData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>{userData?.role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Benefits</TableCell>
                  <TableCell>{userData?.employee?.benefits}</TableCell>
                </TableRow>
                {/* Add more rows for additional fields as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">Loading user data...</Typography>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default UserDataPage;
