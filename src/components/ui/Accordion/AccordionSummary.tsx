// ** Mui Imports
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  "&": {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
}));

export default AccordionSummary;
