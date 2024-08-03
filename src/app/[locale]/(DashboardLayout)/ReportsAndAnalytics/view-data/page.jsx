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
  Tabs,
  Tab,
  Box
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const containerStyle = {
  display: 'flex',
  height: 'calc(100vh - 64px)', // Adjust based on header/footer height
};

const tabsContainerStyle = {
  width: '15%',
  borderRight: '1px solid #ddd',
  overflowY: 'auto',
};

const contentContainerStyle = {
  width: '85%',
  overflowY: 'auto',
  padding: '16px',
  paddingTop: 0
};

const ViewDataPage = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [fields, setFields] = useState({});
  const [tabValue, setTabValue] = useState('');

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
        if (Object.keys(dataMap).length > 0) {
          setTabValue(Object.keys(dataMap)[0]); // Set the default tab to the first schema
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer title="View Data" description="Displaying data based on selected schema and fields">
      <Box sx={containerStyle}>
        <Box sx={tabsContainerStyle}>
          <Tabs
            orientation="vertical"
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(data).map((schema) => (
              <Tab
                label={schema.charAt(0).toUpperCase() + schema.slice(1)}
                value={schema}
                key={schema}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={contentContainerStyle}>
          {Object.keys(data).map((schema) => (
            tabValue === schema && (
              <Box key={schema}>
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
                      {Array.isArray(data[schema]) && data[schema].length > 0 ? (
                        data[schema].map((record, rowIndex) => (
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
              </Box>
            )
          ))}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ViewDataPage;
