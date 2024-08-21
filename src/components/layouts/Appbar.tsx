// ** MUI Imports
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import MuiToolbar, { ToolbarProps } from "@mui/material/Toolbar";

// ** Components
import UserDropDown from "@/components/UserDropDown";
import ModeToggler from "@/components/ModeToggler";

// ** Utils
import { hexToRGBA } from "@/utils/color";

// ** Styled
const StyledAppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  "&": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    //   [theme.breakpoints.up("sm")]: {
    //     paddingLeft: theme.spacing(6),
    //     paddingRight: theme.spacing(6),
    //   },
    //   [theme.breakpoints.down("sm")]: {
    //     paddingLeft: theme.spacing(4),
    //     paddingRight: theme.spacing(4),
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: "-1rem",
    left: 0,
    zIndex: -1,
    backdropFilter: "blur(10px)",
    width: "100%",
    height: `calc(${theme.mixins.toolbar.minHeight}px + 1rem)`,
    background: `linear-gradient(180deg,${hexToRGBA(theme.palette.background.default, 0.7)} 44%, ${hexToRGBA(theme.palette.background.default, 0.43)} 73%, ${hexToRGBA(theme.palette.background.default, 0)})`,
  },
}));

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  padding: "0.5rem 1rem",
  alignItems: "stretch",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  minHeight: theme.mixins.toolbar.minHeight,
  justifyContent: "flex-end",
}));

const AppBar = () => {
  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
          <ModeToggler />
          <UserDropDown />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBar;
