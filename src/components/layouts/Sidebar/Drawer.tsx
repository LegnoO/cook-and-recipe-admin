// ** React
import { ReactNode, MouseEvent } from "react";

// ** Mui Imports
import { Backdrop, Box, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// ** Components
import Icon from "@/components/ui/Icon";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Library Imports
import clsx from "clsx";

// ** Styled Components
export const StyledDrawer = styled("div")(({ theme }) => ({
  "&": {
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    zIndex: theme.zIndex.drawer,
    outline: 0,
    transition: "width 0.3s ease-in-out",
    width: "260px",
  },

  "& .button-collapse-drawer": {
    right: "-5%",
    transform: "rotate(180deg)",
  },

  "&.drawer-collapse .button-collapse-drawer": {
    transform: "rotate(0deg)",
    right: "-15%",
  },
  "&.drawer-collapse": { width: "70px" },
  "&.drawer-collapse .icon-wrapper": { marginRight: "0 !important" },

  "&.drawer-collapse .nav-header": {
    paddingInline: "1rem",
  },

  "& .nav-header .logo-label": {
    transition: "width 0.15s ease-in-out, opacity 0.15s ease-in-out",
    textWrap: "nowrap",
  },

  "&.drawer-collapse .nav-link-child, &.drawer-collapse .expand-icon,&.drawer-collapse .nav-group-label, &.drawer-collapse .nav-link-label":
    {
      display: "none",
      width: 0,
      opacity: 0,
    },

  "&.drawer-collapse .nav-header .logo-label": {
    width: 0,
    opacity: 0,
  },
}));

const Drawer = ({ children }: { children: ReactNode }) => {
  const toggleDrawerId = "toggle-drawer";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { removeId, activeIds, toggleId } = useSettings();

  function handleCloseBackdrop(event: MouseEvent) {
    event.stopPropagation();
    removeId(toggleDrawerId);
  }

  return isSmallScreen ? (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={activeIds.includes(toggleDrawerId)}
      onClick={handleCloseBackdrop}>
      <StyledDrawer
        className={clsx("sidebar drawer", {
          "drawer-collapse": activeIds.includes("collapse-drawer"),
        })}
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={(theme) => ({
          position: "relative",
          [theme.breakpoints.down("md")]: {
            maxWidth: activeIds.includes(toggleDrawerId) ? "unset" : 0,
          },
        })}>
        {children}
        <Box
          className="button-collapse-drawer"
          onClick={() => toggleId("collapse-drawer")}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            lineHeight: 0,
            padding: "0.25rem",
            borderRadius: "0.25rem",
            background: (theme) => theme.palette.background.paper,
            position: "absolute",
            cursor: "pointer",
            top: "3%",
          }}>
          <Icon fontSize="1rem" icon="tabler:chevron-right" />
        </Box>
      </StyledDrawer>
    </Backdrop>
  ) : (
    <StyledDrawer
      className={clsx("drawer", {
        "drawer-collapse": activeIds.includes("collapse-drawer"),
      })}
      onClick={(event) => {
        event.stopPropagation();
      }}
      sx={(theme) => ({
        position: "relative",
        [theme.breakpoints.down("md")]: {
          maxWidth: activeIds.includes(toggleDrawerId) ? "unset" : 0,
        },
      })}>
      {children}
      <Box
        className="button-collapse-drawer"
        onClick={() => toggleId("collapse-drawer")}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          lineHeight: 0,
          padding: "0.25rem",
          borderRadius: "0.25rem",
          background: (theme) => theme.palette.background.paper,
          position: "absolute",

          cursor: "pointer",
          top: "3%",
        }}>
        <Icon fontSize="1rem" icon="tabler:chevron-right" />
      </Box>
    </StyledDrawer>
  );
};

export default Drawer;
