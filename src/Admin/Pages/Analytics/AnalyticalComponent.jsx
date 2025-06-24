import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Layout from "Components/Layout";
import axios from "axios";
import TrialToPaid from "../../../Pages/DashboardPage/UserConversion/TrialToPaid";
import UniqueVisitsToTrial from "../../../Pages/DashboardPage/UserConversion/VisitToTrial";
import TrialUserVisitRoutes from "../../../Components/TrialUsersVisitRoutes/TrialUserVisitRoutes";
import Spinner from "../../../Components/Spinner";

// Separate component for stats card
const StatsCard = ({ value, label, isHovered, onHover, onLeave }) => {
    return (
        <div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            <div className={`text-3xl font-semibold mb-2 transition-colors duration-200 ${isHovered ? 'text-yellow-400' : 'text-yellow-300'
                }`}>
                {value}
            </div>
            <div className="text-sm text-gray-600">
                {label}
            </div>
        </div>
    );
};

// Separate component for role filter
const RoleFilter = ({ selectedRole, onRoleChange }) => {
    return (
        <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="min-w-[150px] h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="customer-admin">Customer Admin</option>
            <option value="customer-viewer">Customer Viewer</option>
        </select>
    );
};

// Separate component for chart container
const ChartContainer = ({ title, children, showFilter = false, filterComponent = null }) => {
    return (
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className={`flex ${showFilter ? 'justify-between items-center' : ''} mb-4`}>
                <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                </h3>
                {showFilter && filterComponent}
            </div>
            <div className="w-full h-96">
                {children}
            </div>
        </div>
    );
};

// Separate component for chart display
const UserGrowthChart = ({ userStats }) => {
    if (!userStats || userStats.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">No user data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="joinedDate"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#FBE281"
                    strokeWidth={2}
                    name="Users"
                    dot={{ fill: '#FBE281', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#FBE281', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Separate component for subscription chart
const SubscriptionChart = ({ subscriptionStats }) => {
    if (!subscriptionStats.subscriptions || subscriptionStats.subscriptions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">No subscription data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subscriptionStats.subscriptions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="planName"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Bar
                    dataKey="count"
                    fill="#FBE281"
                    name="Subscriptions"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Separate component for loading state
const LoadingDisplay = () => {
    return (
        <Layout>
            <div className="px-12 py-8 mt-18">
                <div className="max-w-7xl mx-auto">
                    <Spinner />
                </div>
            </div>
        </Layout>
    );
};

// Separate component for error display
const ErrorDisplay = ({ error }) => {
    return (
        <Layout>
            <div className="px-12 py-8 mt-18">
                <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-red-600 mb-2">
                            Error loading analytics data
                        </h3>
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Custom hook for analytics data
const useAnalyticsData = (selectedRole) => {
    const [userStats, setUserStats] = useState([]);
    const [subscriptionStats, setSubscriptionStats] = useState({
        subscriptions: [],
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to group subscriptions by plan name
    const groupSubscriptionsByPlan = (subscriptions) => {
        const grouped = {};

        subscriptions.forEach(sub => {
            const planName = sub.planName;
            if (grouped[planName]) {
                grouped[planName].count += sub.count;
            } else {
                grouped[planName] = {
                    planName: planName,
                    count: sub.count
                };
            }
        });

        return Object.values(grouped);
    };

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user analytics
                const userResponse = await axios.get(
                    `/stats/user${selectedRole !== "all" ? `?role=${selectedRole}` : ""}`
                );

                // Fetch subscription analytics
                const subscriptionResponse = await axios.get("/stats/subscriptions");

                // Process user data
                if (userResponse.data && userResponse.data.data) {
                    setUserStats(userResponse.data.data);
                } else {
                    setUserStats([]);
                }

                // Process subscription data
                if (subscriptionResponse.data && subscriptionResponse.data.data) {
                    const rawSubscriptions = subscriptionResponse.data.data.subscriptions || [];
                    const groupedSubscriptions = groupSubscriptionsByPlan(rawSubscriptions);

                    setSubscriptionStats({
                        subscriptions: groupedSubscriptions,
                        revenue: subscriptionResponse.data.data.revenue || 0
                    });
                } else {
                    setSubscriptionStats({ subscriptions: [], revenue: 0 });
                }

            } catch (error) {
                console.error("Error fetching analytics data:", error);
                setError(error.response?.data?.message || error.message);
                setUserStats([]);
                setSubscriptionStats({ subscriptions: [], revenue: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [selectedRole]);

    return { userStats, subscriptionStats, loading, error };
};

// Custom hook for stats calculations
const useStatsCalculations = (userStats, subscriptionStats) => {
    const totalUsers = userStats.reduce((acc, curr) => acc + curr.count, 0);
    const totalSubscriptions = subscriptionStats.subscriptions?.reduce(
        (acc, curr) => acc + curr.count,
        0
    ) || 0;
    const totalRevenue = subscriptionStats.revenue || 0;

    return { totalUsers, totalSubscriptions, totalRevenue };
};

// Custom hook for hover states
const useHoverStates = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleCardHover = (cardId) => {
        setHoveredCard(cardId);
    };

    const handleCardLeave = () => {
        setHoveredCard(null);
    };

    return { hoveredCard, handleCardHover, handleCardLeave };
};

// Utility function for currency formatting
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

// Main component
function Analytics() {
    const [selectedRole, setSelectedRole] = useState("super-admin");
    const { userStats, subscriptionStats, loading, error } = useAnalyticsData(selectedRole);
    const { totalUsers, totalSubscriptions, totalRevenue } = useStatsCalculations(userStats, subscriptionStats);
    const { hoveredCard, handleCardHover, handleCardLeave } = useHoverStates();

    const handleRoleChange = (newRole) => {
        setSelectedRole(newRole);
    };

    if (loading) {
        return <LoadingDisplay />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <Layout>
            <div className="px-12 py-8 mt-18">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Analytics Dashboard
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        value={totalUsers.toLocaleString()}
                        label="Total Users"
                        isHovered={hoveredCard === 'users'}
                        onHover={() => handleCardHover('users')}
                        onLeave={handleCardLeave}
                    />
                    <StatsCard
                        value={totalSubscriptions.toLocaleString()}
                        label="Active Subscriptions"
                        isHovered={hoveredCard === 'subscriptions'}
                        onHover={() => handleCardHover('subscriptions')}
                        onLeave={handleCardLeave}
                    />
                    <StatsCard
                        value={formatCurrency(totalRevenue)}
                        label="Total Revenue"
                        isHovered={hoveredCard === 'revenue'}
                        onHover={() => handleCardHover('revenue')}
                        onLeave={handleCardLeave}
                    />
                </div>

                {/* Conversion Components */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <TrialToPaid />
                    <UniqueVisitsToTrial />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartContainer
                        title="User Growth"
                        showFilter={true}
                        filterComponent={
                            <RoleFilter
                                selectedRole={selectedRole}
                                onRoleChange={handleRoleChange}
                            />
                        }
                    >
                        <UserGrowthChart userStats={userStats} />
                    </ChartContainer>

                    <ChartContainer title="Subscription Distribution">
                        <SubscriptionChart subscriptionStats={subscriptionStats} />
                    </ChartContainer>
                </div>

                {/* Trial User Visit Routes */}
                <div className="mb-8">
                    <TrialUserVisitRoutes />
                </div>
            </div>
        </Layout>
    );
}

export default Analytics;
