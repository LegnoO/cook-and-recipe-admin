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

// ** App
import App from "@/App";

// ** Routes
import { test, protectedRoute, publicRoute } from "@/config/route-permission";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
      <Route element={<App />}>
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
