import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useTheme,
} from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
  action?: JSX.Element | any;
  footer?: JSX.Element;
  cardheading?: string | JSX.Element;
  headtitle?: string | JSX.Element;
  headsubtitle?: string | JSX.Element;
  children?: JSX.Element;
  middlecontent?: string | JSX.Element;
};

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}: Props) => {
  const theme = useTheme();
  return (
    <Card sx={{ padding: 0, my: 2 }} elevation={9} variant={undefined}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              sx={{
                background: `linear-gradient(223deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, // Gradient using theme colors,
                color: "white", // White text
                padding: "16px", // Padding around the content
              }}
            >
              <Box>
                {title ? <Typography variant="h5">{title}</Typography> : ""}

                {subtitle ? (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              {action}
            </Stack>
          ) : null}
          <CardContent sx={{ p: "30px" }}>{children}</CardContent>
        </>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

export default DashboardCard;
