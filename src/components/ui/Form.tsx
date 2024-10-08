// ** React Imports
import { ReactNode } from "react";

// ** Mui Imports
import { PaperProps } from "@mui/material";

// ** Components
import { Paper } from "@/components/ui";

// ** Types
type Props = {
  children: ReactNode;
  noPaper?: boolean;
  [key: string]: any;
} & PaperProps;

const Form = ({ sx, noPaper = false, children, ...rest }: Props) => {
  return (
    <Paper
      sx={{ p: 0, backgroundColor: "transparent", ...sx }}
      component={"form"}
      {...rest}>
      {children}
    </Paper>
  );
};

export default Form;
