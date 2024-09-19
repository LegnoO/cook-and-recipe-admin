// ** Imports React
import { ReactNode } from "react";

// ** Mui Imports
import { Box } from "@mui/material/";

// ** Components
import Paper from "./Paper";

// ** Types
type Props = {
  children: ReactNode;
  [key: string]: any;
};

const Form = ({ children, ...rest }: Props) => {
  return (
    <Box component={"form"} {...rest}>
      <Paper sx={{ padding: "1.5rem" }}>{children}</Paper>
    </Box>
  );
};

export default Form;
