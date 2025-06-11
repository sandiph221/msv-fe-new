import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Footer } from "Components/Footer/Footer";
import PlanDisplay from "Components/Subscription/PlanDisplay";
import { SignOut } from "../../store/actions/AuthAction";
import { formatServerImages } from "utils/functions.js";
import {
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";

export default function NotPaidDashboard() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    // Redux
    const dispatch = useDispatch();
    const { logoURL } = useSelector((state) => state.settings);

    const getSubscriptionPlans = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/subscription-plans');
            if (response && response.data) {
                setPlans(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch subscription plans:', error);
            setError('Unable to load subscription plans. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSubscriptionPlans();
    }, []);

    const handlePlanChoose = async (plan) => {
        try {
            const response = await axios.post(`/subscription/${plan.id}`);
            if (response.data.data.url) {
                window.open(response.data.data.url, '_blank');
            }
        } catch (error) {
            console.error('Error selecting plan:', error);
            // You could add a toast notification here for better UX
        }
    };

    // Navbar handlers
    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = async () => {
        handleUserMenuClose();
        try {
            await dispatch(SignOut());
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Simple Navbar */}
            <nav className="bg-white shadow-md">
                <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-16 xl:px-24">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            className="h-8 w-auto"
                            src={formatServerImages(logoURL)}
                            alt="My Social View"
                        />
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={handleUserMenuOpen}
                            className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                            <AccountCircleIcon fontSize="large" />
                        </button>

                        {/* User Dropdown Menu */}
                        {userMenuAnchor && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={handleUserMenuClose}
                                />

                                {/* Menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <ExitToAppIcon fontSize="small" />
                                            <span className="ml-2">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow px-4 py-8 md:px-8 lg:px-16 xl:px-24">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-10">
                        Select a plan to start using the application
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : (
                        <div className="transition-all duration-300 ease-in-out">
                            <PlanDisplay onPlanClick={handlePlanChoose} plans={plans} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
