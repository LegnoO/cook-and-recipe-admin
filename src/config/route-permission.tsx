// ** React
import { lazy } from "react";

// ** Config
import { homeRoute, loginRoute } from "./url";
import TestPage from "@/pages/TestPage";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const EmployeePage = lazy(() => import("@/pages/EmployeePage"));
const GroupPage = lazy(() => import("@/pages/GroupPage"));
const ChefList = lazy(() => import("@/pages/ChefPage/ChefList"));
const ChefPendingList = lazy(() => import("@/pages/ChefPage/ChefPendingList"));
const RecipePendingList = lazy(
  () => import("@/pages/RecipePage/RecipePendingList"),
);
const RecipeList = lazy(() => import("@/pages/RecipePage/RecipeList"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));

export const protectedRoute: Route[] = [
  {
    path: homeRoute,
    component: <HomePage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: `${homeRoute}/:id`,
    component: <HomePage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/profile",
    component: <ProfilePage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/employees",
    component: <EmployeePage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    component: <TestPage />,
    path: "/test",
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/groups",
    component: <GroupPage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    permission: { page: "user", action: "read" },
    children: [
      {
        path: "",
        component: <ChefList />,
        permission: { page: "user", action: "read" },
      },
      {
        path: "pending",
        component: <ChefPendingList />,
        permission: { page: "user", action: "read" },
      },
    ],
  },

  {
    path: "/recipes",
    permission: { page: "user", action: "read" },
    children: [
      {
        path: "",
        component: <RecipeList />,
      },
      {
        path: "pending",
        component: <RecipePendingList />,
      },
    ],
  },

  {
    path: "/categories",
    component: <CategoryPage />,
    permission: {
      page: "user",
      action: "read",
    },
  },
];

export const publicRoute: Route[] = [
  {
    component: <LoginPage />,
    path: loginRoute,
  },
];
