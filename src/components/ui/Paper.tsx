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
        maxHeight: scrollVertical ? "99dvh" : "auto",
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        ...sx,
      }}
      {...rest}>
      {children}
    </MuiPaper>
  );
};
export default Paper;
