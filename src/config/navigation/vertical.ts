// ** Types
import { IVerticalNavItemsType } from "@/components/layouts/Sidebar/types";

export const verticalNavItems: IVerticalNavItemsType = [
  {
    title: "Dashboard",
    icon: "iconoir:mail-open",
    path: "/test",
    action: "read",
    page: "user",
  },

  {
    title: "Employees",
    icon: "stash:user-group",
    path: "/employees",
    action: "read",
    page: "user",
  },
  {
    title: "Groups",
    icon: "ph:lock-key-light",
    path: "/groups",
    action: "read",
    page: "user",
  },

  {
    title: "Category",
    icon: "tabler:category-2",
    path: "/categories",
    action: "read",
    page: "user",
  },
  {
    title: "Recipe",
    icon: "ic:baseline-edit-note",
    action: "read",
    page: "user",
    children: [
      {
        title: "Verified",
        path: "/recipes",
        action: "read",
        page: "user",
      },
      {
        title: "Pending",
        path: "/recipes/pending",
        action: "read",
        page: "user",
      },
    ],
  },
  {
    title: "Chef",
    icon: "solar:chef-hat-outline",
    action: "read",
    page: "user",
    children: [
      {
        title: "Approved",
        path: "/chefs",
        action: "read",
        page: "user",
      },
      {
        title: "Pending",
        path: "/chefs/pending",
        action: "read",
        page: "user",
      },
    ],
  },
  {
    title: "Settings",
    icon: "uil:setting",
    path: "/profile",
  },
];
