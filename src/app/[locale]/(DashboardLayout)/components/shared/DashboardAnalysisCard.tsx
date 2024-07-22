import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  title: string;
  number: number;
};

const AnalysisCard = ({ title, number }: Props) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 5,
        marginTop: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {number}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
