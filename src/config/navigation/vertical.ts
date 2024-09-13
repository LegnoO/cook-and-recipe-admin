// ** Types
import { IVerticalNavItemsType } from "@/components/layouts/Sidebar/types";

export const verticalNavItems: IVerticalNavItemsType = [
  {
    title: "Home",
    icon: "tabler:mail",
    path: "/home",
    action: "read",
    page: "user",
  },
  {
    title: "Settings",
    icon: "uil:setting",
    path: "/profile",
    action: "read",
    page: "user",
  },
];
