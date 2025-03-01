// ** Library Imports
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// ** Hooks
import useAuth from "@/hooks/useAuth";

// ** Components
import NotFoundScreen from "@/components/layouts/NotFoundScreen";

// ** Config
import { protectedRoute, publicRoute } from "@/config/route-permission";
import { loginRoute } from "@/config/url";

// ** Utils
import { extractPaths } from "@/utils/helpers";

const RouteGuard = () => {
  const { can, user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function checkPermissionRoutes(route: Route) {
    if (!route.permission) {
      return true;
    }

    const hasPermission = route.permission
      ? can(route.permission.page, route.permission.action)
      : false;

    if (route.children) {
      return hasPermission && route.children.some(checkPermissionRoutes);
    }

    return hasPermission;
  }

  function filterRoutes(routes: Route[]): Route[] {
    return routes
      .map((route) => {
        const filteredChildren = route.children
          ? filterRoutes(route.children)
          : undefined;

        if (!route.permission) {
          return { ...route, children: filteredChildren };
        }

        if (
          route.permission &&
          can(route.permission.page, route.permission?.action)
        ) {
          return { ...route, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as Route[];
  }

  const permissionPathnames = extractPaths(filterRoutes(protectedRoute));

  const publicPathnames = extractPaths(
    publicRoute.filter(checkPermissionRoutes),
  );

  function matchPatternWithParams(pattern: string) {
    if (!pattern) return false;

    const regexPathPattern = new RegExp(
      "^" + pattern.replace(/:\w+/g, "[^/]+") + "$",
    );
    return regexPathPattern.test(pathname);
  }

  const allowAccessPermissionRoute = [
    ...permissionPathnames,
    ...publicPathnames,
  ].some((pattern) => matchPatternWithParams(pattern));

  if (!user && publicPathnames.includes(pathname)) return <Outlet />;

  if (!allowAccessPermissionRoute) {
    const redirectToLogin =
      pathname !== loginRoute
        ? `${loginRoute}?returnUrl=${pathname}`
        : loginRoute;

    navigate(redirectToLogin);
  }

  if (allowAccessPermissionRoute) {
    return <Outlet />;
  }

  return <NotFoundScreen />;
};

export default RouteGuard;
