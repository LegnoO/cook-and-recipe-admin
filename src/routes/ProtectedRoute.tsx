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
import { isUrlPatternMatched } from "@/utils/url";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const currentPathname = location.pathname;
 

  function getAllowedRoutes() {
    const allowedUrls = protectedRoute.map((route) => {
      if (
        user &&
        user.permission.some(
          (perm) =>
            perm.page === route.permission.page &&
            perm.actions.includes(route.permission.action),
        )
      ) {
        return route.path;
      }
    });

    return allowedUrls.filter((url): url is string => url !== undefined);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (
    user &&
    !isLoading &&
    isUrlPatternMatched(currentPathname, getAllowedRoutes())
  ) {
    return <Outlet />;
  }

  if (
    !user &&
    !isLoading &&
    !isUrlPatternMatched(currentPathname, getAllowedRoutes())
  ) {
    const redirectToLogin =
      location.pathname !== homeRoute
        ? `/login?returnUrl=${location.pathname}`
        : "/login";

    return <Navigate to={redirectToLogin} />;
  }

  return <NotFoundScreen />;
};

export default ProtectedRoute;
