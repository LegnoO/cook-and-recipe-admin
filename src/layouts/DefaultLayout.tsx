// ** Mui Imports
import { styled, Theme } from "@mui/material/styles";

// ** Library Imports
import { Outlet } from "react-router-dom";

// ** Components
import Sidebar from "@/components/layouts/Sidebar";
import AppBar from "@/components/layouts/Appbar";

// ** Nav Items
import { verticalNavItems } from "@/config/navigation/vertical";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Styled Components
const LayoutWrapper = styled("div")(({ theme }: { theme: Theme }) => ({
  position: "relative",
  height: "100%",
  width: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.background.default,

  transition: "padding 0.3s ease-in-out",
}));

const LayoutInner = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  paddingInline: "1.5rem",
});

const LayoutContent = styled("div")({
  paddingTop: "1.5rem",
});

const DefaultLayout = () => {
  const { activeIds } = useSettings();
  return (
    <LayoutWrapper
      sx={(theme) => ({
        paddingInlineStart: activeIds.includes("collapse-drawer")
          ? "70px"
          : "260px",
        [theme.breakpoints.down("md")]: {
          paddingInlineStart: 0,
        },
      })}
      className="layout-wrapper">
      <LayoutInner className="layout-inner">
        <Sidebar navItems={verticalNavItems} />
        <AppBar />
        <LayoutContent className="layout-content">
          <Outlet />
        </LayoutContent>
      </LayoutInner>
    </LayoutWrapper>
  );
};

export default DefaultLayout;
