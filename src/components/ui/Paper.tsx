// ** Mui Imports
import MuiPaper, { PaperProps } from "@mui/material/Paper";

// ** Types
type Props = {
  scrollVertical?: boolean;
} & PaperProps;

const Paper = ({ sx, scrollVertical, children, ...rest }: Props) => {
  return (
    <MuiPaper
      sx={{
        background: (theme) => theme.palette.background.paper,
        padding: "1.5rem",
        overflowY: scrollVertical ? "auto" : "hidden",
        maxHeight: scrollVertical ? "95dvh" : "100%",
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        minWidth: { sm: "inherit", xs: "80dvw" },
        ...sx,
      }}
      {...rest}>
      {children}
    </MuiPaper>
  );
};
export default Paper;
