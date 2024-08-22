// ** React
import { useState, MouseEvent } from "react";

// ** Library
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ** MUI Imports
import { Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiMenuItem, { MenuItemProps } from "@mui/material/MenuItem";

// ** Components
import Menu from "@/components/ui/Menu";
import Icon from "@/components/ui/Icon";

// ** Library
import clsx from "clsx";

// ** Context
import { ModeType } from "@/context/ModeProvider";

// ** Hooks
import { useMode } from "@/hooks/useMode";

// ** Styled Components
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  "&": {
    paddingInline: "1rem",
    marginInline: "0.5rem !important",
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.25s ease-in-out",
  },
  "&:not(:first-of-type)": {
    marginTop: "0.25rem !important",
  },
  "&.selected": {
    backgroundColor: theme.palette.action.selected,
  },

  "&.selected:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ModeToggler = ({ drag }: { drag?: boolean }) => {
  const navigate = useNavigate();
  const { mode, setMode } = useMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const MODE_MENU_ITEMS = ["Light", "Dark", "System"];
  const modePicked = localStorage.getItem("mode")
    ? JSON.parse(localStorage.getItem("mode")!).pickedMode
    : null;

  function handleDropdownOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleDropdownClose(url?: string) {
    if (url) {
      navigate(url);
    }
    setAnchorEl(null);
  }

  function handleToggleMode(newMode: ModeType) {
    setMode(newMode);
    setAnchorEl(null);
  }

  return (
    <>
      {drag ? (
        <motion.div
          drag
          style={{ position: "absolute", bottom: "20%", right: " 5%" }}>
          <IconButton onClick={handleDropdownOpen}>
            <Icon
              fontSize="1.625rem"
              icon={mode === "dark" ? "tabler:moon-stars" : "tabler:sun"}
            />
          </IconButton>
        </motion.div>
      ) : (
        <>
          <IconButton onClick={handleDropdownOpen}>
            <Icon
              fontSize="1.625rem"
              icon={mode === "dark" ? "tabler:moon-stars" : "tabler:sun"}
            />
          </IconButton>
        </>
      )}
      <Menu
        className="menu"
        sx={{
          "& .MuiMenu-paper": {
            width: 128,
            mt: "1.125rem",
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
        {MODE_MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={index}
            className={clsx("menu-item", {
              selected: item.toLowerCase() === modePicked,
            })}
            onClick={() => handleToggleMode(item.toLowerCase() as ModeType)}>
            <Typography sx={{ fontSize: 15 }} variant="subtitle2">
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ModeToggler;
