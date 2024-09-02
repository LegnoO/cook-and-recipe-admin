// ** Next Imports
import { Link } from "react-router-dom";

// ** MUI Imports
import { styled } from "@mui/material/styles";
import Logo from "@/components/ui/Logo";

// ** Components

// ** Styled Components
const StyledNavHeader = styled("div")({
  "&": {
    display: "flex",
    alignItems: "center",
    paddingBlock: "1.25rem",
    paddingInline: "1.375rem 1rem",
    transition: "padding 0.25s ease-in-out",
    marginBottom: "-0.375rem",
  },

  "& a": {
    color: "inherit",
    textDecoration: "none",
  },
});

const NavHeader = () => {
  return (
    <StyledNavHeader className="nav-header">
      {/* <Link to="/layout"> */}
        <Logo />
      {/* </Link> */}
    </StyledNavHeader>
  );
};

export default NavHeader;
