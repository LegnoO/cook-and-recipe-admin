// ** Mui Imports
import { Box, IconButton, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import MuiToolbar, { ToolbarProps } from "@mui/material/Toolbar";

// ** Components
import Icon from "@/components/ui/Icon";
import ModeToggler from "@/components/ModeToggler";
import UserDropdown from "./UserDropdown";

// ** Hooks
import useSettings from "@/hooks/useSettings";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Styled Components
const StyledAppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  "&": {
    marginTop: "1rem",
    color: theme.palette.text.primary,
    backgroundColor: hexToRGBA(theme.palette.background.paper, 0.85),
    borderRadius: theme.shape.borderRadius,
    //   [theme.breakpoints.up("sm")]: {
    //     paddingLeft: theme.spacing(6),
    //     paddingRight: theme.spacing(6),
    //   },
    //   [theme.breakpoints.down("sm")]: {
    //     paddingLeft: theme.spacing(4),
    //     paddingRight: theme.spacing(4),
    // }
  },
  // "&:before": {
  //   content: '""',
  //   position: "absolute",
  //   top: "-1rem",
  //   left: 0,
  //   zIndex: -1,
  //   height: "1rem",
  //   width: "100%",
  //   backdropFilter: "blur(6px)",
  //   background: hexToRGBA(theme.palette.background.default, 0.95),
  // },
}));

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: "100%",
  alignItems: "stretch",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  minHeight: theme.mixins.toolbar.minHeight,
  justifyContent: "space-between",
  paddingInline: "1rem !important",
}));

const AppBar = () => {
  const { toggleId } = useSettings();

  return (
    <StyledAppBar className="app-bar" position="sticky" elevation={0}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
          <IconButton
            sx={(theme) => ({
              display: "none",
              [theme.breakpoints.down("md")]: {
                display: "flex",
              },
            })}
            onClick={() => {
              toggleId("toggle-drawer");
            }}>
            <Icon icon="iconamoon:menu-burger-horizontal" />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}>
          <ModeToggler />
          <UserDropdown />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBar;
