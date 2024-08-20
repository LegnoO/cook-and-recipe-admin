// ** React
import { ReactNode } from "react";

// ** MUI Imports
import { styled } from "@mui/material/styles";

// ** Styled
export const StyledDrawer = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
  height: "100%",
  width: "260px",
  [theme.breakpoints.down("md")]: {
    width: 0,
  },
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  zIndex: theme.zIndex.drawer,
  overflowY: "auto",
  outline: 0,
  transition: "width 0.3s ease-in-out",
}));

const Drawer = ({ children }: { children: ReactNode }) => {
  return <StyledDrawer className="drawer">{children}</StyledDrawer>;
};

export default Drawer;
