// ** Mui Imports
import { styled } from "@mui/material/styles";

// ** Library Imports
import { Link } from "react-router-dom";

// ** Components
import Logo from "@/components/ui/Logo";

// ** Config
import { homeRoute } from "@/config/url";

// ** Styled Components
const StyledNavHeader = styled("div")({
  "&": {
    display: "flex",
    alignItems: "center",
    paddingBlock: "1.25rem",
    paddingInline: "1.375rem 1rem",
    transition: "padding 0.25s ease-in-out",
    marginBottom: "-0.375rem",
    overflow: "hidden",
  },

  "& a": {
    color: "inherit",
    textDecoration: "none",
  },
});

const NavHeader = () => {
  return (
    <StyledNavHeader className="nav-header">
      <Link to={homeRoute}>
        <Logo />
      </Link>
    </StyledNavHeader>
  );
};

export default NavHeader;
