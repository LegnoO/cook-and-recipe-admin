// ** Library
import { Outlet, Navigate } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

const AdminRoute = () => {
  const auth = useAuth();

  return auth.user && auth.user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
