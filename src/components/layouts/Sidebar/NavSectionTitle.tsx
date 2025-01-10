// ** Mui Imports
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// ** Context
import useSettings from "@/hooks/useSettings";

// ** Types
import { INavSectionTitle } from "./types";

// ** Props
type Props = {
  item: INavSectionTitle;
};

// ** Styled Components
export const StyledNavSectionTitle = styled("li")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  paddingTop: "0.5rem",
  paddingInline: "0.5rem",
  paddingBottom: "0.25rem",
  overflow: "hidden",
  backgroundColor: "transparent",
  marginTop: "0.275rem",
});

export const Label = styled("span")(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: "0.8125rem",
  textTransform: "initial",
  overflow: "hidden",
  whiteSpace: "nowrap",
  lineHeight: 1.38462,
  letterSpacing: "0.4px",
  textOverflow: "ellipsis",
  flexGrow: 0,
}));

const NavSectionTitle = ({ item }: Props) => {
  const { activeIds } = useSettings();

  return (
    <StyledNavSectionTitle className="nav-section-title">
      {activeIds.includes("collapse-drawer") ? (
        <Box
          sx={{
            height: "1px",
            width: "100%",
            backgroundColor: (theme) => theme.palette.text.secondary,
          }}
        />
      ) : (
        <Label className="label">{item.sectionTitle}</Label>
      )}
    </StyledNavSectionTitle>
  );
};

export default NavSectionTitle;
