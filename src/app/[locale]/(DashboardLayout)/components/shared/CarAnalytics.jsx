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
import { useTranslations } from 'next-intl'; // Import useTranslations hook


const CarAnalytics = ({ carData, isDashboard = false }) => {
  const t = useTranslations('default'); // Initialize translation function
  const [open, setOpen] = useState(false);

  const calculateMetrics = () => {
    const totalVisits = carData?.visits?.length || 0;
    const totalLikes = carData?.likes?.length || 0;
    const totalShares = carData?.shares?.length || 0;
    const totalComments = carData?.comments?.length || 0;

    const uniqueVisitors = new Set(carData?.visits?.map((visit) => visit?.userId))?.size;
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
      {!isDashboard && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleToggle}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant="h6" gutterBottom>
            {t('carAnalytics.title')}
          </Typography>
          <IconButton>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
      )}
      <Collapse in={isDashboard || open}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.totalVisits')}
              number={formatNumber(metrics?.totalVisits)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.totalLikes')}
              number={formatNumber(metrics?.totalLikes)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.totalShares')}
              number={formatNumber(metrics?.totalShares)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.totalComments')}
              number={formatNumber(metrics?.totalComments)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.uniqueVisitors')}
              number={formatNumber(metrics?.uniqueVisitors)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.averageLikesPerVisit')}
              number={metrics?.averageLikesPerVisit?.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.averageSharesPerVisit')}
              number={metrics?.averageSharesPerVisit?.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalysisCard
              title={t('carAnalytics.averageCommentsPerVisit')}
              number={metrics?.averageCommentsPerVisit?.toFixed(2)}
            />
          </Grid>
        </Grid>
        {!isDashboard && (
          <>
            <Divider sx={{ my: 2 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('carAnalytics.type')}</TableCell>
                    <TableCell>{t('carAnalytics.date')}</TableCell>
                    <TableCell>{t('carAnalytics.details')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carData?.visits?.map((visit) => (
                    <TableRow key={visit?._id}>
                      <TableCell>{t('carAnalytics.visit')}</TableCell>
                      <TableCell>{new Date(visit?.date)?.toLocaleDateString()}</TableCell>
                      <TableCell>{t('carAnalytics.visitorId')}: {visit?.userId}</TableCell>
                    </TableRow>
                  ))}
                  {carData?.likes?.map((like) => (
                    <TableRow key={like?._id}>
                      <TableCell>{t('carAnalytics.like')}</TableCell>
                      <TableCell>{new Date(like?.date)?.toLocaleDateString()}</TableCell>
                      <TableCell>{t('carAnalytics.userId')}: {like?.userId}</TableCell>
                    </TableRow>
                  ))}
                  {carData?.shares?.map((share) => (
                    <TableRow key={share?._id}>
                      <TableCell>{t('carAnalytics.share')}</TableCell>
                      <TableCell>{new Date(share?.date)?.toLocaleDateString()}</TableCell>
                      <TableCell>{t('carAnalytics.userId')}: {share?.userId}</TableCell>
                    </TableRow>
                  ))}
                  {carData?.comments?.map((comment) => (
                    <TableRow key={comment?._id}>
                      <TableCell>{t('carAnalytics.comment')}</TableCell>
                      <TableCell>{new Date(comment?.date)?.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {t('carAnalytics.userComment', { userId: comment?.userId, text: comment?.text })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Collapse>
    </Box>
  );
};

export default CarAnalytics;
