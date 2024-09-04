import React, { useState } from "react";
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
  TablePagination,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useTranslations } from 'next-intl'; // Import useTranslations hook

const PartnerList = ({ partners, car }) => {
  const t = useTranslations('default'); // Initialize translation function
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPartners = partners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpen(!open)}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="h6" gutterBottom>
          {t('partnerList.title')}
        </Typography>
        <IconButton>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('partnerList.name')}</TableCell>
                <TableCell>{t('partnerList.type')}</TableCell>
                <TableCell>{t('partnerList.email')}</TableCell>
                <TableCell>{t('partnerList.phone')}</TableCell>
                <TableCell>{t('partnerList.address')}</TableCell>
                <TableCell>{t('partnerList.percentage')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPartners.map((partner) => (
                <TableRow key={partner._id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.type}</TableCell>
                  <TableCell>{partner.contactInfo.email}</TableCell>
                  <TableCell>{partner.contactInfo.phone}</TableCell>
                  <TableCell>
                    {partner.contactInfo.address.street}, {partner.contactInfo.address.city}, {partner.contactInfo.address.state}, {partner.contactInfo.address.country}, {partner.contactInfo.address.zipCode}
                  </TableCell>
                  <TableCell>
                    {partner.partnershipPercentage}% (
                    {(partner.partnershipPercentage / 100) * car.value})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={partners.length}
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

export default PartnerList;
