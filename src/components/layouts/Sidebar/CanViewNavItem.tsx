// ** React
import { ReactNode } from "react";

// ** Hooks
import useAuth from "@/hooks/useAuth";

// ** Types
import { INavGroup, INavLink, INavSectionTitle } from "./types";

type Props = {
  navItem?: INavGroup | INavLink | INavSectionTitle;
  children: ReactNode;
};

const CanViewNavItem = ({ children, navItem }: Props) => {
  const { can } = useAuth();

  if (!navItem) return null;

  if (!navItem.action || !navItem.page) {
    return children;
  }

  if (navItem.page && navItem.action) {
    if (can(navItem.page, navItem.action)) {
      return children;
    }
  }
};

export default CanViewNavItem;
