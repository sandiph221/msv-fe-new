import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Footer } from "Components/Footer/Footer";
import PlanDisplay from "Components/Subscription/PlanDisplay";
import { SignOut } from "../../store/actions/AuthAction";
import { formatServerImages } from "utils/functions.js";
import { getSubDomain } from "Functions";
import {
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";
import TrialEndFeedback from "../../Components/TrialEndFeedback/TrialEndFeedback";

export default function NotPaidDashboard() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const [wasLastSubTrial, setWasLastSubTrial] = useState(false);
    const [isTrialCheckLoading, setIsTrialCheckLoading] = useState(true);

    // Redux
    const dispatch = useDispatch();
    const { logoURL } = useSelector((state) => state.settings);

    const isTrialEnded = async () => {
        setIsTrialCheckLoading(true);
        try {
            const subDomain = getSubDomain();
            const response = await axios.get(`/get-subdomain/${subDomain}`);
            const lastSubscription = response?.data?.data;
            const wasLastSubTrial = lastSubscription?.isTrial;
            setWasLastSubTrial(wasLastSubTrial);
        } catch (err) {
            console.log(err);
            setWasLastSubTrial(false);
        } finally {
            setIsTrialCheckLoading(false);
        }
    };

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
        isTrialEnded();
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
        }
    };

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

    const renderContent = () => {
        if (isTrialCheckLoading || isLoading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
                        <p className="text-gray-600 text-sm">Loading...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            );
        }

        if (wasLastSubTrial) {
            return <TrialEndFeedback />;
        }

        return <PlanDisplay onPlanClick={handlePlanChoose} plans={plans} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Compact Modern Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                className="h-7 w-auto"
                                src={formatServerImages(logoURL)}
                                alt="My Social View"
                            />
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={handleUserMenuOpen}
                                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                <AccountCircleIcon fontSize="medium" />
                            </button>

                            {/* User Dropdown Menu */}
                            {userMenuAnchor && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={handleUserMenuClose}
                                    />

                                    {/* Menu */}
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 border border-gray-100">
                                        <div className="py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 rounded-lg mx-1"
                                            >
                                                <ExitToAppIcon fontSize="small" className="text-gray-400" />
                                                <span className="ml-3 font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            {wasLastSubTrial ? 'Your Trial Has Ended' : 'Choose Your Plan'}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                            {wasLastSubTrial
                                ? 'Thank you for trying our service. Please share your feedback and upgrade to continue.'
                                : 'Select a subscription plan to unlock all features and start using the application.'
                            }
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
