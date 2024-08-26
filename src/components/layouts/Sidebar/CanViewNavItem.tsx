// ** React
import { ReactNode } from "react";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

// ** Types
import { INavGroup, INavLink, INavSectionTitle } from "./types";

type Props = {
  navItem?: INavGroup | INavLink | INavSectionTitle;
  children: ReactNode;
};

const CanViewNavItem = ({ children, navItem }: Props) => {
  const { user } = useAuth();
  if (
    navItem &&
    navItem.action &&
    user?.permission.some(
      (perm) =>
        perm.page === navItem.page &&
        navItem.action &&
        perm.actions.includes(navItem.action),
    )
  ) {
    return children;
  }

  return null;
};

export default CanViewNavItem;
