import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    TableSortLabel,
    withStyles,
} from "@material-ui/core";
import { Delete, Edit, Search } from "@material-ui/icons";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { toast } from "react-toastify";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        padding: theme.spacing(3),
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableHead: {
        backgroundColor: theme.palette.primary.light,
    }, 
    
    tableHeadCell: {
        fontWeight: "bold",
        cursor:"pointer",
    },
    statusActive: {
        color: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
    },
    statusInactive: {
        color: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
    },
    actionButton: {
        marginRight: theme.spacing(1),
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        borderRadius: "8px",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "80vh",
        overflow: "auto",
    },
    invoiceItem: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "4px",
    },
    searchContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
    },
    searchInput: {
        marginRight: theme.spacing(2),
        flex: 1,
    },
    filterContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
        gap: theme.spacing(2),
    },
    filterSelect: {
        minWidth: 200,
    },
}));

const SubdomainSubscriptionAnalytics = () => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [subdomainData, setSubdomainData] = useState({ subdomains: [], totalSubdomains: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [openInvoicesModal, setOpenInvoicesModal] = useState(false);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [selectedSubdomain, setSelectedSubdomain] = useState("");
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("");
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }
    // Helper function for stable sorting
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    // Comparator function for sorting
    function getComparator(order, orderBy) {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // Descending comparator function
    function descendingComparator(a, b, orderBy) {
        let aValue, bValue;

        // Handle nested properties and potential null/undefined values
        if (orderBy === 'ownerEmail') {
            aValue = a.owner?.email || '';
            bValue = b.owner?.email || '';
        } else if (orderBy === 'userCount') {
            aValue = a.user_count || 0;
            bValue = b.user_count || 0;
        } else if (orderBy === 'profilesCount') {
            aValue = a.social_media_profiles?.length || 0;
            bValue = b.social_media_profiles?.length || 0;
        }
        else if (orderBy === 'startDate') {
            // Convert dates to numbers (milliseconds since epoch) for comparison
            aValue = a.subscription?.subscription_starts_at ? new Date(a.subscription.subscription_starts_at).getTime() : 0; // Treat missing date as earlier
            bValue = b.subscription?.subscription_starts_at ? new Date(b.subscription.subscription_starts_at).getTime() : 0; // Treat missing date as earlier
        } else if (orderBy === 'renewDate') {
            // Convert dates to numbers (milliseconds since epoch) for comparison
            aValue = a.subscription?.subscription_ended_at ? new Date(a.subscription.subscription_ended_at).getTime() : 0; // Treat missing date as earlier
            bValue = b.subscription?.subscription_ended_at ? new Date(b.subscription.subscription_ended_at).getTime() : 0; // Treat missing date as earlier
        } else if (orderBy === 'totalRevenue') {
            // Calculate and parse revenue for comparison
            aValue = parseFloat(calculateTotalRevenue(a.invoices)) || 0;
            bValue = parseFloat(calculateTotalRevenue(b.invoices)) || 0;
        }
        else {
            // Default comparison for other columns if needed
            aValue = a[orderBy];
            bValue = b[orderBy];
        }

        if (bValue < aValue) {
            return -1;
        }
        if (bValue > aValue) {
            return 1;
        }
        return 0;
    }


    const getAllPlans = async () => {
        try {
            const subscriptionPlans = await axios.get("/subscription-plans-all");

            if (subscriptionPlans) {
                const a = subscriptionPlans.data.data;
                const parsedData = [];
                a.forEach(plan => {
                    const planName = plan.name;
                    plan.PlanTypePrices.forEach(priceDetails => {
                        const duration = priceDetails.duration;
                        parsedData.push({
                            name: planName,
                            id: priceDetails.id,
                            duration: duration
                        });
                    });
                });
                console.log("Parsed Data:", parsedData);
                setPlans(parsedData);
                return parsedData;
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    useEffect(() => {
        fetchSubdomainData();
        getAllPlans();
    }, []);

    const fetchSubdomainData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/stats/subdomain-analytics");
            if (response.data.status) {
                setSubdomainData(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch data");
                toast.error(response.data.message || "Failed to fetch data");
            }
        } catch (error) {
            setError("An error occurred while fetching data");
            toast.error("An error occurred while fetching data");
            console.error("Error fetching subdomain data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };
    const handleStatusFilterChange = (event) => {
        setSelectedStatus(event.target.value);
        setPage(0);
    }

    const handlePlanFilterChange = (event) => {
        setSelectedPlan(event.target.value);
        setPage(0);
    };

    const handleOpenInvoices = (subdomain, invoices) => {
        setSelectedSubdomain(subdomain);
        setSelectedInvoices(invoices);
        setOpenInvoicesModal(true);
    };

    const handleCloseInvoices = () => {
        setOpenInvoicesModal(false);
    };

   

    const calculateTotalRevenue = (invoices) => {
        if (!invoices || invoices.length === 0) return 0;
        return invoices.reduce((total, invoice) => total + (invoice.amount || 0), 0).toFixed(2);
    };

    // Filter subdomains based on search term and selected plan
    const filteredSubdomains = subdomainData.subdomains
        ? subdomainData.subdomains.filter((item) => {
            // Search filter (subdomain or owner email)
            const searchMatch =
                item.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.owner && item.owner.email && item.owner.email.toLowerCase().includes(searchTerm.toLowerCase()));

            // Plan filter
            const planMatch =
                selectedPlan === "all" ||
                (item.subscription && item.subscription.plan_type_price_id &&
                    item.subscription.plan_type_price_id.toString() === selectedPlan);

            const statusMatch = 
                selectedStatus === "all" ||
                (item.subscription && item.subscription.subscription_is_active && selectedStatus === "active") ||
             (item.subscription && !item.subscription.subscription_is_active && selectedStatus=== "inactive");
            
            return searchMatch && planMatch && statusMatch;
        })
        : [];

    const sortedSubdomains = stableSort(filteredSubdomains,getComparator(order, orderBy))
    
    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, filteredSubdomains.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Typography variant="h4" gutterBottom>
                Subdomain Subscription Analytics
            </Typography>

            <div className={classes.filterContainer}>
                <TextField
                    className={classes.searchInput}
                    variant="outlined"
                    placeholder="Search by subdomain or owner email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: <Search color="action" />,
                    }}
                    size="small"
                />

                <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                    <InputLabel id="plan-filter-label">Filter by Plan</InputLabel>
                    <Select
                        labelId="plan-filter-label"
                        id="plan-filter"
                        value={selectedPlan}
                        onChange={handlePlanFilterChange}
                        label="Filter by Plan"
                    >
                        <MenuItem value="all">All Plans</MenuItem>
                        {plans.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id.toString()}>
                                {plan.name} ({plan.duration})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" className={classes.filterSelect}>
                    <InputLabel id="plan-filter-label">Filter by Status</InputLabel>
                    <Select
                        labelId="plan-filter-label"
                        id="plan-filter"
                        value={selectedStatus}
                        onChange={handleStatusFilterChange}
                        label="Filter by Status"
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        
                            <MenuItem key={"active"} value={"active"}>
                                Active
                            </MenuItem>
                            <MenuItem key={"inactive"} value={"inactive"}>
                                InActive
                            </MenuItem>
                    </Select>
                </FormControl>

            
            </div>

            <Paper className={classes.paper}>
                <TableContainer>
                    <Table className={classes.table} aria-label="subdomain table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.tableHeadCell}>Subdomain</TableCell>
                                <TableCell
                                    className={classes.tableHeadCell}
                                    sortDirection={orderBy === 'ownerEmail' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'ownerEmail'}
                                        direction={orderBy === 'ownerEmail' ? order : 'asc'}
                                        onClick={() => handleRequestSort('ownerEmail')}
                                    >
                                        Owner Email
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    className={classes.tableHeadCell}
                                    sortDirection={orderBy === 'userCount' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'userCount'}
                                        direction={orderBy === 'userCount' ? order : 'asc'}
                                        onClick={() => handleRequestSort('userCount')}
                                    >
                                        User Count
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    className={classes.tableHeadCell}
                                    sortDirection={orderBy === 'profilesCount' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'profilesCount'}
                                        direction={orderBy === 'profilesCount' ? order : 'asc'}
                                        onClick={() => handleRequestSort('profilesCount')}
                                    >
                                        Profiles Count
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.tableHeadCell}>Plan</TableCell>
                                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                                <TableCell className={classes.tableHeadCell}>
                                    <TableSortLabel
                                        active={orderBy === 'startDate'}
                                        direction={orderBy === 'startDate' ? order : 'asc'}
                                        onClick={() => handleRequestSort('startDate')}>
                                    Start Date
                                        </TableSortLabel>
                                
                                </TableCell>
                                <TableCell className={classes.tableHeadCell}>
                                    <TableSortLabel
                                    active={orderBy === 'renewDate'}
                                    direction={orderBy === 'renewDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('renewDate')}>
                                    Renew Date
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.tableHeadCell}>

                                    <TableSortLabel
                                        active={orderBy === 'totalRevenue'}
                                        direction={orderBy === 'totalRevenue' ? order : 'asc'}
                                        onClick={() => handleRequestSort('totalRevenue')}>
                                        Total revenue
                                    </TableSortLabel>


                                </TableCell>
                                <TableCell className={classes.tableHeadCell}>Invoices</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <ErrorOutlineIcon color="error" /> {error}
                                    </TableCell>
                                </TableRow>
                            ) : sortedSubdomains.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        No subdomains found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedSubdomains
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((subdomain, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{subdomain.subdomain}</TableCell>
                                            <TableCell>
                                                {subdomain.owner
                                                    ? subdomain.owner.email
                                                    : "No owner"}
                                            </TableCell>
                                            <TableCell>{subdomain.user_count}</TableCell>
                                            <TableCell>{subdomain?.social_media_profiles?.length}</TableCell>
                                            <TableCell>
                                                {subdomain.subscription
                                                    ? subdomain.subscription.plan_name
                                                    : "No plan"}
                                            </TableCell>
                                         
                                            <TableCell>
                                                {subdomain.subscription ? (
                                                    <span
                                                        className={
                                                            subdomain.subscription.subscription_is_active
                                                                ? classes.statusActive
                                                                : classes.statusInactive
                                                        }
                                                    >
                                                        {subdomain.subscription.subscription_is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {subdomain.subscription
                                                    ? new Date(
                                                        subdomain.subscription.subscription_starts_at
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {subdomain.subscription &&
                                                    subdomain.subscription.subscription_ended_at
                                                    ? new Date(
                                                        subdomain.subscription.subscription_ended_at
                                                    ).toLocaleDateString()
                                                    : "No end date"}
                                            </TableCell>
                                            <TableCell>
                                                ${calculateTotalRevenue(subdomain.invoices)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    className={classes.actionButton}
                                                    onClick={() =>
                                                        handleOpenInvoices(
                                                            subdomain.subdomain,
                                                            subdomain.invoices
                                                        )
                                                    }
                                                    disabled={!subdomain.invoices.length}
                                                >
                                                    Invoices
                                                </Button>
                                            
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={10} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedSubdomains.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            {/* Invoices Modal */}
            <Modal
                open={openInvoicesModal}
                onClose={handleCloseInvoices}
                className={classes.modal}
                aria-labelledby="invoices-modal-title"
            >
                <div className={classes.modalContent}>
                    <Typography id="invoices-modal-title" variant="h5" component="h2" gutterBottom>
                        Invoices for {selectedSubdomain}
                    </Typography>

                    {selectedInvoices.length === 0 ? (
                        <Typography>No invoices available for this subdomain.</Typography>
                    ) : (
                        selectedInvoices.map((invoice, index) => (
                            <div key={index} className={classes.invoiceItem}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Date:</Typography>
                                        <Typography>
                                            {new Date(invoice.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Amount:</Typography>
                                        <Typography>${invoice.amount}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Status:</Typography>
                                        <Typography
                                            style={{
                                                color:
                                                    invoice.status === "completed"
                                                        ? "#4CAF50"
                                                        : "#F44336",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {invoice.status.charAt(0).toUpperCase() +
                                                invoice.status.slice(1)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Payment Date:</Typography>
                                        <Typography>
                                            {new Date(invoice.payment_date).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={invoice.invoice?.invoice_pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={classes.actionButton}
                                                disabled={!invoice.invoice?.invoice_pdf}
                                            >
                                                Download PDF
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                href={invoice.invoice?.hosted_invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                disabled={!invoice.invoice?.hosted_invoice_url}
                                            >
                                                View Online
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </div>
                        ))
                    )}
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button onClick={handleCloseInvoices} color="primary" variant="contained">
                            Close
                        </Button>
                    </Box>
                </div>
            </Modal>
        </div>
    );
};

export default SubdomainSubscriptionAnalytics;

       