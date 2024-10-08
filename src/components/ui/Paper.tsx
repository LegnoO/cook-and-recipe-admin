// ** Mui Imports
import MuiPaper, { PaperProps } from "@mui/material/Paper";

// ** Types
type Props = {} & PaperProps;

const Paper = ({ sx, children, ...rest }: Props) => {
  return (
    <MuiPaper
      sx={{
        background: (theme) => theme.palette.background.paper,
        padding: "1.5rem",
        height: "auto",
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
