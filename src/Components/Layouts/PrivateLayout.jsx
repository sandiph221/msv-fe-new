import { getSubDomain } from "Functions";
import NotPaidDashboard from "Pages/DashboardPage/NotPaidDashboard";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Onboarding from "../Onboarding/Onboarding";

const PrivateLayout = () => {
    const { isAuth, user } = useSelector((state) => state.auth);
    const subDomain = getSubDomain();
    const { hasPaid } = useSelector((state) => state.settings);
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

    // Check if onboarding is completed
    if (user && !user.onboarding_completed) {
        return <Onboarding />;
    }

    // If onboarding is completed, show the main app
    return <Outlet />;
};

export default PrivateLayout;
