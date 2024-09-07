'use client'
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import CreateCarModal from "@/app/(DashboardLayout)/components/shared/CreateCarModal";
import carModelsData from '../../../../../../messages/car_names_and_models.json'; // Adjust the path based on your project structure

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  IconButton,
  TablePagination,
  Grid
} from "@mui/material";

import { IconFileInvoice } from "@tabler/icons-react";
import { Add } from "@mui/icons-material";
import Loading from "../../loading";
import { useTranslations } from 'next-intl'; // Import useTranslations hook

const CarsPage = ({ params: { locale } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('default.cars'); // Initialize useTranslations hook with namespace 'cars'

  const createCar = searchParams.get('CreateCar');
  const [cars, setCars] = useState([]);
  const [modalOpen, setModalOpen] = useState(createCar || false);
  const [filters, setFilters] = useState({
    name: "",
    color: "",
    model: "",
  });
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/car", {
        params: {
          ...filters,
          page: currentPage + 1,
          perPage: rowsPerPage,
        },
      });
      const filteredCars = response.data.cars.filter(
        (car) => car.currentLocation !== "Sold"
      );
      setTotalCars(response.data.totalCount);
      setCars(filteredCars);
      setError("");
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError("Failed to fetch cars. Please try again later.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters, currentPage, rowsPerPage]);

  const handleRowClick = (id) => {
    // Construct the new URL by appending the id to the base path while maintaining the locale
    router.push(`/${locale}/CarsInventory/Cars/${id}`);
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const getDurationMarker = (entryDate) => {
    const currentDate = new Date();
    const carEntryDate = new Date(entryDate);
    const durationInMonths = (currentDate.getFullYear() - carEntryDate.getFullYear()) * 12 + currentDate.getMonth() - carEntryDate.getMonth();

    if (durationInMonths < 3) {
      return "🟢"; // Less than 3 months (green)
    } else if (durationInMonths < 6) {
      return "🟠"; // 3 to 6 months (orange)
    } else {
      return "🔴"; // Greater than 6 months (red)
    }
  };

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <DashboardCard title={t('title')}>
        <>
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Box p={3}>
              <IconButton
                onClick={() => setModalOpen(true)}
                aria-label={t('addNewCar')}
                color="primary"
              >
                <Add />
              </IconButton>
            </Box>


            <Box flexGrow={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="name"
                    label={t('name')}
                    variant="outlined"
                    size="small"
                    value={filters.name}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="color"
                    label={t('color')}
                    variant="outlined"
                    size="small"
                    value={filters.color}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="model"
                    label={t('model')}
                    variant="outlined"
                    size="small"
                    value={filters.model}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="chassisNumber"
                    label={t('chassisNumber')}
                    variant="outlined"
                    size="small"
                    value={filters.chassisNumber}
                    onChange={handleFilterChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="entryDate"
                    label={t('entryDate')}
                    variant="outlined"
                    size="small"
                    type="date"
                    value={filters.entryDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="partner"
                    label={t('partner')}
                    variant="outlined"
                    size="small"
                    value={filters.partner}
                    onChange={handleFilterChange}
                    placeholder=" اكتب اسم الشريك "
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

          </Box>
          {loading ? (<Loading />) :
            (<TableContainer
              component={Paper}
              sx={{ maxWidth: "100%", overflowX: "auto" }}
            >
              <Table aria-label="cars table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('brand')}</TableCell>
                    <TableCell>{t('modelName')}</TableCell>
                    <TableCell>{t('color')}</TableCell>
                    <TableCell>{t('modelYear')}</TableCell>
                    <TableCell>{t('chassisNumber')}</TableCell>
                    <TableCell>{t('owner')}</TableCell>
                    <TableCell>{t('purchaseDetails')}</TableCell>
                    <TableCell>{t('entryDate')}</TableCell>
                    <TableCell>{t('maintenance')}</TableCell>
                    <TableCell>{t('currentLocation')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow
                      key={car._id}
                      style={{ cursor: "pointer" }}
                      hover={true}
                    >
                      <TableCell
                        onClick={() => handleRowClick(car._id)}>{car?.brand}</TableCell>
                      <TableCell
                        onClick={() => handleRowClick(car._id)}>{car.name}</TableCell>
                      <TableCell>{car.color}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.chassisNumber}</TableCell>
                      <TableCell>{car?.owner?.name}</TableCell>
                      <TableCell>{car.purchaseDetails}</TableCell>
                      <TableCell>
                        {new Date(car.entryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{car.maintenance}</TableCell>
                      <TableCell>{car.currentLocation}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {getDurationMarker(car.entryDate)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          onClick={() => router.push(`/en/SalesManagment/Invoices/Car/${car._id}`)}
                          aria-label={t('seeInvoices')}
                          color="primary"
                        >
                          <IconFileInvoice />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)
          }
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCars}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('rowsPerPage')}
            labelDisplayedRows={({ from, to, count }) => `${t('page')} ${from}-${to} ${t('of')} ${count}`}
            style={{ marginTop: 10 }}
          />
        </>
      </DashboardCard>
      <CreateCarModal
        open={modalOpen}
        handleClose={() => { confirm("Are you sure you want to close?"); setModalOpen(false) }}
        fetchCars={fetchCars}
      />
    </PageContainer>
  );
};

export default CarsPage;
