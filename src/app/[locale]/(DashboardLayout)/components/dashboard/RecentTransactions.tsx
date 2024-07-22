import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Link, Typography } from "@mui/material";

const RecentTransactions = ({ transactions, title }: any) => {
  // Function to generate a random color from the provided options
  const generateRandomColor = () => {
    const colors = [
      "inherit",
      "grey",
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex] as
      | "inherit"
      | "grey"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
  };

  return (
    <DashboardCard title={title}>
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {transactions?.map((transaction: any, index: number) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                {new Date(transaction?.createdAt).toLocaleTimeString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={generateRandomColor()} // Set color randomly
                  variant="outlined"
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <strong>
                  {new Intl.NumberFormat("en-AE", {
                    style: "currency",
                    currency: "AED",
                  }).format(transaction?.amount)}
                </strong>
                <br />
                {transaction?.description}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
