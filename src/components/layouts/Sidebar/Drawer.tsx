// ** React
import { ReactNode, MouseEvent } from "react";

// ** Mui Imports
import { Backdrop, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Styled Components
export const StyledDrawer = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
  height: "100%",
  width: "260px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  zIndex: theme.zIndex.drawer,
  overflowY: "auto",
  outline: 0,
  transition: "width 0.3s ease-in-out",
}));

const Drawer = ({ children }: { children: ReactNode }) => {
  const toggleDrawerId = "toggle-drawer";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { removeId, activeIds } = useSettings();

  function handleCloseBackdrop(event: MouseEvent) {
    event.stopPropagation();
    removeId(toggleDrawerId);
  }

  if (isSmallScreen) {
    return (
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activeIds.includes(toggleDrawerId) && isSmallScreen}
        onClick={handleCloseBackdrop}>
        <StyledDrawer
          onClick={(event) => {
            event.stopPropagation();
          }}
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: {
              width: activeIds.includes(toggleDrawerId) ? "260px" : 0,
            },
          })}
          className="drawer">
          {children}
        </StyledDrawer>
      </Backdrop>
    );
  }

  return <StyledDrawer className="drawer">{children}</StyledDrawer>;
};

export default Drawer;
