// ** React
import { Fragment, Dispatch, SetStateAction } from "react";

// ** Components's Sidebar
import NavLink from "./NavLink";
import NavSectionTitle from "./NavSectionTitle";
import NavGroup from "./NavGroup";

// ** Types
import {
  INavGroup,
  INavLink,
  INavSectionTitle,
  IVerticalNavItemsType,
} from "./types";

// ** Props
interface Props {
  rootGroupActive: string[];
  setRootGroupActive: Dispatch<SetStateAction<string[]>>;
  childGroupActive: string[];
  setChildGroupActive: Dispatch<SetStateAction<string[]>>;
  navItems?: IVerticalNavItemsType;
  navParent?: INavGroup;
  isRootParent: boolean;
}

const NavItems = (props: Props) => {
  const {
    navItems,
    rootGroupActive,
    setRootGroupActive,
    childGroupActive,
    setChildGroupActive,
    navParent,
    isRootParent,
  } = props;

  const RenderMenuItems = navItems?.map(
    (navItem: INavGroup | INavLink | INavSectionTitle, index: number) => {
      if ((navItem as INavGroup).children) {
        return (
          // <CanViewNavItem key={index} navItem={navItem}>
          <NavGroup
            key={index}
            rootGroupActive={rootGroupActive}
            setRootGroupActive={setRootGroupActive}
            childGroupActive={childGroupActive}
            setChildGroupActive={setChildGroupActive}
            item={navItem as INavGroup}
            isRootParent={isRootParent}
          />
          // </CanViewNavItem>
        );
      }

      if ((navItem as INavSectionTitle).sectionTitle) {
        return (
          // <CanViewNavItem key={index} navItem={navItem}>
          <NavSectionTitle key={index} item={navItem as INavSectionTitle} />
          // </CanViewNavItem>
        );
      }

      if ((navItem as INavLink).path) {
        return (
          // <CanViewNavItem key={index} navItem={navItem}>
          <NavLink
            key={index}
            setRootGroupActive={setRootGroupActive}
            navParent={navParent}
            item={navItem as INavLink}
          />
          // </CanViewNavItem>
        );
      }
    },
  );

  return <Fragment>{RenderMenuItems}</Fragment>;
};

export default NavItems;
