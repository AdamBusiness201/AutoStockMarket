'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  TextField,
  Box,
  Pagination,
} from "@mui/material";

const SoldCarsPage = () => {
  const router = useRouter();
  const [soldCars, setSoldCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(""); // Define error state

  // Define fetchSoldCars function
  const fetchSoldCars = async () => {
    try {
      console.log("fetching sold cars");
      const response = await axios.get(`/api/sold-cars`, {
        params: {
          searchQuery,
          page: currentPage,
          perPage,
        },
      });
      setSoldCars(response.data.soldCars);
      setTotalPages(Math.ceil(response.data.totalCount / perPage));
      setError(""); // Clear error on successful fetch
    } catch (error) {
      console.error("Error fetching sold cars:", error);
      setError("Failed to fetch sold cars. Please try again later.");
      setSoldCars([]); // Set soldCars array to empty in case of error
    }
  };

  useEffect(() => {
    fetchSoldCars();
  }, [searchQuery, currentPage]);

  const handleRowClick = (id) => {
    router.push(`/en/CarsInventory/Cars/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePaginationChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageContainer title="Sold Cars" description="Sold Cars Management">
      <DashboardCard title="Sold Cars">
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Box flexGrow={1}>
            <TextField
              name="search"
              label="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>
        </Box>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <TableContainer component={Paper} sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table aria-label="sold cars table">
            <TableHead>
              <TableRow>
                <TableCell>Car Name</TableCell>
                <TableCell>Purchaser Name</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Purchase Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {soldCars?.map((soldCar) => (
                <TableRow
                  key={soldCar._id}
                  onClick={() => handleRowClick(soldCar.car._id)}
                  style={{ cursor: "pointer" }}
                  hover={true}
                >
                  <TableCell>{soldCar?.car?.name}</TableCell>
                  <TableCell>{soldCar?.purchaser?.name}</TableCell>
                  <TableCell>{new Date(soldCar.purchaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>${soldCar.purchasePrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePaginationChange}
          style={{ marginTop: 10 }}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default SoldCarsPage;
