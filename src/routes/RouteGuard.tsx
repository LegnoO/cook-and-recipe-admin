// ** Library
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

// ** Hooks
import useAuth from "@/hooks/useAuth";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";
import NotFoundScreen from "@/components/layouts/NotFoundScreen";

// ** Config
import { protectedRoute, publicRoute } from "@/config/route-permission";
import { loginRoute } from "@/config/url";

// ** Utils
import { extractPaths } from "@/utils/helpers";

const RouteGuard = () => {
  const { can, user, isLoading } = useAuth();
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  function checkPermissionRoutes(route: Route) {
    if (!route.permission) {
      return true;
    }

    const hasPermission = route.permission
      ? can(route.permission.page, route.permission.action)
      : false;

    if (route.children) {
      return hasPermission && route.children.every(checkPermissionRoutes);
    }

    return hasPermission;
  }

  const permissionPathnames = extractPaths(
    protectedRoute.filter(checkPermissionRoutes),
  );

  const publicPathnames = extractPaths(
    publicRoute.filter(checkPermissionRoutes),
  );

  function matchPatternWithParams(pattern: string) {
    const pathnameSegments = pathname.split("/").slice(1);
    const patternSegments = pattern.split("/").slice(1);

    if (!Object.keys(params).length) return pathname === pattern;

    if (patternSegments.length !== pathnameSegments.length) return false;

    return patternSegments.every((seg, index) => {
      if (seg.startsWith(":")) {
        const paramKey = seg.slice(1);
        return params[paramKey] === pathnameSegments[index];
      }

      return seg === pathnameSegments[index];
    });
  }

  const allowAccessPermissionRoute = [
    ...permissionPathnames,
    ...publicPathnames,
  ].some((pattern) => matchPatternWithParams(pattern));

  if (isLoading && pathname !== "/login") return <LoadingScreen />;

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
