// ** React
import { Suspense } from "react";

// ** Library Imports
import { Outlet } from "react-router-dom";

// ** Mui Imports
import { styled } from "@mui/material/styles";

// ** Styled Components
const LayoutWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  overflow: "hidden",
}));

const LayoutContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "100dvh",
  padding: "1.5rem",
});

export default function BlankLayout() {
  return (
    <LayoutWrapper className="blank-layout-wrapper">
      <LayoutContent className="blank-layout-content">
        <Suspense>
          <Outlet />
        </Suspense>
      </LayoutContent>
    </LayoutWrapper>
  );
}
