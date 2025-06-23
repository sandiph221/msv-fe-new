import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import axios from 'axios';
import { useSelector } from 'react-redux';
import Spinner from '../Spinner';
import FilterDays from '../FilterDays';
import { NO_DATA_AVAILABLE } from '../../utils/constant';

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: theme.spacing(3),
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: theme.spacing(2),
        },
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: 600,
        color: theme.palette.text.primary,
    },
    filterContainer: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            alignSelf: 'flex-end',
        },
    },
    tableContainer: {
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        maxHeight: 600,
        overflow: 'auto',
    },
    tableHeader: {
        backgroundColor: "#f5f5f5",
        "& .MuiTableCell-head": {
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: "0.875rem",
        },
    },
    tableRow: {
        "&:hover": {
            backgroundColor: "#f9f9f9",
        },
        "&:nth-of-type(odd)": {
            backgroundColor: "#fafafa",
        },
    },
    tableCell: {
        fontSize: "0.875rem",
        padding: theme.spacing(1.5),
        borderBottom: "1px solid #e0e0e0",
    },
    featureNameCell: {
        fontWeight: 500,
        color: theme.palette.text.primary,
    },
    routeCell: {
        fontFamily: "monospace",
        fontSize: "0.8rem",
        color: theme.palette.text.secondary,
        maxWidth: 250,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    countCell: {
        fontWeight: 600,
        color: theme.palette.primary.main,
        fontSize: "1rem",
    },
    registeredChip: {
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        color: "#4CAF50",
        fontWeight: 500,
        fontSize: "0.75rem",
        margin: theme.spacing(0.25),
    },
    unregisteredChip: {
        backgroundColor: "rgba(255, 152, 0, 0.1)",
        color: "#FF9800",
        fontWeight: 500,
        fontSize: "0.75rem",
        margin: theme.spacing(0.25),
    },
    noDataContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    errorContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    errorText: {
        color: theme.palette.error.main,
        textAlign: "center",
    },
    summaryContainer: {
        display: "flex",
        gap: theme.spacing(3),
        marginBottom: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            gap: theme.spacing(1),
        },
    },
    summaryItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(1.5),
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        minWidth: 120,
    },
    summaryValue: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: theme.palette.primary.main,
    },
    summaryLabel: {
        fontSize: "0.75rem",
        color: theme.palette.text.secondary,
        textAlign: "center",
    },
    chipContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(0.5),
    },
}));

