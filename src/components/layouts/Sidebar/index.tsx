// ** React
import { useState, memo } from "react";

// ** MUI Imports
import { styled } from "@mui/material/styles";

// ** Library
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Components's Sidebar
import Drawer from "./Drawer";
import NavHeader from "./NavHeader";
import NavItems from "./NavItems";

// ** Types
import { IVerticalNavItemsType } from "./types";

// ** Props
interface Props {
  navItems: IVerticalNavItemsType;
}

// ** Styled Components
export const StyledSidebar = styled("aside")(() => ({
  // position: "fixed",
  // inset: 0,
  // width: "100%",
  // height: "100%",
  // backgroundColor: theme.palette.customColors.backdrop,
  // zIndex: theme.zIndex.drawer - 1,
}));

export const Nav = styled("nav")({
  paddingBlock: "0.25rem",
  paddingInline: "0.75rem",
});

export const NavList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const Sidebar = ({ navItems }: Props) => {
  const [rootGroupActive, setRootGroupActive] = useState<string[]>([]);
  const [childGroupActive, setChildGroupActive] = useState<string[]>([]);

  return (
    <StyledSidebar className="sidebar">
      <Drawer>
        <NavHeader />
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <Nav className="nav">
            <NavList className="nav-list">
              <NavItems
                isRootParent={true}
                navItems={navItems}
                rootGroupActive={rootGroupActive}
                setRootGroupActive={setRootGroupActive}
                childGroupActive={childGroupActive}
                setChildGroupActive={setChildGroupActive}
              />
            </NavList>
          </Nav>
        </PerfectScrollbar>
      </Drawer>
    </StyledSidebar>
  );
};

export default memo(Sidebar);
