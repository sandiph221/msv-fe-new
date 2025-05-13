import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminRoutes = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Not logged in, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user && (user.role === "admin" || user.role === "super-admin")) {
    return <Outlet />;
  }

  // User is logged in but not an admin, redirect to dashboard
  return <Navigate to="/" replace />;
};

export default AdminRoutes;
