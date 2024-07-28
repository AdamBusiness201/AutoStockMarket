"use client";
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
  Typography,
} from "@mui/material";

const ViewDataPage = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [fields, setFields] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const schemaFields = {};

        queryParams.getAll('schema').forEach((schema, index) => {
          const field = queryParams.getAll('fields')[index];
          if (!schemaFields[schema]) {
            schemaFields[schema] = [];
          }
          schemaFields[schema].push(field);
        });

        setFields(schemaFields);

        const fetchPromises = Object.keys(schemaFields).map(async (schema) => {
          const response = await fetch(`API_ENDPOINT_TO_FETCH_DATA?schema=${schema}&fields=${schemaFields[schema].join(',')}`);
          
          if (response.ok) {
            return { schema, data: await response.json() };
          } else {
            console.error(`Failed to fetch data for schema ${schema}`);
            return { schema, data: [] };
          }
        });

        const results = await Promise.all(fetchPromises);
        const dataMap = {};
        results.forEach(result => {
          dataMap[result.schema] = result.data;
        });
        setData(dataMap);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer title="View Data" description="Displaying data based on selected schema and fields">
      {Object.keys(data).map((schema) => (
        <DashboardCard key={schema} title={`${schema.charAt(0).toUpperCase() + schema.slice(1)} Data`}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label={`${schema} data table`}>
              <TableHead>
                <TableRow>
                  {fields[schema].map((field, index) => (
                    <TableCell key={index}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data[schema].map((record, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {fields[schema].map((field, fieldIndex) => (
                      <TableCell key={fieldIndex}>{record[field]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
      ))}
    </PageContainer>
  );
};

export default ViewDataPage;
