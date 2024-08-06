'use client';
import { styled, Container, Box } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import { usePathname } from "next/navigation";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(({ sidebarWidth }) => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
  maxWidth: `calc(100% - ${sidebarWidth})`, // Adjust maxWidth to account for the sidebar width
  transition: 'max-width 0.3s', // Optional: smooth transition
}));

export default function RootLayout({ children, params: { locale } }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState('0px'); // Default width

  const pathname = usePathname(); // Get the current pathname

  // Check if the current path is the home page
  const isHomePage = pathname === `/${locale}`; // Adjust the condition as needed
  console.log(isHomePage, pathname);

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarWidth(`270px`);
    }
  }, [sidebarRef.current, isSidebarOpen]);

  const handleToggleSidebar = (newSidebarState) => {
    setSidebarOpen(newSidebarState);
  };

  // Render only the children if it's the home page
  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <MainWrapper className="mainwrapper">
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar
        ref={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        toggleSidebar={handleToggleSidebar} // Corrected here
        locale={locale}
      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper" sidebarWidth={sidebarWidth}>
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header 
          toggleMobileSidebar={() => setMobileSidebarOpen(true)} 
          toggleSidebar={handleToggleSidebar} // Corrected here
          isSidebarOpen={isSidebarOpen}
        />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "100%",
            borderRadius: "20px",
            marginY: "20px",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
