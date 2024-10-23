// ** React
import { lazy } from "react";

// ** Config
import { homeRoute, loginRoute } from "./url";
import TestPage from "@/pages/TestPage";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const EmployeeList = lazy(() => import("@/pages/Employee/EmployeeList"));
const GroupList = lazy(() => import("@/pages/Group/GroupList"));
const ChefList = lazy(() => import("@/pages/Chef/ChefList"));
const ChefPendingList = lazy(() => import("@/pages/Chef/ChefPendingList"));
const RecipePendingList = lazy(
  () => import("@/pages/Recipe/RecipePendingList"),
);
const RecipeList = lazy(() => import("@/pages/Recipe/RecipeList"));
const CategoryList = lazy(() => import("@/pages/Category/CategoryList"));

export const protectedRoute: ProtectedRoute[] = [
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
      page: "home",
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
    component: <EmployeeList />,
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
    component: <GroupList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/chefs",
    component: <ChefList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/chefs/pending",
    component: <ChefPendingList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/recipes/pending",
    component: <RecipePendingList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/recipes",
    component: <RecipeList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/category",
    component: <CategoryList />,
    permission: {
      page: "user",
      action: "read",
    },
  },
];

export const publicRoute: PublicRoute[] = [
  {
    component: <LoginPage />,
    path: loginRoute,
  },
];
