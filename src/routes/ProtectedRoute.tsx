// ** Library
import { Outlet } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuth();
  console.log("🚀 ~ ProtectedRoute ~ user:", user)

  // return user ? <Outlet /> : <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
