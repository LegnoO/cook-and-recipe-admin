// ** React
import { lazy, Suspense } from "react";

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

// ** Pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const App = lazy(() => import("@/App"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorBoundary />}>
      <Route element={<AuthProvider />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <App />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route element={<BlankLayout />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loading />}>
                <LoginPage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
