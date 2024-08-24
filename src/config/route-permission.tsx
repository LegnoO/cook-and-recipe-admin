// ** React
import { lazy } from "react";

// ** Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

export const test = [
  {
    page: "home",
    actions: ["create", "read", "update", "delete"],
  },
];

export const protectedRoute = [
  {
    page: "home",
    component: <HomePage />,
    path: "/",
  },
  { page: "profile", component: <ProfilePage />, path: "/profile" },
];

export const publicRoute = [
  {
    page: "home",
    component: <LoginPage />,
    path: "/login",
  },
];
