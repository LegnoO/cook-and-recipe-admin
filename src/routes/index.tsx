// ** Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";
import Suspense from "@/components/Suspense";
import NotFoundScreen from "@/components/layouts/NotFoundScreen";

// ** Layout
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";
import ErrorBoundary from "@/layouts/ErrorBoundary";
import BouncingDotsLoader from "@/components/ui/BouncingDotsLoader";

// ** Routes
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ** Config
import { homeRoute } from "@/config/url";

// ** App
import App from "@/App";

// ** Routes
import {
  protectedRoute,
  publicRoute,
} from "@/config/route-permission";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<App />}>
        <Route index path="/" element={<Navigate to={homeRoute} />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
        <Route index path={"/notfound"} element={<NotFoundScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route
              element={<Suspense fallback={<BouncingDotsLoader layout />} />}>
              {protectedRoute.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.component}
                  />
                );
              })}
            </Route>
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route element={<BlankLayout />}>
            <Route element={<Suspense fallback={<LoadingScreen />} />}>
              {publicRoute.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.component}
                  />
                );
              })}
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
