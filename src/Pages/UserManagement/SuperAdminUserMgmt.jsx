import {
    Container,
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Delete, Edit } from "@material-ui/icons";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Alert from "../../Components/AlertBox/Alert";
import Spinner from "../../Components/Spinner";
import {
    DeleteCustomer,
    GetCustomer,
    PaginateCustomer,
    SearchCustomer,
} from "../../store/actions/CustomersAction";
import AddUserComponent from "./AddUserComponent";
import EditUserComponent from "./EditUserComponent";
import "./Styles/style.css";

// Styles definition
const Styles = (theme) => ({
    main: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(14),
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

const useStyles = makeStyles((theme) => Styles(theme));

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
            return parsedData;
        }
    } catch (error) {
        console.error("Error fetching plans:", error);
        return [];
    }
}

const SuperAdminUserManagement = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userAddedAlertOpen, setUserAddedAlertOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [selectedRole, setSelectedRole] = useState("super-admin");

    // Plan filter states
    const [planTypes, setPlanTypes] = useState([]);
    const [frequencies, setFrequencies] = useState([]);
    const [selectedPlanType, setSelectedPlanType] = useState("all");
    const [selectedFrequency, setSelectedFrequency] = useState("all");
    const [priceIds, setPriceIds] = useState([]);
    const [plansData, setPlansData] = useState([]);

    const { customers, getCustomersLoading } = useSelector((state) => state.customerInfo);

    // Table columns definition
    const columns = [
        { id: "first_name", label: "First Name", minWidth: 120 },
        { id: "last_name", label: "Last Name", minWidth: 120 },
        { id: "email", label: "Email", minWidth: 170 },
        { id: "position", label: "Position", minWidth: 120 },
        {
            id: "subdomain",
            label: "Subdomain",
            minWidth: 120,
            format: (value) => value.CustomerSubdomain ? value.CustomerSubdomain.subdomain : 'N/A',
        },
        { id: "action", label: "Action", minWidth: 80, align: "right" },
    ];

    // Fetch plans data on component mount
    useEffect(() => {
        const fetchPlans = async () => {
            const plans = await getAllPlans();
            setPlansData(plans || []);

            // Extract unique plan types and frequencies
            const uniquePlanTypes = [...new Set(plans.map(plan => plan.name))];
            const uniqueFrequencies = [...new Set(plans.map(plan => plan.duration))];

            setPlanTypes(uniquePlanTypes);
            setFrequencies(uniqueFrequencies);
        };

        fetchPlans();
    }, []);

    // Update priceIds when plan type or frequency changes
    useEffect(() => {
        if (!plansData.length) return;

        let filteredPriceIds = [];

        // Case 1: Specific plan type and All frequencies
        if (selectedPlanType !== "all" && selectedFrequency === "all") {
            filteredPriceIds = plansData
                .filter(plan => plan.name === selectedPlanType && plan.id !== null)
                .map(plan => plan.id);
        }
        // Case 2: All plan types and specific frequency
        else if (selectedPlanType === "all" && selectedFrequency !== "all") {
            filteredPriceIds = plansData
                .filter(plan => plan.duration === selectedFrequency && plan.id !== null)
                .map(plan => plan.id);
        }
        // Case 3: Specific plan type and specific frequency
        else if (selectedPlanType !== "all" && selectedFrequency !== "all") {
            const matchingPlan = plansData.find(
                plan => plan.name === selectedPlanType && plan.duration === selectedFrequency
            );
            if (matchingPlan && matchingPlan.id !== null) {
                filteredPriceIds = [matchingPlan.id];
            }
        }
        // Case 4: All plan types and All frequencies - no filtering needed
        else if (selectedPlanType === "all" && selectedFrequency === "all") {
            filteredPriceIds = plansData
                .filter(plan => plan.id !== null)
                .map(plan => plan.id);
        }
        setPriceIds(filteredPriceIds);
    }, [selectedPlanType, selectedFrequency, plansData]);

    // Add useEffect for debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSearchCustomers(searchQuery, selectedRole, priceIds);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, page, selectedRole, priceIds]);

    // API calls
    async function fetchSearchCustomers(query, role, priceIds) {
        await dispatch(SearchCustomer(page, query, role, priceIds));
    }

    // Event handlers
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePlanTypeChange = (e) => {
        setSelectedPlanType(e.target.value);
    };

    const handleFrequencyChange = (e) => {
        setSelectedFrequency(e.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleAddModalOpen = () => {
        setAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setAddModalOpen(false);
    };

    const handleEditModalOpen = (row) => {
        setEditData(row);
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setEditData({});
    };

    const handleEdit = () => {
        handleEditModalOpen(selectedRow);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await dispatch(DeleteCustomer(selectedRow.id));
                handleMenuClose();
                setDeleteAlertOpen(false);
                toast.success("User deleted successfully");
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Check your internet connection");
                }
            }
        }
    };

    const deleteUser = () => {
        setDeleteAlertOpen(true);
        setItemToDelete(selectedRow);
    };

    const handleUserAdded = (message) => {
        setUserAddedAlertOpen(true);
        setResponseMessage(message);
        toast.success(message);
    };

    const handleUserUpdated = (message) => {
        setUserAddedAlertOpen(true);
        setResponseMessage(message);
        toast.success(message);
    };

    return (
        <Layout>
            <div className={classes.main}>
                <div style={{ padding: 10 }} className="dashboardPageContainer">
                    <Container disableGutters maxWidth="xl">
                        <p className="font-bold text-lg">User Management Table</p>

                        <div className="space-y-4">
                            {/* Add User Button - positioned on the right */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddModalOpen}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#edb548] text-white font-medium shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 transition-colors"
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Add User
                                </button>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                                <div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-72 px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Search by name, email, subdomain..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Role</label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="super-admin">Super Admin</option>
                                        <option value="customer-admin">Customer Admin</option>
                                        <option value="customer-viewer">Customer Viewer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Plan Type</label>
                                    <select
                                        value={selectedPlanType}
                                        onChange={handlePlanTypeChange}
                                        className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Plans</option>
                                        {planTypes.map((planType) => (
                                            <option key={planType} value={planType}>
                                                {planType}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                                    <select
                                        value={selectedFrequency}
                                        onChange={handleFrequencyChange}
                                        className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Frequencies</option>
                                        {frequencies.map((frequency) => (
                                            <option key={frequency} value={frequency}>
                                                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <Grid container>
                            {getCustomersLoading ? (
                                <Spinner />
                            ) : (
                                <Paper className={classes.root}>
                                    <TableContainer className={classes.container}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {customers?.users
                                                    && priceIds.length > 0 &&
                                                    customers.users.slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                        .map((row) => (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={row.id}
                                                            >
                                                                {columns.map((column) => {
                                                                    const value =
                                                                        column.id === "subdomain"
                                                                            ? column.format(row)
                                                                            : row[column.id];

                                                                    return (
                                                                        <TableCell
                                                                            key={column.id}
                                                                            align={column.align}
                                                                        >
                                                                            {column.id === "action" ? (
                                                                                <IconButton
                                                                                    onClick={(event) =>
                                                                                        handleMenuOpen(event, row)
                                                                                    }
                                                                                >
                                                                                    <MoreVertIcon />
                                                                                </IconButton>
                                                                            ) : column.format &&
                                                                                typeof value === "number" ? (
                                                                                column.format(value)
                                                                            ) : (
                                                                                value
                                                                            )}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        ))}
                                            </TableBody>
                                        </Table>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleEdit}>
                                                <Edit color="primary" style={{ marginRight: 10 }} /> Edit
                                            </MenuItem>
                                            <MenuItem onClick={deleteUser}>
                                                <Delete color="secondary" style={{ marginRight: 10 }} /> Delete
                                            </MenuItem>
                                        </Menu>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={customers?.users?.length || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            )}

                            {/* Delete Confirmation Alert */}
                            <Alert
                                alert={selectedRow}
                                icon={
                                    <ErrorOutlineIcon
                                        style={{
                                            fontSize: "5rem",
                                            color: "#f50057",
                                            paddingBottom: 0,
                                        }}
                                    />
                                }
                                title="Are you sure?"
                                confirmBtn="DELETE"
                                description="You're about to Delete the profile. This process cannot be undone."
                                open={deleteAlertOpen}
                                setOpen={setDeleteAlertOpen}
                                onConfirm={handleDelete}
                                buttonbgcolor="#f50057"
                            />
                        </Grid>
                    </Container>
                </div>
            </div>

            {/* Add User Modal */}
            <AddUserComponent
                open={addModalOpen}
                onClose={handleAddModalClose}
                onUserAdded={handleUserAdded}
            />

            {/* Edit User Modal */}
            <EditUserComponent
                open={editModalOpen}
                onClose={handleEditModalClose}
                editData={editData}
                onUserUpdated={handleUserUpdated}
            />
        </Layout>
    );
};

const mapDispatchToProps = {
    DeleteCustomer,
    SearchCustomer
};

export default connect(null, mapDispatchToProps)(SuperAdminUserManagement);
