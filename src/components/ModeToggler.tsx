// ** React
import { useState, useEffect, useRef, MouseEvent, Fragment } from "react";

// ** Library Imports
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";

// ** Mui Imports
import { Typography, IconButton, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiMenuItem, { MenuItemProps } from "@mui/material/MenuItem";

// ** Components
import Menu from "@/components/ui/Menu";
import Icon from "@/components/ui/Icon";

// ** Context
import { ModeType } from "@/context/ModeProvider";

// ** Hooks
import { useMode } from "@/hooks/useMode";
import { hexToRGBA } from "@/utils/helpers";

// ** Styled Components
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  "&": {
    paddingInline: "1rem",
    marginInline: "0.5rem !important",
    borderRadius: `${theme.shape.borderRadius}px`,
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

// ** Types
type Props = { drag?: boolean };

const ModeToggler = ({ drag }: Props) => {
  const modeTogglerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { mode, setMode } = useMode();
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const MODE_MENU_ITEMS = ["Light", "Dark", "System"];
  const modePicked = localStorage.getItem("mode")
    ? JSON.parse(localStorage.getItem("mode")!).pickedMode
    : null;

  function handleDropdownOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleDropdownClose(url?: string) {
    if (url) navigate(url);

    setAnchorEl(null);
  }

  function handleToggleMode(newMode: ModeType) {
    setMode(newMode);
    setAnchorEl(null);
  }

  useEffect(() => {
    if (modeTogglerRef.current) {
      const { left, right, top, bottom } =
        modeTogglerRef.current.getBoundingClientRect();
      setConstraints({
        left: -left + 50,
        right: window.innerWidth - right - 50,
        top: -top + 50,
        bottom: window.innerHeight - bottom - 50,
      });
    }
  }, []);

  return (
    <Fragment>
      {drag ? (
        <motion.div
          ref={modeTogglerRef}
          drag
          dragConstraints={constraints}
          style={{
            position: "absolute",
            bottom: "70%",
            right: "40%",
          }}>
          <Box
            sx={{
              borderRadius: "99px",
              position: "relative",
              padding: "2px",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
                borderRadius: "99px",
                animation: "rotate 4s linear infinite",
                zIndex: 0,
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: "2px",
                borderRadius: "99px",
                background: (theme) => theme.palette.background.paper,
                zIndex: 1,
                pointerEvents: "none",
              },
            }}>
            <IconButton
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                height: "100%",
                "&": {
                  backgroundColor: (theme) =>
                    hexToRGBA(theme.palette.customColors.main, 0.04),
                },
                "&:hover": {
                  backgroundColor: (theme) =>
                    hexToRGBA(theme.palette.customColors.main, 0.1),
                },
              }}
              onClick={handleDropdownOpen}>
              <Icon
                fontSize="1.625rem"
                icon={mode === "dark" ? "tabler:moon-stars" : "tabler:sun"}
              />
            </IconButton>
          </Box>
        </motion.div>
      ) : (
        <IconButton onClick={handleDropdownOpen}>
          <Icon
            fontSize="1.625rem"
            icon={mode === "dark" ? "tabler:moon-stars" : "tabler:sun"}
          />
        </IconButton>
      )}
      <Menu
        className="menu"
        sx={{
          "& .MuiMenu-paper": {
            width: 128,
            mt: "1.125rem",
          },
          "& .MuiMenuItem-root.selected": {
            background: (theme) => theme.palette.primary.main,
          },
          "& .MuiMenuItem-root.selected:hover": {
            background: (theme) => theme.palette.primary.dark,
          },
          "& .MuiMenuItem-root.selected .MuiTypography-root": {
            color: (theme) => theme.palette.primary.contrastText,
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
    </Fragment>
  );
};

export default ModeToggler;
