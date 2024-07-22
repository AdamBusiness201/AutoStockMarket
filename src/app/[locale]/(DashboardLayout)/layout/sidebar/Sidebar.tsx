"use client";
import { useMediaQuery, Box, Drawer } from "@mui/material";
import Logo from "../shared/logo/Logo";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";
import { useParams } from "next/navigation";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  toggleMobileSidebar: () => void; // Added toggleMobileSidebar prop
  locale?: string;
}

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  toggleMobileSidebar,
  locale,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="right"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: "border-box",
              ...(locale === "ar" ? { right: "0px" } : { left: "0px" }),
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Logo - Fixed at the top */}
            <Box
              p={3}
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100, // Higher z-index to ensure it stays on top of other content
                bgcolor: "background.paper",
              }}
            >
              <Logo />
            </Box>

            {/* Sidebar Content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto"
              }}
            >
              <SidebarItems
                toggleMobileSidebar={toggleMobileSidebar}
                locale={locale}
              />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems toggleMobileSidebar={toggleMobileSidebar} locale={locale} />
    </Drawer>
  );
};

export default Sidebar;
