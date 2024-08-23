// ** React
import { lazy } from "react";

// ** Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";
import Suspense from "@/components/Suspense";

// ** Layout
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";
import ErrorBoundary from "@/layouts/ErrorBoundary";
import Loading from "@/components/ui/Loading";

// ** Routes
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ** Pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const HomePage = lazy(() => import("@/pages/HomePage"));

// ** App
import App from "@/App";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<App />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route element={<Suspense fallback={<Loading layout />} />}>
              <Route index path="/" element={<HomePage />} />
              <Route index path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<BlankLayout />}>
            <Route element={<Suspense fallback={<LoadingScreen />} />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/test" element={<LoadingScreen />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
