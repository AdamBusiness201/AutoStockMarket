"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Box,
  TableContainer,
  Button,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { usePDF, Resolution } from "react-to-pdf";
import Image from "next/image";
import Loading from "../../../loading";

const InvoicePage = ({ params }) => {
  const [invoice, setInvoice] = useState(null);
  const [editableTransactionAmount, setEditableTransactionAmount] = useState("");
  const [editableTotalAmount, setEditableTotalAmount] = useState("");

  const router = useRouter();
  const { id } = params;
  const { toPDF, targetRef } = usePDF({
    filename: `Invoice_${id}.pdf`,
    resolution: Resolution.HIGH,
    page: {
      margin: 10,
      format: "letter",
      orientation: "portrait",
    },
  });

  const fetchInvoice = async () => {
    if (id) {
      try {
        const response = await fetch(`/api/invoices/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch invoice");
        }
        const data = await response.json();
        setInvoice(data.invoice);
        console.log(data.invoice);
        setEditableTransactionAmount(data.invoice.transaction.amount.toFixed(2));
        setEditableTotalAmount(data.invoice.totalAmount.toFixed(2));
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setInvoice(null);
      }
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  return (
    <PageContainer
      title="Invoice Details"
      description="Details of the selected invoice"
    >
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => toPDF()}>
          Download Invoice
        </Button>
      </Box>
      <DashboardCard>
        <TextField
          value={editableTransactionAmount}
          onChange={(e) => setEditableTransactionAmount(e.target.value)}
          type="number"
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          variant="outlined"
          sx={{
            maxWidth: '200px',
            marginRight: 2,
          }}
        />

        <Box ref={targetRef}>
          {invoice ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <div>
                  <Typography variant="h5" gutterBottom sx={{ direction: "rtl", textAlign: "center" }}>
                    فاتورة #{invoice._id}
                  </Typography>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
                    Invoice #{invoice._id}
                  </Typography>
                  <Typography variant="body1" sx={{ direction: "rtl", textAlign: "center", fontWeight: "bold" }}>
                    معلومات مفصلة حول المعاملة | Detailed information about the transaction.
                  </Typography>
                </div>
                <Image
                  src="/images/logos/asm_logo.png"
                  alt="Company Logo"
                  width={300}
                  height={150}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <TableContainer component={Paper} sx={{ px: 5 }}>
                  <Table aria-label="invoice details table">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ textAlign: "start" }}>
                          <strong>Tel:</strong>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{" "}</TableCell>
                        <TableCell sx={{ direction: "rtl", textAlign: "start" }}>
                          <strong>الهاتف:</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Email:</strong>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ direction: "rtl", textAlign: "start" }}>
                          <strong>البريد الإلكتروني:</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>P.O Box:</strong>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ direction: "rtl", textAlign: "start" }}>
                          <strong>صندوق البريد:</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Mobile:</strong>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ direction: "rtl", textAlign: "start" }}>
                          <strong>الهاتف المحمول:</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <TableContainer component={Paper} sx={{ p: 5 }}>
                <Table aria-label="invoice details table">
                  <TableBody>
                    {[
                      { label1: 'Transaction Type', value1: invoice?.transaction?.type, arabicLabel1: 'نوع المعاملة', label2: 'Customer Name', value2: invoice?.customer.name, arabicLabel2: 'اسم العميل' },
                      { label1: 'Transaction Amount', value1: editableTransactionAmount, arabicLabel1: 'مبلغ وقدره', label2: 'Transaction Date', value2: new Date(invoice?.transaction.date).toLocaleDateString(), arabicLabel2: 'تاريخ المعاملة' },
                      { label1: 'Bank', value1: invoice?.transaction?.bank, arabicLabel1: 'البنك', label2: 'Paid Cash/Cheque Number', value2: invoice?.transaction?.paidCashOrChequeNumber, arabicLabel2: 'رقم الدفع نقداً/شيك' },
                      { label1: 'Transaction Description', value1: invoice?.transaction.description, arabicLabel1: 'وذلك عن', label2: 'Engine No.', value2: invoice?.transaction.car.engineNumber, arabicLabel2: 'رقم المحرك' },
                      { label1: 'Chassis No.', value1: invoice?.transaction.car.chassisNumber, arabicLabel1: 'رقم الشاصية او القاعدة', label2: 'Color', value2: invoice?.transaction.car.color, arabicLabel2: 'اللون' },
                      { label1: 'Model', value1: invoice?.transaction.car.model, arabicLabel1: 'سنة الصنع/الموديل', label2: 'Remaining Amount', value2: invoice?.transaction?.remainingAmount, arabicLabel2: 'المبلغ المتبقي' },
                      { label1: 'Payment Method', value1: invoice?.transaction?.paymentMethod, arabicLabel1: 'طريقة الدفع', label2: 'Currency', value2: invoice?.transaction?.currency, arabicLabel2: 'العملة' },
                      { label1: 'Amount in Words', value1: invoice?.transaction?.amountInWords, arabicLabel1: 'المبلغ بالكلمات', label2: 'Customer Contact Details', value2: invoice?.customer.contactDetails, arabicLabel2: 'تفاصيل اتصال العميل' },
                      { label1: 'Invoice Date', value1: new Date(invoice.invoiceDate).toLocaleDateString(), arabicLabel1: 'تاريخ الفاتورة', label2: 'Total Amount', value2: `$${editableTotalAmount}`, arabicLabel2: 'المبلغ الإجمالي' },
                    ].map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell><strong>{row.label1}:</strong></TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{row.value1}</TableCell>
                          <TableCell sx={{ direction: 'rtl', textAlign: 'start' }}><strong>{row.arabicLabel1}:</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>{row.label2}:</strong></TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{row.value2}</TableCell>
                          <TableCell sx={{ direction: 'rtl', textAlign: 'start' }}><strong>{row.arabicLabel2}:</strong></TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Divider variant="middle" sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6" gutterBottom sx={{ direction: 'rtl', textAlign: 'center' }}>
                          شروط البيع | Conditions of Deal
                        </Typography>
                        <Typography variant="body2" paragraph sx={{ direction: 'rtl', textAlign: 'start' }}>
                          - لابد من دفع الرصيد المستحق في خلال ........... <br />
                          - و عند عدول المشتري عن شراء المركبة لا يلزم على البائع رد أي مبالغ دفعها المشتري. <br />
                          - المركبات المباعة لا ترد و لا تستبدل. <br />
                          - يجب على المشتري فحص المركبة بدقة حيث لا يجوز له التقدم بأي شكوى بعد البيع و الشركة غير مسؤولة عن أي مشكلة بعد عملية البيع.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          - Balance will be paid within………… <br />
                          - In case of Failure, Advanced amount will be non-refundable. <br />
                          - Vehicles Sold will not be Refundable or exchangeable. <br />
                          - The customer must check the vehicle thoroughly as the company will not take any responsibility for any problem or complaint after the deal.
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Divider variant="middle" sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" sx={{ mr: 4, fontWeight: 'bold' }}>
                          <span style={{ fontSize: '1rem' }}>🖊️</span> التوقيع: <br /> Signature:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}></TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ mr: 4, fontWeight: 'bold', direction: 'rtl', textAlign: 'start' }}>
                          <span style={{ fontSize: '1rem' }}>🖊️</span> التوقيع: <br /> Signature:
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>


            </Box>
          ) : (
            <Loading />
          )}
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default InvoicePage;
