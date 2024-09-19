// ** Library
import { Outlet, Navigate, useLocation } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";
import NotFoundScreen from "@/components/layouts/NotFoundScreen";

// ** Config
import { homeRoute, protectedRoute } from "@/config/route-permission";

// ** Utils
import { isUrlPatternMatched } from "@/utils/helpers";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const currentPathname = location.pathname;
  const allowedRoutes = protectedRoute
    .filter((route) =>
      user?.permission.some(
        (perm) =>
          perm.page === route.permission.page &&
          perm.actions.includes(route.permission.action),
      ),
    )
    .map((route) => route.path);

  if (isLoading) return <LoadingScreen />;

  if (!user && !isUrlPatternMatched(currentPathname, allowedRoutes)) {
    const redirectToLogin =
      location.pathname !== homeRoute
        ? `/login?returnUrl=${location.pathname}`
        : "/login";
    return <Navigate to={redirectToLogin} />;
  }

  if (user && isUrlPatternMatched(currentPathname, allowedRoutes)) {
    return <Outlet />;
  }

  return <NotFoundScreen />;
};

export default ProtectedRoute;
