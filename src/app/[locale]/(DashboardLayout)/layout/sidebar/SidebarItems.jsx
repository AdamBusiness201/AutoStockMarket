import React from "react";
import localizeMenuItems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const CustomScrollbarBox = styled(Box)`
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888; /* Scrollbar thumb color */
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Scrollbar thumb color on hover */
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Scrollbar track color */
  }
`;
const SidebarItems = ({ toggleMobileSidebar, locale }) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const t = useTranslations('default.sidebar');
  console.log(t)
  return (
    <CustomScrollbarBox sx={{ px: 3, height: '100%', overflowY: 'auto' }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {localizeMenuItems(locale || "en").map((item) => {

          if (item.subheader) {
            item.subheader = t(item.key);
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            item.title = t(item.key);
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </CustomScrollbarBox>
  );
};

export default SidebarItems;
