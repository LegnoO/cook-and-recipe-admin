// ** Mui Imports
import MuiContainer from "@mui/material/Container";
import { styled } from "@mui/material/styles";

const Container = styled(MuiContainer)({
  "&": {
    maxWidth: { xl: "100%" },
    paddingInline: "0 !important",
    paddingBlock: "1.5rem",
  },
});

export default Container;
