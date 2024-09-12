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
  const allowedRoutes = protectedRoute
    .filter((route) =>
      user?.permission.some(
        (perm) =>
          perm.page === route.permission.page &&
          perm.actions.includes(route.permission.action),
      ),
    )
    .map((route) => route.path);
  // function getAllowedRoutes() {
  //   const allowedRoutes = protectedRoute.map((route) => {
  //     if (
  //       user &&
  //       user.permission.some(
  //         (perm) =>
  //           perm.page === route.permission.page &&
  //           perm.actions.includes(route.permission.action),
  //       )
  //     ) {
  //       return route.path;
  //     }
  //   });

  //   return allowedRoutes.filter((url): url is string => url !== undefined);
  // }
  return <Outlet />;
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
