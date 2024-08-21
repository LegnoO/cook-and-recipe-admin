// ** React
import { lazy } from "react";

// ** Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// ** Context
import AuthProvider from "@/context/AuthProvider";

// ** Layout
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";
import ErrorBoundary from "@/layouts/ErrorBoundary";
import Loading from "@/components/ui/Loading";

// ** Routes
import ProtectedRoute from "./ProtectedRoute";
import LoadingScreen from "@/components/layouts/LoadingScreen";
import Suspense from "@/components/Suspense";

// ** Pages
import LoginPage from "@/pages/LoginPage";
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const App = lazy(() => import("@/App"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<AuthProvider />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route element={<Suspense fallback={<Loading layout />} />}>
              <Route index path="/" element={<App />} />
              <Route index path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<BlankLayout />}>
          <Route element={<Suspense fallback={<LoadingScreen />} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<LoadingScreen />} />
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
