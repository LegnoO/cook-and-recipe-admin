// ** React
import { lazy } from "react";

// ** Config
import { homeRoute, loginRoute } from "./url";
import TestPage from "@/pages/TestPage";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ListEmployee = lazy(() => import("@/pages/Employee/ListEmployee"));
const ListGroup = lazy(() => import("@/pages/Group/ListGroup"));

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
    component: <ListEmployee />,
    permission: {
      page: "user",
      action: "read",
    },
  },  {
    component: <TestPage />,
    path: "/test",
    permission: {
      page: "user",
      action: "read",
    },
  },
  {
    path: "/groups",
    component: <ListGroup />,
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
