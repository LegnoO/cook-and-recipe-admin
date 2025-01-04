// ** Mui Imports
import MuiAccordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: `${theme.shape.borderRadius}px`,
  },

  "&.Mui-expanded .MuiAccordionSummary-root": { minHeight: "54px" },
  "&.Mui-expanded .MuiAccordionSummary-content": { marginBlock: "0.75rem" },
}));

export default Accordion;
