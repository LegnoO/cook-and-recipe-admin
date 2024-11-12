// ** Mui Imports
import MuiAccordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  "&": {
    backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 15),
    borderRadius: `${theme.shape.borderRadius}px`,
  },
}));

export default Accordion;
