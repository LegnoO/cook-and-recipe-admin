// ** React Imports
import { ReactNode } from "react";

// ** Mui Imports
import MuiContainer from "@mui/material/Container";

// ** Types
interface ContainerProps {
  children: ReactNode;
  [key: string]: any;
}

const Container = ({ children, ...rest }: ContainerProps) => {
  return (
    <MuiContainer
      {...rest}
      sx={{
        maxWidth: { xl: "100%" },
        paddingInline: "0 !important",
        paddingBlock: "1.5rem",
      }}>
      {children}
    </MuiContainer>
  );
};
export default Container;
