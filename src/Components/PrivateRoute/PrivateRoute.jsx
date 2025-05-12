import { getSubDomain } from "Functions";
import NotPaidDashboard from "Pages/DashboardPage/NotPaidDashboard";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { isAuth, token, user } = useSelector((state) => state.auth);
  const { hasPaid } = useSelector((state) => state.settings);
  const subDomain = getSubDomain();
  const location = useLocation();

  // Not logged in, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin redirects to admin dashboard
  if (isAuth && user && user.role === "super-admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Subdomain with unpaid status
  if (subDomain && !hasPaid) {
    return <NotPaidDashboard hasPaid={false} />;
  }

  // If Component is provided, render it with props
  if (Component) {
    return <Component {...rest} />;
  }

  // Otherwise, render child routes
  return <Outlet />;
};

export default PrivateRoute;
