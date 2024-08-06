"use client";
import { useEffect, useState } from "react";
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
import { useTranslations } from 'next-intl';

const RecoveriesPage = () => {
  const t = useTranslations('default.recoveriesPage');
  const [recoveriesData, setRecoveriesData] = useState([]);

  useEffect(() => {
    const fetchRecoveriesData = async () => {
      try {
        // Adjust this to your API endpoint for fetching recoveries data
        const response = await fetch("/api/recoveries");
        
        if (response.ok) {
          const data = await response.json();
          setRecoveriesData(data);
        } else {
          console.error("Failed to fetch recoveries data");
        }
      } catch (error) {
        console.error("Error fetching recoveries data:", error);
      }
    };

    fetchRecoveriesData();
  }, []);

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <DashboardCard title={t('title')}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="recoveries table">
            <TableHead>
              <TableRow>
                <TableCell>{t('table.headers.accountName')}</TableCell>
                <TableCell>{t('table.headers.recoveryAmount')}</TableCell>
                <TableCell>{t('table.headers.description')}</TableCell>
                <TableCell>{t('table.headers.date')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recoveriesData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.accountName}</TableCell>
                  <TableCell>{record.recoveryAmount}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default RecoveriesPage;
