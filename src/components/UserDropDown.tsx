// ** React
import { useState, MouseEvent } from "react";

// ** Library
import { useNavigate } from "react-router-dom";

// ** MUI Imports
import { Badge, Avatar, Typography, Divider } from "@mui/material";
import MuiMenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Box, { BoxProps } from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// ** Components
import Menu from "@/components/ui/Menu";
import Icon from "@/components/ui/Icon";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingInline: "1rem",
  marginInline: "0.5rem !important",
  marginTop: "0.5rem !important",
  borderRadius: theme.shape.borderRadius,
}));

const MenuItemContent = styled(Box)<BoxProps>({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});

const ButtonLogout = styled(Button)<ButtonProps>(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "0.75rem",
  paddingBlock: "0.375rem",
  paddingInline: "0.875rem",
  minHeight: 0,
  transition: theme.transitions.create("all", {
    duration: theme.transitions.duration.short,
  }),
}));

const UserDropDown = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleDropdownOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleDropdownClose(url?: string) {
    if (url) {
      navigate(url);
    }
    setAnchorEl(null);
  }

  const MenuDropdown = () => {
    return (
      <Menu
        className="menu"
        sx={{
          "& .MuiMenu-paper": {
            width: 230,
            mt: "1.125rem",
            paddingBottom: "0.25rem",
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <Box sx={{ px: "1.5rem", py: "0.4375rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Avatar
              alt="Avatar"
              src="https://scontent.fsgn6-1.fna.fbcdn.net/v/t1.6435-1/139131444_3393715627406941_8376925531107375232_n.jpg?stp=c0.0.200.200a_dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=e4545e&_nc_ohc=GifADf7S5R0Q7kNvgFraanA&_nc_ht=scontent.fsgn6-1.fna&oh=00_AYBpTskoJj6lw8hEJjJwwKvtNNYoG9FWkacadByAe2N6jQ&oe=66C0B525"
              sx={{ width: "2.5rem", height: "2.5rem" }}
            />
            <Box
              sx={{
                display: "flex",

                alignItems: "flex-start",
                flexDirection: "column",
              }}>
              <Typography sx={{ fontWeight: 500 }}>Legno</Typography>
              <Typography variant="body2">Admin</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: "0.25rem" }} />
        <MenuItem className="menu-item">
          <MenuItemContent
            className="menu-item-content"
            onClick={() => handleDropdownClose("/profile")}>
            <Icon icon="tabler:user-check" />
            <Typography sx={{ fontSize: 15 }} variant="subtitle2">
              My Profile
            </Typography>
          </MenuItemContent>
        </MenuItem>
        <MenuItem className="menu-item">
          <MenuItemContent
            className="menu-item-content"
            onClick={() => handleDropdownClose("/settings")}>
            <Icon icon="tabler:settings" />
            <Typography sx={{ fontSize: 15 }} variant="subtitle2">
              Settings
            </Typography>
          </MenuItemContent>
        </MenuItem>
        <Divider sx={{ my: "0.25rem" }} />
        <Box
          sx={{
            paddingInline: "1rem",
          }}
          className="menu-item">
          <ButtonLogout
            onClick={logout}
            className="logout-button"
            variant="contained"
            color="error">
            <Icon icon="tabler:logout" />
            Logout
          </ButtonLogout>
        </Box>
      </Menu>
    );
  };

  return (
    <Box sx={{ cursor: "pointer" }} className="user-dropdown">
      <Badge
        overlap="circular"
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}>
        <Avatar
          onClick={handleDropdownOpen}
          sx={{ width: 38, height: 38 }}
          alt="Avatar"
          src="https://scontent.fsgn6-1.fna.fbcdn.net/v/t1.6435-1/139131444_3393715627406941_8376925531107375232_n.jpg?stp=c0.0.200.200a_dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=e4545e&_nc_ohc=GifADf7S5R0Q7kNvgFraanA&_nc_ht=scontent.fsgn6-1.fna&oh=00_AYBpTskoJj6lw8hEJjJwwKvtNNYoG9FWkacadByAe2N6jQ&oe=66C0B525"
        />
        <MenuDropdown />
      </Badge>
    </Box>
  );
};

export default UserDropDown;
