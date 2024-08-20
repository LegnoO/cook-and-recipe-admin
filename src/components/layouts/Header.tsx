// ** MUI Imports
import { styled } from "@mui/material/styles";

// ** Components
import AppBar from "@/components/layouts/Appbar";

// ** Styled
export const StyledHeader = styled("header")(({ theme }) => ({
  paddingTop: "1rem",
  position: "sticky",
  inset: 0,
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  width: "100%",
  minHeight: theme.mixins.header.minHeight,
  // backgroundColor: theme.palette.customColors.backdrop,
  zIndex: theme.zIndex.appBar,
}));

const Header = () => {
  return (
    <StyledHeader className="header">
      <AppBar />
    </StyledHeader>
  );
};

export default Header;
