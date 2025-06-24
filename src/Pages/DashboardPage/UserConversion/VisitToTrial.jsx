import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Spinner from "../../../Components/Spinner";
import { NO_DATA_AVAILABLE } from "../../../utils/constant";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Separate component for period filter
const PeriodFilter = ({ period, onPeriodChange }) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">
                Period:
            </label>
            <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="min-w-[120px] px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
            </select>
        </div>
    );
};

// Separate component for chart container
const ChartContainer = ({ title, children, showFilter = false, filterComponent = null }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 min-h-[400px]">
            <div className={`flex ${showFilter ? 'justify-between items-center' : ''} mb-6`}>
                <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                </h3>
                {showFilter && filterComponent}
            </div>
            {children}
        </div>
    );
};

// Separate component for chart display
const ConversionChart = ({ chartData, chartOptions }) => {
    if (!chartData) {
        return (
            <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">{NO_DATA_AVAILABLE}</p>
            </div>
        );
    }

    return (
        <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

// Separate component for error display
const ErrorDisplay = ({ error }) => {
    return (
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
                <h3 className="text-lg font-medium text-red-600 mb-2">
                    Error loading conversion data
                </h3>
                <p className="text-sm text-red-500">
                    {error}
                </p>
            </div>
        </div>
    );
};

// Separate component for no data display
const NoDataDisplay = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">{NO_DATA_AVAILABLE}</p>
        </div>
    );
};

// Separate component for loading state
const LoadingDisplay = () => {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto">
                <Spinner />
            </div>
        </div>
    );
};

// Custom hook for chart data preparation
const useChartData = (period) => {
    const prepareChartData = (data) => {
        if (!data || !data.period_breakdown || data.period_breakdown.length === 0) {
            return null;
        }

        const labels = data.period_breakdown.map((item) => {
            switch (period) {
                case "daily":
                    return new Date(item.period).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                case "monthly":
                    const [year, month] = item.period.split("-");
                    return new Date(year, month - 1).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                    });
                case "yearly":
                    return item.period;
                default:
                    return item.period;
            }
        });

        const uniqueVisitors = data.period_breakdown.map((item) => item.unique_visitors);
        const trialSignups = data.period_breakdown.map((item) => item.trial_signups);
        const conversionRates = data.period_breakdown.map((item) =>
            parseFloat(item.visit_to_trial_rate.replace("%", ""))
        );

        return {
            labels,
            datasets: [
                {
                    label: "Unique Visitors",
                    data: uniqueVisitors,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                    yAxisID: "y",
                },
                {
                    label: "Trial Signups",
                    data: trialSignups,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    yAxisID: "y",
                },
                {
                    label: "Conversion Rate (%)",
                    data: conversionRates,
                    type: "line",
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    yAxisID: "y1",
                    tension: 0.4,
                    fill: false,
                },
            ],
        };
    };

    return { prepareChartData };
};

// Custom hook for chart options
const useChartOptions = () => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (context.dataset.yAxisID === "y1") {
                            label += context.parsed.y + "%";
                        } else {
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Period",
                    font: {
                        size: 12,
                        weight: "bold",
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                    display: true,
                    text: "Number of Visitors/Signups",
                    font: {
                        size: 12,
                        weight: "bold",
                    },
                },
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();
                    },
                },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                    display: true,
                    text: "Conversion Rate (%)",
                    font: {
                        size: 12,
                        weight: "bold",
                    },
                },
                beginAtZero: true,
                max: 20,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value) {
                        return value + "%";
                    },
                },
            },
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
    };

    return chartOptions;
};

