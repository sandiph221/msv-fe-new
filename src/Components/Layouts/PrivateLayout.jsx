import { getSubDomain } from "Functions";
import NotPaidDashboard from "Pages/DashboardPage/NotPaidDashboard";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Onboarding from "../Onboarding/Onboarding";
import { LoadLogoAndBanner } from "store/actions/SettingActions";

const PrivateLayout = () => {
    const { isAuth, user } = useSelector((state) => state.auth);
    const { hasPaid, loading: settingsLoading } = useSelector((state) => state.settings);
    const subDomain = getSubDomain();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (subDomain && hasPaid === null) {
            dispatch(LoadLogoAndBanner(subDomain));
        }
    }, [subDomain, hasPaid, dispatch]);

    // Not logged in, redirect to login
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Super admin redirects to admin dashboard
    if (isAuth && user && user.role === "super-admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Show loading while settings are being fetched
    if (subDomain && hasPaid === null && settingsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Subdomain with unpaid status (only after settings have loaded)
    if (subDomain && hasPaid === false) {
        return <NotPaidDashboard />;
    }

    // Check if onboarding is completed
    if (user && !user.onboarding_completed) {
        return <Onboarding />;
    }

    // If onboarding is completed, show the main app
    return <Outlet />;
};

export default PrivateLayout;
