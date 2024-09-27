// ** React Imports
import { ReactNode } from "react";

// ** Mui Imports
import { Box } from "@mui/material";

// ** Components
import { Paper } from "@/components/ui";

// ** Types
type Props = {
  children: ReactNode;
  noPaper?: boolean;
  [key: string]: any;
};

const Form = ({ noPaper = false, children, ...rest }: Props) => {
  return (
    <Box component={"form"} {...rest}>
      {noPaper ? (
        children
      ) : (
        <Paper sx={{ padding: "1.5rem" }}>{children}</Paper>
      )}
    </Box>
  );
};

export default Form;
