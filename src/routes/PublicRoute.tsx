// ** Library
import { Outlet, Navigate } from "react-router-dom";

// ** Hooks
import useAuth from "@/hooks/useAuth";

// ** Config
import { loginRoute } from "@/config/url";

// ** Components
// import LoadingScreen from "@/components/layouts/LoadingScreen";

const PublicRoute = () => {
  const { user, isLoading } = useAuth();
  // const location = useLocation();

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  if (!user) {
    return <Outlet />;
  }

  if (user && !isLoading) {
    // const redirectToLogin =
    //   location.pathname !== "/"
    //     ? `/login?returnUrl=${location.pathname}`
    //     : "/login";

    return <Navigate to={loginRoute} />;
  }

  // return <Outlet />;
};

export default PublicRoute;
