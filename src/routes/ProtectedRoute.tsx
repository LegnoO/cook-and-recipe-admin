// ** Library
import { Outlet, Navigate, useLocation } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user) {
    return <Outlet />;
  }

  const redirectToLogin =
    location.pathname !== "/"
      ? `/login?returnUrl=${location.pathname}`
      : "/login";
  return <Navigate to={redirectToLogin} />;
  // return <Outlet />;
};

export default ProtectedRoute;
