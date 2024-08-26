// ** React

import { lazy } from "react";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

// ** Types
import { ProtectedRoute, PublicRoute } from "@/types/Routes";

export const homeRoute: string = "/home";

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
      page: "null",
      action: "read",
    },
  },
];

export const publicRoute: PublicRoute[] = [
  {
    component: <LoginPage />,
    path: "/login",
  },
];