export default function TrialUserVisitRoutes() {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const sm = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles({ sm, xs });

    const [loading, setLoading] = useState(false);
    const [visitData, setVisitData] = useState(null);
    const [routeData, setRouteData] = useState([]);
    const [error, setError] = useState(null);

    // Get date range from Redux store
    const { customDateRangeRed } = useSelector(
        (state) => state.socialMediaProfileListReducer
    );

    const translateRouteToFeature = (route) => {
        // Remove leading slash and split by slash
        const parts = route.replace(/^\/+/, '').split('/');

        // Capitalize each part and join with spaces
        return parts
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    };

    const processRouteData = (rawData) => {
        if (!rawData || !rawData.rows) return [];

        const routeMap = new Map();

        // Filter out entries without routes (null, undefined, empty string)
        const validVisits = rawData.rows.filter(visit =>
            visit.location &&
            visit.location.trim() !== '' &&
            visit.location !== 'null'
        );

        validVisits.forEach(visit => {
            const route = visit.location;
            const featureName = translateRouteToFeature(route);

            if (!routeMap.has(route)) {
                routeMap.set(route, {
                    route: route,
                    featureName: featureName,
                    totalVisits: 0,
                    registeredVisits: 0,
                    unregisteredVisits: 0,
                    uniqueVisitors: new Set()
                });
            }

            const routeInfo = routeMap.get(route);
            routeInfo.totalVisits += 1;
            routeInfo.uniqueVisitors.add(visit.visitor_id);

            if (visit.is_registered) {
                routeInfo.registeredVisits += 1;
            } else {
                routeInfo.unregisteredVisits += 1;
            }
        });

        // Convert map to array and add unique visitor count
        return Array.from(routeMap.values()).map(route => ({
            ...route,
            uniqueVisitorCount: route.uniqueVisitors.size,
            uniqueVisitors: undefined // Remove the Set object
        })).sort((a, b) => b.totalVisits - a.totalVisits);
    };

    const fetchVisitData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build query parameters based on date range
            let queryParams = '';
            if (customDateRangeRed && customDateRangeRed.length > 0) {
                const { startDate, endDate } = customDateRangeRed[0];
                queryParams = `?startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await axios.get(`/unique-visits${queryParams}`);
            console.log('result is ', response);

            if (response.data.status) {
                setVisitData(response.data.data);
                const processedData = processRouteData(response.data.data);
                setRouteData(processedData);
            } else {
                throw new Error(response.data.message || "Failed to fetch visit data");
            }
        } catch (error) {
            console.error("Error fetching visit data:", error);
            setError(error.response?.data?.message || error.message);
            setVisitData(null);
            setRouteData([]);
        } finally {
            setLoading(false);
        }
    };

    const getSummaryStats = () => {
        if (!routeData.length) return { totalRoutes: 0, totalVisits: 0, uniqueVisitors: 0 };

        const totalRoutes = routeData.length;
        const totalVisits = routeData.reduce((sum, route) => sum + route.totalVisits, 0);
        const allVisitors = new Set();

        // Only count visitors who visited valid routes
        if (visitData && visitData.rows) {
            visitData.rows
                .filter(visit =>
                    visit.location &&
                    visit.location.trim() !== '' &&
                    visit.location !== 'null'
                )
                .forEach(visit => allVisitors.add(visit.visitor_id));
        }

        return {
            totalRoutes,
            totalVisits,
            uniqueVisitors: allVisitors.size
        };
    };

    // Fetch data when component mounts or date range changes
    useEffect(() => {
        fetchVisitData();
    }, [customDateRangeRed]);

    if (loading) {
        return (
            <div className={classes.container}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.container}>
                <div className={classes.errorContainer}>
                    <div>
                        <Typography variant="h6" className={classes.errorText}>
                            Error loading visit data
                        </Typography>
                        <Typography variant="body2" className={classes.errorText}>
                            {error}
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    const summaryStats = getSummaryStats();

    return (
        <div className={classes.container}>
            <div className={classes.headerContainer}>
                <Typography className={classes.title}>
                    Feature Usage Analytics
                </Typography>
                <div className={classes.filterContainer}>
                    <FilterDays xs={xs} />
                </div>
            </div>

            {routeData.length > 0 ? (
                <>
                    <div className={classes.summaryContainer}>
                        <div className={classes.summaryItem}>
                            <Typography className={classes.summaryValue}>
                                {summaryStats.totalRoutes}
                            </Typography>
                            <Typography className={classes.summaryLabel}>
                                Total Features
                            </Typography>
                        </div>
                        <div className={classes.summaryItem}>
                            <Typography className={classes.summaryValue}>
                                {summaryStats.totalVisits}
                            </Typography>
                            <Typography className={classes.summaryLabel}>
                                Total Visits
                            </Typography>
                        </div>
                        <div className={classes.summaryItem}>
                            <Typography className={classes.summaryValue}>
                                {summaryStats.uniqueVisitors}
                            </Typography>
                            <Typography className={classes.summaryLabel}>
                                Unique Visitors
                            </Typography>
                        </div>
                    </div>

                    <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table stickyHeader>
                            <TableHead className={classes.tableHeader}>
                                <TableRow>
                                    <TableCell className={classes.tableCell}>Feature Name</TableCell>
                                    <TableCell className={classes.tableCell}>Route</TableCell>
                                    <TableCell className={classes.tableCell}>Total Visits</TableCell>
                                    <TableCell className={classes.tableCell}>Unique Visitors</TableCell>
                                    <TableCell className={classes.tableCell}>User Types</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routeData.map((route, index) => (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableCell className={`${classes.tableCell} ${classes.featureNameCell}`}>
                                            {route.featureName}
                                        </TableCell>
                                        <TableCell className={`${classes.tableCell} ${classes.routeCell}`}>
                                            {route.route}
                                        </TableCell>
                                        <TableCell className={`${classes.tableCell} ${classes.countCell}`}>
                                            {route.totalVisits}
                                        </TableCell>
                                        <TableCell className={`${classes.tableCell} ${classes.countCell}`}>
                                            {route.uniqueVisitorCount}
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>
                                            <div className={classes.chipContainer}>
                                                {route.registeredVisits > 0 && (
                                                    <Chip
                                                        label={`Registered: ${route.registeredVisits}`}
                                                        size="small"
                                                        className={classes.registeredChip}
                                                    />
                                                )}
                                                {route.unregisteredVisits > 0 && (
                                                    <Chip
                                                        label={`Unregistered: ${route.unregisteredVisits}`}
                                                        size="small"
                                                        className={classes.unregisteredChip}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
}
