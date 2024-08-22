// ** Library
import { Outlet, Navigate, useLocation } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

// ** Components
import LoadingScreen from "@/components/layouts/LoadingScreen";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    console.log("LoadingScreen");
    return <LoadingScreen />;
  }

  if (user && !isLoading) {
    console.log("Outlet");
    return <Outlet />;
  }

  if (!user && !isLoading) {
    const redirectToLogin =
      location.pathname !== "/"
        ? `/login?returnUrl=${location.pathname}`
        : "/login";

    return <Navigate to={redirectToLogin} />;
  }

  // return <Outlet />;
};

export default ProtectedRoute;
