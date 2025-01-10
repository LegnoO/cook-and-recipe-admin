// ** React
import { useEffect, Dispatch, SetStateAction } from "react";

// ** Next Imports
import { useLocation } from "react-router-dom";

// ** Mui Imports
import { styled } from "@mui/material/styles";
import { Collapse } from "@mui/material";

// ** Components
import Icon from "@/components/ui/Icon";

// ** Library Imports
import clsx from "clsx";

// ** Types
import { INavGroup, INavLink } from "./types";

// ** Sidebar's Components
import NavItems from "./NavItems";

// ** Props Type
type Props = {
  rootGroupActive: string[];
  setRootGroupActive: Dispatch<SetStateAction<string[]>>;
  childGroupActive: string[];
  setChildGroupActive: Dispatch<SetStateAction<string[]>>;
  item: INavGroup;
  isRootParent: boolean;
};

// ** Styled Components
export const StyledNavGroup = styled("li")(() => () => ({
  "&": {
    marginTop: "0.375rem",
    position: "relative",
    textDecoration: "none",
    width: "100%",
  },

  "&.sub-nav-group": {
    "& .nav-link .icon-wrapper": {
      marginLeft: "0.5rem",
    },
  },
}));

export const MenuButton = styled("button")(() => ({ theme }) => ({
  "&": {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBlock: "0.5rem",
    paddingInline: "0.75rem",
    borderRadius: theme.shape.borderRadius,
    lineHeight: 1,
    backgroundColor: "inherit",
    border: 0,
    outline: 0,
    transition:
      "padding-left 0.25s ease-in-out,padding-right 0.25s ease-in-out",
    cursor: "pointer",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& span": {
    color: theme.palette.text.primary,
  },
  "&.selected": {
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },

    "& .expand-icon": {
      transform: "rotate(90deg)",
    },
  },
}));

export const IconWrapper = styled("span")(() => () => ({
  display: "flex",
  alignItems: "center",
  marginRight: "0.875rem",
}));

export const Label = styled("span")(() => () => ({
  textAlign: "left",
  flexGrow: 1,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  lineHeight: "22px",
  fontSize: "0.9375rem",
  fontWeight: 400,
}));

export const ExpandIcon = styled("span")(() => () => ({
  display: "flex",
  alignItems: "center",
  "& svg": {
    color: "text.disabled",
    transition: "transform .25s ease-in-out",
  },
  transition: "transform 0.25s ease-in-out",
}));

const NavGroup = (props: Props) => {
  const {
    item,
    rootGroupActive,
    setRootGroupActive,
    childGroupActive,
    setChildGroupActive,

    isRootParent,
  } = props;

  const { pathname } = useLocation();

  function containsNavLinkPath(
    navItem: INavGroup | INavLink,
    path: string,
  ): boolean {
    if ("path" in navItem) {
      return navItem.path === path;
    }

    if ("children" in navItem && navItem.children) {
      // check if any child matches the path, return boolean
      return navItem.children.some((child) => containsNavLinkPath(child, path));
    }

    return false;
  }

  function toggleActiveGroup(group: INavGroup): void {
    if (isRootParent) {
      const newRootGroup = [...rootGroupActive];

      // toggle if this root not contains path of nav link
      if (!containsNavLinkPath(group, pathname)) {
        if (!newRootGroup.includes(group.title)) {
          newRootGroup[1] = group.title;
          setRootGroupActive(newRootGroup);
        } else {
          const newData = newRootGroup.filter((title, index) =>
            index === 1 ? title !== group.title : title,
          );

          setRootGroupActive([...newData]);
        }

        // else contains path of nav link
      } else {
        newRootGroup[0] = newRootGroup[0] === group.title ? "" : group.title;
        setRootGroupActive(newRootGroup);
      }
    } else {
      // if not root
      const newChildGroup = [...childGroupActive];

      if (!newChildGroup.includes(group.title)) {
        setChildGroupActive([...newChildGroup, group.title]);
      } else {
        setChildGroupActive(
          newChildGroup.filter((title) => {
            return title !== group.title;
          }),
        );
      }
    }
  }

  function handleGroupClick(): void {
    toggleActiveGroup(item);
  }

  // ** UseEffect
  useEffect(() => {
    if (containsNavLinkPath(item, pathname)) {
      if (isRootParent && !rootGroupActive.includes(item.title)) {
        setRootGroupActive([item.title]);
      } else {
        setRootGroupActive([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledNavGroup
      className={clsx("nav-group", { "sub-nav-group": !isRootParent })}
      onClick={handleGroupClick}>
      <MenuButton
        className={clsx("menu-button", {
          selected:
            rootGroupActive.includes(item.title) ||
            childGroupActive.includes(item.title),
        })}>
        <IconWrapper
          sx={{
            ml: isRootParent ? 0 : "0.375rem",
          }}
          className="icon-wrapper">
          <Icon
            className={clsx({
              "menu-icon": item.icon,
              "submenu-icon": !item.icon,
            })}
            icon={item.icon ?? "tabler:circle"}
            fontSize={isRootParent ? "1.375rem" : "0.75rem"}
          />
        </IconWrapper>
        <Label className="nav-group-label label">{item.title}</Label>
        <ExpandIcon className="expand-icon">
          <Icon fontSize="1.25rem" icon="tabler:chevron-right" />
        </ExpandIcon>
      </MenuButton>
      <Collapse
        component="ul"
        onClick={(e) => e.stopPropagation()}
        in={
          rootGroupActive.includes(item.title)
            ? rootGroupActive.includes(item.title)
            : childGroupActive.includes(item.title)
        }>
        <NavItems
          isRootParent={false}
          navParent={item}
          navItems={item.children}
          rootGroupActive={rootGroupActive}
          setRootGroupActive={setRootGroupActive}
          childGroupActive={childGroupActive}
          setChildGroupActive={setChildGroupActive}
        />
      </Collapse>
    </StyledNavGroup>
  );
};

export default NavGroup;
