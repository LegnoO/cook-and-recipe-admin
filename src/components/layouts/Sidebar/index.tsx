// ** React
import { useState, memo } from "react";

// ** Mui Imports
import { styled } from "@mui/material/styles";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Components's Sidebar
import Drawer from "./Drawer";
import NavHeader from "./NavHeader";
import NavItems from "./NavItems";

// ** Types
import { IVerticalNavItemsType } from "./types";

// ** Props
type Props = {
  navItems: IVerticalNavItemsType;
};

// ** Styled Components
export const Nav = styled("nav")({
  paddingTop: "0.25rem",
  paddingBottom: "2rem",
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
          {/* <Box
            sx={{
              marginTop: "1.5rem",
              paddingBlock: "1rem",
            }}>
            <Typography
              sx={{ fontSize: "15px" }}
              variant="caption"
              color="text.secondary">
              © {new Date().getFullYear()}, Made with ❤️ by{" "}
            </Typography>
            <Typography
              sx={{ fontSize: "15px" }}
              variant="caption"
              color="primary">
              Legno
            </Typography>
          </Box> */}
        </Nav>
      </PerfectScrollbar>
    </Drawer>
  );
};

export default memo(Sidebar);
