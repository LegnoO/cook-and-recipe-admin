// ** Library
import { Outlet, Navigate } from "react-router-dom";

// ** Hooks
import { useAuth } from "@/hooks/useAuth";

const AdminRoute = () => {
  const { user } = useAuth();

  return user && user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
