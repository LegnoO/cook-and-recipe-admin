// ** React
import { lazy } from "react";

// ** Config
import { homeRoute, loginRoute } from "./url";

// ** Pages
import ErrorPage from "@/pages/ErrorPage";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const EmployeePage = lazy(() => import("@/pages/EmployeePage"));
const UserPage = lazy(() => import("@/pages/UserPage"));
const GroupPage = lazy(() => import("@/pages/GroupPage"));
const ChefList = lazy(() => import("@/pages/ChefPage/ChefList"));
const ChefPendingList = lazy(() => import("@/pages/ChefPage/ChefPendingList"));
const RecipePendingList = lazy(
  () => import("@/pages/RecipePage/RecipePendingList"),
);
const RecipeList = lazy(() => import("@/pages/RecipePage/RecipeList"));
const NotifyPage = lazy(() => import("@/pages/NotifyPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));

export const protectedRoute: Route[] = [
  {
    path: homeRoute,
    component: <Dashboard />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/profile",
    component: <ProfilePage />,
  },
  {
    path: "/employees",
    component: <EmployeePage />,
    permission: {
      page: "employee",
      action: "read",
    },
  },
  {
    path: "/users",
    component: <UserPage />,
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
    permission: { page: "chef", action: "read" },
    children: [
      {
        path: "/chefs",
        component: <ChefList />,
        permission: { page: "chef", action: "read" },
      },
      {
        path: "/chefs/pending",
        component: <ChefPendingList />,
        permission: { page: "chef", action: "pending" },
      },
    ],
  },

  {
    permission: { page: "recipe", action: "read" },
    children: [
      {
        path: "/recipes/pending",
        component: <RecipePendingList />,
        permission: {
          page: "recipe",
          action: "pending",
        },
      },
      {
        path: "/recipes",
        component: <RecipeList />,
        permission: {
          page: "recipe",
          action: "read",
        },
      },
    ],
  },
  {
    path: "/notification",
    component: <NotifyPage />,
    permission: {
      page: "user",
      action: "read",
    },
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
  {
    component: <ErrorPage />,
    path: "/error",
  },
];
