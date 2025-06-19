import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    FormControl,
    Select,
    MenuItem,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
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
import { Styles } from "../Style";
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

const useStyles = makeStyles((theme) => ({
    ...Styles(theme),
    statsCard: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
            transform: "translateY(-2px)",
        },
    },
    statsGrid: {
        marginBottom: theme.spacing(3),
    },
    statValue: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: theme.palette.primary.main,
        lineHeight: 1.2,
    },
    statLabel: {
        fontSize: "0.875rem",
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.5),
        fontWeight: 500,
    },
    filterContainer: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    filterLabel: {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: theme.palette.text.primary,
    },
    select: {
        minWidth: 120,
        "& .MuiSelect-select": {
            padding: "8px 14px",
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: 8,
        },
    },
    chartContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: theme.spacing(3),
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        minHeight: 400,
    },
    chartTitle: {
        fontSize: "1.25rem",
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary,
    },
    noDataContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    pageTitle: {
        fontSize: "1.75rem",
        fontWeight: 600,
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
    },
    errorContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    errorText: {
        color: theme.palette.error.main,
        textAlign: "center",
    },
}));

const UniqueVisitsToTrial = () => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const sm = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles({ sm, xs });

    const [period, setPeriod] = useState("monthly");
    const [loading, setLoading] = useState(false);
    const [conversionData, setConversionData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    // Demo data for testing (similar structure to API response)
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
                prepareChartData(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch conversion data");
            }
        } catch (error) {
            console.error("Error fetching conversion data:", error);
            setError(error.response?.data?.message || error.message);
            setConversionData(null);
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const prepareChartData = (data) => {
        if (!data || !data.period_breakdown || data.period_breakdown.length === 0) {
            setChartData(null);
            return;
        }

        const labels = data.period_breakdown.map((item) => {
            // Format labels based on period
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

        setChartData({
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
        });
    };

    // Chart options
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

    // Handle period change
    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    // Fetch data on component mount and period change
    useEffect(() => {
        fetchConversionData();
    }, [period]);

    if (loading) {
        return (
            <div className={classes.main}>
                <Container disableGutters maxWidth="xl">
                    <Spinner />
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.main}>
                <div className={classes.errorContainer}>
                    <div>
                        <Typography variant="h6" className={classes.errorText}>
                            Error loading conversion data
                        </Typography>
                        <Typography variant="body2" className={classes.errorText}>
                            {error}
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.main}>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h4" className={classes.pageTitle}>
                        Unique Visits to Trial Conversion
                    </Typography>
                </Grid>
                <Grid item>
                    <div className={classes.filterContainer}>
                        <Typography className={classes.filterLabel}>
                            Period:
                        </Typography>
                        <FormControl className={classes.select} variant="outlined">
                            <Select
                                value={period}
                                onChange={handlePeriodChange}
                                displayEmpty
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </Grid>
            </Grid>

            {conversionData ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <div className={classes.chartContainer}>
                                <Typography className={classes.chartTitle}>
                                    Unique Visits to Trial Conversion Trends
                                </Typography>
                                {chartData ? (
                                    <div style={{ height: "400px" }}>
                                        <Bar data={chartData} options={chartOptions} />
                                    </div>
                                ) : (
                                    <div className={classes.noDataContainer}>
                                        <Typography variant="h6">
                                            {NO_DATA_AVAILABLE}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <div className={classes.noDataContainer}>
                    <Typography variant="h6">
                        {NO_DATA_AVAILABLE}
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default UniqueVisitsToTrial;

