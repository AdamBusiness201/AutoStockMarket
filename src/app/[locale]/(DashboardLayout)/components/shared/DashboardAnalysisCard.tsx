import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  title: string;
  number: number;
};

const AnalysisCard = ({ title, number }: Props) => {
  const formattedNumber = new Intl.NumberFormat('en-US').format(number); // Format number using locale 'en-US'

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 2,
        marginTop: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {formattedNumber}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
