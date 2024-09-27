// ** React
import { ReactNode } from "react";

// ** Hooks
import useAuth from "@/hooks/useAuth";

// ** Utils
import { isUndefined } from "@/utils/helpers";

// ** Types
import { INavGroup, INavLink, INavSectionTitle } from "./types";

type Props = {
  navItem?: INavGroup | INavLink | INavSectionTitle;
  children: ReactNode;
};

const CanViewNavItem = ({ children, navItem }: Props) => {
  const { user } = useAuth();

  if (navItem) {
    if (isUndefined(navItem.action) && isUndefined(navItem.page)) {
      return children;
    }

    if (
      !isUndefined(navItem.action) &&
      !isUndefined(navItem.page) &&
      user?.permission.some(
        (perm) =>
          perm.page === navItem.page &&
          perm.actions.includes(navItem.action as string),
      )
    ) {
      return children;
    }
  }

  return null;
};

export default CanViewNavItem;
