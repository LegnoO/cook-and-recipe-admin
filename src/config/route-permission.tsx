// ** React
import { lazy } from "react";

// ** Config
import { homeRoute, loginRoute } from "./url";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const EmployeeListPage = lazy(() => import("@/pages/EmployeeListPage/"));

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
    component: <EmployeeListPage />,
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
