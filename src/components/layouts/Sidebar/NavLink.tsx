// ** React
import { Dispatch, SetStateAction, MouseEvent } from "react";

// ** Next Imports
import { Link, useLocation } from "react-router-dom";

// ** MUI Imports
import { styled } from "@mui/material/styles";

// ** Components
import Icon from "@/components/ui/Icon";

// ** Utils
import { hexToRGBA } from "@/utils/color";

// ** Library
import clsx from "clsx";

// ** Types
import { INavGroup, INavLink } from "./types";

// ** Props
interface Props {
  item: INavLink;
  navParent?: INavGroup;
  setRootGroupActive: Dispatch<SetStateAction<string[]>>;
}

// ** Styled Components
export const MenuNavLink = styled("li")(({ theme }) => ({
  "&": {
    marginTop: "0.375rem",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .active": {
    color: theme.palette.common.white,
    boxShadow: `0px 2px 6px ${hexToRGBA(theme.palette.primary.main, 0.48)}`,
    background: `linear-gradient(270deg, ${hexToRGBA(theme.palette.primary.main, 0.7)} 0%, ${theme.palette.primary.main} 100%)`,

    "& .label, & svg": {
      color: `${theme.palette.common.white} !important`,
    },
  },
}));

export const IconWrapper = styled("span")(({ theme }) => ({
  "&": {
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    marginRight: "1.0625rem",
    marginLeft: "0.375rem",
  },

  "&.icon-custom": {
    marginLeft: 0,
  },
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: "30px",
  paddingBlock: "0.5rem",
  paddingInline: "0.75rem",
  cursor: "pointer",
  textDecoration: "none",
  borderRadius: theme.shape.borderRadius,
  border: 0,
  outline: 0,
}));

export const Label = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  flexGrow: 1,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const NavLink = (props: Props) => {
  const { item, navParent, setRootGroupActive } = props;
  const { pathname } = useLocation();

  // ** Check if the current path matches the item path
  const isActive = pathname === item.path;

  function handleSetRootGroup(event: MouseEvent<HTMLAnchorElement>) {
    if (!item.path) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (item.path && !navParent) {
      setRootGroupActive([]);
    }
  }

  return (
    <MenuNavLink className="menu-nav-link">
      <StyledLink
        className={clsx("nav-link", {
          "nav-link-child": navParent,
          active: isActive,
        })}
        to={item.path ?? "/"}
        onClick={handleSetRootGroup}>
        <IconWrapper
          className={clsx("icon-wrapper", {
            "icon-custom": item.icon,
          })}>
          <Icon
            className="icon"
            icon={item.icon ?? "tabler:circle"}
            fontSize={navParent ? "0.75rem" : "1.375rem"}
          />
        </IconWrapper>

        <Label className={"label"}>
          {item.title} {item.path}
        </Label>
      </StyledLink>
    </MenuNavLink>
  );
};

export default NavLink;
