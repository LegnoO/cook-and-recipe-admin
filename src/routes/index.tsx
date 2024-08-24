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
import Loading from "@/components/ui/Loading";

// ** Routes
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ** App
import App from "@/App";

// ** Routes
import { test, protectedRoute, publicRoute } from "@/config/route-permission";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<App />}>
        <Route path="*" element={<Navigate to="/notfound" />} />
        <Route index path={"/notfound"} element={<NotFoundScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route element={<Suspense fallback={<Loading layout />} />}>
              {protectedRoute.map((route, index) => {
                const routeExists = test.findIndex(
                  (data) =>
                    data.page === route.page && data.actions.includes("read"),
                );

                if (routeExists !== -1) {
                  return (
                    <Route
                      index
                      key={index}
                      path={route.path}
                      element={route.component}
                    />
                  );
                }

                return null;
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
                    index
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
