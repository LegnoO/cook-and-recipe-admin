// ** MUI Imports
import { styled } from "@mui/material/styles";

// ** Types
import { INavSectionTitle } from "./types";

// ** Props
interface Props {
  item: INavSectionTitle;
}

// ** Styled Components
export const StyledNavSectionTitle = styled("li")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "0.75rem",
  overflow: "hidden",
  backgroundColor: "transparent",
  marginTop: "0.375rem",
});

export const Label = styled("span")(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: "0.8125rem",
  textTransform: "uppercase",
  overflow: "hidden",
  whiteSpace: "nowrap",
  lineHeight: 1.38462,
  letterSpacing: "0.4px",
  textOverflow: "ellipsis",
  flexGrow: 0,
}));

const NavSectionTitle = ({ item }: Props) => {
  return (
    <StyledNavSectionTitle className="nav-section-title">
      <Label className="label">{item.sectionTitle}</Label>
    </StyledNavSectionTitle>
  );
};

export default NavSectionTitle;
