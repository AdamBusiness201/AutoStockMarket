import React, { useState } from 'react';
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
  Grid,
  Divider
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AnalysisCard from './DashboardAnalysisCard';
import { formatNumber } from '../../../../../utils/numberUtils';

const CarAnalytics = ({ carData }) => {
  const [open, setOpen] = useState(false);

  const calculateMetrics = () => {
    const totalVisits = carData?.visits?.length || 0;
    const totalLikes = carData?.likes?.length || 0;
    const totalShares = carData?.shares?.length || 0;
    const totalComments = carData?.comments?.length || 0;

    const uniqueVisitors = new Set(carData?.visits?.map(visit => visit?.userId))?.size;
    const averageLikesPerVisit = totalVisits > 0 ? totalLikes / totalVisits : 0;
    const averageSharesPerVisit = totalVisits > 0 ? totalShares / totalVisits : 0;
    const averageCommentsPerVisit = totalVisits > 0 ? totalComments / totalVisits : 0;

    return {
      totalVisits,
      totalLikes,
      totalShares,
      totalComments,
      uniqueVisitors,
      averageLikesPerVisit,
      averageSharesPerVisit,
      averageCommentsPerVisit
    };
  };

  const metrics = calculateMetrics();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleToggle}
        cursor="pointer"
      >
        <Typography variant="h6" gutterBottom>
          Car Analytics on ASM E-Commerce
        </Typography>
        <IconButton>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Total Visits"
              number={formatNumber(metrics?.totalVisits)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Total Likes"
              number={formatNumber(metrics?.totalLikes)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Total Shares"
              number={formatNumber(metrics?.totalShares)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Total Comments"
              number={formatNumber(metrics?.totalComments)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Unique Visitors"
              number={formatNumber(metrics?.uniqueVisitors)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Average Likes Per Visit"
              number={metrics?.averageLikesPerVisit?.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Average Shares Per Visit"
              number={metrics?.averageSharesPerVisit?.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title="Average Comments Per Visit"
              number={metrics?.averageCommentsPerVisit?.toFixed(2)}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carData?.visits?.map((visit) => (
                <TableRow key={visit?._id}>
                  <TableCell>Visit</TableCell>
                  <TableCell>{new Date(visit?.date)?.toLocaleDateString()}</TableCell>
                  <TableCell>Visitor ID: {visit?.userId}</TableCell>
                </TableRow>
              ))}
              {carData?.likes?.map((like) => (
                <TableRow key={like?._id}>
                  <TableCell>Like</TableCell>
                  <TableCell>{new Date(like?.date)?.toLocaleDateString()}</TableCell>
                  <TableCell>User ID: {like?.userId}</TableCell>
                </TableRow>
              ))}
              {carData?.shares?.map((share) => (
                <TableRow key={share?._id}>
                  <TableCell>Share</TableCell>
                  <TableCell>{new Date(share?.date)?.toLocaleDateString()}</TableCell>
                  <TableCell>User ID: {share?.userId}</TableCell>
                </TableRow>
              ))}
              {carData?.comments?.map((comment) => (
                <TableRow key={comment?._id}>
                  <TableCell>Comment</TableCell>
                  <TableCell>{new Date(comment?.date)?.toLocaleDateString()}</TableCell>
                  <TableCell>User ID: {comment?.userId} - {comment?.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};

export default CarAnalytics;