// Custom hook for API data fetching
const useConversionData = (period) => {
    const [loading, setLoading] = useState(false);
    const [conversionData, setConversionData] = useState(null);
    const [error, setError] = useState(null);

    // Demo data for testing (same as original)
    const demoData = {
        status: true,
        data: {
            overall_stats: {
                total_unique_visitors: 15420,
                total_visits: 28750,
                total_trial_signups: 1250,
                overall_conversion_rate: "8.11%",
                total_revenue: 28050,
                average_revenue_per_visitor: 1.82,
                average_visits_per_visitor: 1.86
            },
            period_breakdown: [
                {
                    period: "2024-01",
                    unique_visitors: 1850,
                    total_visits: 3420,
                    trial_signups: 145,
                    visit_to_trial_rate: "7.84%",
                    revenue: 3298,
                    revenue_per_visitor: 1.78,
                    average_revenue_per_trial: 22.74
                },
                {
                    period: "2024-02",
                    unique_visitors: 1720,
                    total_visits: 3180,
                    trial_signups: 132,
                    visit_to_trial_rate: "7.67%",
                    revenue: 2694,
                    revenue_per_visitor: 1.57,
                    average_revenue_per_trial: 20.41
                },
                {
                    period: "2024-03",
                    unique_visitors: 2100,
                    total_visits: 3890,
                    trial_signups: 167,
                    visit_to_trial_rate: "7.95%",
                    revenue: 4186,
                    revenue_per_visitor: 1.99,
                    average_revenue_per_trial: 25.07
                },
                {
                    period: "2024-04",
                    unique_visitors: 2250,
                    total_visits: 4200,
                    trial_signups: 189,
                    visit_to_trial_rate: "8.40%",
                    revenue: 3745,
                    revenue_per_visitor: 1.66,
                    average_revenue_per_trial: 19.81
                },
                {
                    period: "2024-05",
                    unique_visitors: 1980,
                    total_visits: 3650,
                    trial_signups: 156,
                    visit_to_trial_rate: "7.88%",
                    revenue: 3588,
                    revenue_per_visitor: 1.81,
                    average_revenue_per_trial: 23.00
                },
                {
                    period: "2024-06",
                    unique_visitors: 2150,
                    total_visits: 4100,
                    trial_signups: 178,
                    visit_to_trial_rate: "8.28%",
                    revenue: 4637,
                    revenue_per_visitor: 2.16,
                    average_revenue_per_trial: 26.05
                },
                {
                    period: "2024-07",
                    unique_visitors: 1870,
                    total_visits: 3480,
                    trial_signups: 143,
                    visit_to_trial_rate: "7.65%",
                    revenue: 2843,
                    revenue_per_visitor: 1.52,
                    average_revenue_per_trial: 19.88
                },
                {
                    period: "2024-08",
                    unique_visitors: 1500,
                    total_visits: 2830,
                    trial_signups: 140,
                    visit_to_trial_rate: "9.33%",
                    revenue: 2990,
                    revenue_per_visitor: 1.99,
                    average_revenue_per_trial: 21.36
                }
            ]
        }
    };

    const fetchConversionData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/visits-to-trial?period=${period}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            // const response = {data: demoData}
            if (response.data.status) {
                setConversionData(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch conversion data");
            }
        } catch (error) {
            console.error("Error fetching conversion data:", error);
            setError(error.response?.data?.message || error.message);
            setConversionData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversionData();
    }, [period]);

    return { loading, conversionData, error, fetchConversionData };
};

// Main component
const UniqueVisitsToTrial = () => {
    const [period, setPeriod] = useState("monthly");
    const [chartData, setChartData] = useState(null);

    const { loading, conversionData, error } = useConversionData(period);
    const { prepareChartData } = useChartData(period);
    const chartOptions = useChartOptions();

    // Update chart data when conversion data changes
    useEffect(() => {
        if (conversionData) {
            const newChartData = prepareChartData(conversionData);
            setChartData(newChartData);
        } else {
            setChartData(null);
        }
    }, [conversionData, period]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    if (loading) {
        return <LoadingDisplay />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    return (
        <div className="w-full">
            {conversionData ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-1">
                        <ChartContainer
                            title="Unique Visits to Trial Conversion Trends"
                            showFilter={true}
                            filterComponent={
                                <PeriodFilter
                                    period={period}
                                    onPeriodChange={handlePeriodChange}
                                />
                            }
                        >
                            <ConversionChart
                                chartData={chartData}
                                chartOptions={chartOptions}
                            />
                        </ChartContainer>
                    </div>
                </div>
            ) : (
                <NoDataDisplay />
            )}
        </div>
    );
};

export default UniqueVisitsToTrial;
     