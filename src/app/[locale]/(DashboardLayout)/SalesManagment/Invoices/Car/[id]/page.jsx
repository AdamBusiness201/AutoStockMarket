'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "@mui/material";

const CarInvoicesPage = ({params}) => {
  const [invoices, setInvoices] = useState([]);
  const router = useRouter();
  const { id } = params; // Extract carId from router query params

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Fetch invoices for the specific car
        const response = await fetch(`/api/invoices/car/${id}?carId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices);
        } else {
          console.error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    if (id) {
      fetchInvoices();
    }
  }, [id]);

  const handleRowClick = (invoiceId) => {
    router.push(`/en/SalesManagment/Invoices/${invoiceId}`);
  };

  return (
    <PageContainer title="Car Invoices" description="List of invoices for the selected car">
      <DashboardCard title={`Invoice List`}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="invoice table">
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow 
                  key={invoice._id} 
                  hover={true} 
                  onClick={() => handleRowClick(invoice._id)} 
                  style={{ cursor: 'pointer' }} 
                >
                  <TableCell>{invoice?.transaction?._id}</TableCell>
                  <TableCell>{invoice?.customer?.name}</TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleString()}</TableCell>
                  <TableCell>{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default CarInvoicesPage;
