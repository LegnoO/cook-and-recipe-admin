// ** React Imports
import { ReactNode } from "react";

// ** Mui Imports
import MuiPaper from "@mui/material/Paper";
import { SxProps } from "@mui/material";

// ** Types
type Scrollable = {
  vertical: boolean;
};

type Props = {
  scrollable?: Scrollable;
  children?: ReactNode;
  sx: SxProps;
};

const Paper = ({ sx, scrollable, children, ...rest }: Props) => {
  return (
    <MuiPaper
      sx={{
        background: (theme) => theme.palette.background.paper,
        padding: "1.5rem",
        overflowY: scrollable ? "auto" : "hidden",
        maxHeight: scrollable ? "95dvh" : "auto",
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        ...sx,
      }}
      {...rest}>
      {children}
    </MuiPaper>
  );
};
export default Paper;
