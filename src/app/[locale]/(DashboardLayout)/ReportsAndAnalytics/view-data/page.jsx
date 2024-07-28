"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
          const response = await fetch(`/api/row-data?schema=${schema}&fields=${schemaFields[schema].join(',')}`);
          
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
        <Accordion key={schema}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${schema}-content`}
            id={`${schema}-header`}
          >
            <Typography>{`${schema.charAt(0).toUpperCase() + schema.slice(1)} Data`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
                  {Array.isArray(data[schema][schema]) && data[schema][schema].length > 0 ? (
                    data[schema][schema].map((record, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {fields[schema].map((field, fieldIndex) => (
                          <TableCell key={fieldIndex}>{record[field]}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={fields[schema].length}>
                        <Typography align="center">No data available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
};

export default ViewDataPage;
