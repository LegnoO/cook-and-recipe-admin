// ** Mui Imports
import { styled } from "@mui/material/styles";
import MuiMenu from "@mui/material/Menu";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Styled Components
const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 5),
    backgroundImage: "unset",
  },
}));

export default Menu;
