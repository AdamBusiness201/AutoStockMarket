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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { usePDF, Resolution } from "react-to-pdf";
import Image from "next/image";
import Loading from "../../../loading";

const InvoicePage = ({ params }) => {
  const [invoice, setInvoice] = useState(null);
  const [editableTransactionAmount, setEditableTransactionAmount] = useState("");
  const [editableTotalAmount, setEditableTotalAmount] = useState("");
  const [displayMode, setDisplayMode] = useState("invoice"); // New state to toggle view

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
        setEditableTransactionAmount(data.invoice.transaction.amount?.toFixed(2));
        setEditableTotalAmount(data.invoice.totalAmount?.toFixed(2));
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setInvoice(null);
      }
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleDisplayModeChange = (event, newMode) => {
    if (newMode) {
      setDisplayMode(newMode);
    }
  };

  return (
    <PageContainer
      title="Invoice Details"
      description="Details of the selected invoice"
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={() => toPDF()}>
          Download {displayMode === "invoice" ? "Invoice" : "Receipt"}
        </Button>
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={handleDisplayModeChange}
          aria-label="display mode"
        >
          <ToggleButton value="invoice" aria-label="invoice">
            Invoice
          </ToggleButton>
          <ToggleButton value="receipt" aria-label="receipt">
            Receipt
          </ToggleButton>
        </ToggleButtonGroup>
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
                    {displayMode === "invoice" ? "عقد" : "سند قبض"} #{invoice._id}
                  </Typography>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
                    {displayMode === "invoice" ? "Contract" : "Receipt"} #{invoice._id}
                  </Typography>
                </div>
                <Image
                  src="/images/Picture1.png"
                  alt="Company Logo"
                  width={300}
                  height={150}
                />
              </Box>

              {displayMode === "invoice" ? (
                <InvoiceDetails invoice={invoice} editableTransactionAmount={editableTransactionAmount} editableTotalAmount={editableTotalAmount} />
              ) : (
                <ReceiptDetails invoice={invoice} />
              )}
            </Box>
          ) : (
            <Loading />
          )}
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

// Full invoice details as a separate component
const InvoiceDetails = ({ invoice, editableTotalAmount, editableTransactionAmount }) => (
  <Box>
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
            { label1: 'Amount in Words', value1: invoice?.transaction?.amountInWords, arabicLabel1: 'المبلغ بالكلمات', label2: 'Customer Contact Details', value2: invoice?.customerType === "Partner" ? invoice?.customer?.contactDetails : invoice?.customer?.contactDetails?.phone, arabicLabel2: 'تفاصيل اتصال العميل' },
            { label1: 'Invoice Date', value1: new Date(invoice.invoiceDate).toLocaleDateString(), arabicLabel1: 'تاريخ الفاتورة', label2: 'Total Amount', value2: `${invoice?.transaction?.currency}${editableTotalAmount}`, arabicLabel2: 'المبلغ الإجمالي' },
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
  - يعتبر البائع مسؤولًا عن سلامة الجير والماكينة والديل والهيدروليك عند البيع شرط سلامة الشاصي والهيكل من أي دعم أو تصليح وسلامة جميع الأشياء الإلكترونية وشرط أداء المركبة باردة أول التشغيل أو بعد التشغيل. <br />
  - الصايعة الخارجية تكون تحت مسؤولية طرفي العقد من الناحية المالية والقانونية.
</Typography>
<Typography variant="body2" paragraph>
  - The seller is responsible for the safety of the gearbox, engine, differential, and hydraulics at the time of sale, provided the chassis and body are free of any damage or repairs, and all electronic components are functional. The vehicle must perform properly both when cold-started and after running. <br />
  - External issues are the financial and legal responsibility of both parties to the contract.
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
);

const ReceiptDetails = ({ invoice }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
      معرض السراج المنير لتجارة السيارات المستعملة | AlSuraj AlMuneer Used Car EXHB.
    </Typography>

    <TableContainer component={Paper} sx={{ my: 3 }}>
      <Table aria-label="receipt details table">
        <TableBody>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>No.:</strong> ______</TableCell>
            <TableCell colSpan={2} align="center"><strong>سند قبض | Receipt Voucher</strong></TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>التاريخ:</strong> {new Date(invoice?.transaction?.date).toLocaleDateString()}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Buyer:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.customer?.name}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>استلمت أنا من السيد:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Amount:</strong></TableCell>
            <TableCell colSpan={2} align="center">{`${invoice?.transaction?.currency} ${invoice?.transaction?.amount?.toFixed(2)}`}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>مبلغ و قدره درهم/ دولار:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Bank:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.bank}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>البنك:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Cheque No.:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.paidCashOrChequeNumber}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>شيك رقم:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>For:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.description}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>و ذلك عن:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Engine No.:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.car.engineNumber}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>رقم الماكينة/ المحرك:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Chassis No.:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.car.chassisNumber}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>رقم الشاصيه/القاعدة:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Color:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.car.color}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>لون المركبة:</strong></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Model:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.car.model}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>سنة الصنع/الموديل:</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <Divider sx={{ my: 2 }} />



    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Sales Value:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.amount?.toFixed(2)}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>القيمة:</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Advance:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.paidAmount?.toFixed(2)}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>المبلغ المدفوع:</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Balance:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.transaction?.remainingAmount?.toFixed(2)}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>الرصيد الباقي المستحق:</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>VAT 5%:</strong></TableCell>
            <TableCell colSpan={2} align="center">{(invoice?.transaction?.amount * 0.05)?.toFixed(2)}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>الضريبة 5%:</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ textAlign: "left" }}><strong>Total:</strong></TableCell>
            <TableCell colSpan={2} align="center">{invoice?.totalAmount?.toFixed(2)}</TableCell>
            <TableCell sx={{ textAlign: "right", direction: "rtl" }}><strong>الإجمالي:</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <Divider sx={{ my: 2 }} />
    <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
      شروط البيع | Conditions of Deal
    </Typography>
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      flexDirection: "row-reverse",
    }}>
      <Typography variant="body2" paragraph sx={{ direction: 'rtl', textAlign: 'start' }}>
  - يعتبر البائع مسؤولًا عن سلامة الجير والماكينة والديل والهيدروليك عند البيع شرط سلامة الشاصي والهيكل من أي دعم أو تصليح وسلامة جميع الأشياء الإلكترونية وشرط أداء المركبة باردة أول التشغيل أو بعد التشغيل. <br />
  - الصايعة الخارجية تكون تحت مسؤولية طرفي العقد من الناحية المالية والقانونية.
</Typography>
<Typography variant="body2" paragraph>
  - The seller is responsible for the safety of the gearbox, engine, differential, and hydraulics at the time of sale, provided the chassis and body are free of any damage or repairs, and all electronic components are functional. The vehicle must perform properly both when cold-started and after running. <br />
  - External issues are the financial and legal responsibility of both parties to the contract.
</Typography>

    </Box>
    <Divider sx={{ my: 2 }} />

    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        توقيع البائع | Seller Signature: _______________
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        توقيع المشتري | Purchaser’s Signature: _______________
      </Typography>
    </Box>

    <Box sx={{ mt: 2, textAlign: "center" }}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        الختم | Stamp
      </Typography>
    </Box>
  </Box>
);


export default InvoicePage;
