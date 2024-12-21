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
import RouteGuard from "./RouteGuard";

// ** Config
import { homeRoute } from "@/config/url";

// ** App
import App from "@/App";

// ** Routes
import { protectedRoute, publicRoute } from "@/config/route-permission";

const renderRoutes = (routes: Route[]) => {
  return routes.map((route, index) => {
    if (route.children && route.children.length > 0) {
      return (
        <Route path={route.path || undefined} key={index}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return <Route key={index} path={route.path} element={route.component} />;
  });
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<App />}>
        <Route index path="/" element={<Navigate to={homeRoute} />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
        <Route index path={"/notfound"} element={<NotFoundScreen />} />
        <Route element={<RouteGuard />}>
          <Route element={<DefaultLayout />}>
            <Route
              element={<Suspense fallback={<BouncingDotsLoader layout />} />}>
              {renderRoutes(protectedRoute)}
            </Route>
          </Route>
          <Route element={<BlankLayout />}>
            <Route element={<Suspense fallback={<LoadingScreen />} />}>
              {renderRoutes(publicRoute)}
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);

export default router;
