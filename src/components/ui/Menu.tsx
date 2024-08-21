// ** MUI Imports
import { styled } from "@mui/material/styles";
import MuiMenu from "@mui/material/Menu";

// ** Utils
import { hexToRGBA } from "@/utils/color";

// ** Styled Components
 const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 15),
    backgroundImage: "unset",
  },
}));

export default Menu;
