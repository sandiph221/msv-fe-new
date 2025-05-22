import {
    Box,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    Select,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    withStyles,
    FormControl,
    InputLabel,
    Chip,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { Delete, Edit, Search } from "@material-ui/icons";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Buttons from "Components/Buttons/Buttons";
import UploadImg from "Components/UploadImg";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Alert from "../../Components/AlertBox/Alert";
import Spinner from "../../Components/Spinner";
import {
    CreateCustomer,
    DeleteCustomer,
    GetCustomer,
    PaginateCustomer,
    SearchCustomer,
    UpdateCustomer,
} from "../../store/actions/CustomersAction";
import * as constant from "../../utils/constant";
import "./Styles/style.css";

// Styles definition
const Styles = (theme) => ({
    main: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(14),
    },
    topFilter: {
        marginBottom: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    searchField: {
        width: "300px",
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    userManagementForm: {
        marginTop: theme.spacing(3),
    },
    inputField: {
        width: '100%',
    },
    fileUploadConatiner: {
        marginTop: theme.spacing(2),
    },
    imgError: {
        color: theme.palette.error.main,
        fontSize: '0.75rem',
        marginTop: theme.spacing(0.5),
    },
    filterSelect: {
        minWidth: 150,
        marginLeft: theme.spacing(1),
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    priceIdChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        maxWidth: 400,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
});

const useStyles = makeStyles((theme) => Styles(theme));

const getAllPlans = async () => {
    console.log("Fetching all subscription plans...");
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

const StyledTextField = withStyles({
    root: {
        borderRadius: 15,
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderRadius: 12,
            },
        },
    },
})(TextField);

const SuperAdminUserManagement = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [userFormSubmitting, setUserFormSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        id: "",
        brandName: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        logo: "",
        featured_image: "",
        userAccountsLimt: "",
        socialMediaProfilesLimt: "",
        role: constant.CUSTOMER_ADMIN_NAME,
    });
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editData, setEditData] = useState({});
    const [refreshImgUploadComponent, setRefreshImgUploadComponent] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userAddedAlertOpen, setUserAddedAlertOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("super-admin");

    // New state for plan filters
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
            //loop through all plans and get all price ids
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

        }, 500); // Debounce for 500ms

        // Cleanup function to clear the timer if searchQuery changes
        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, page, selectedRole, priceIds]); // Rerun effect when searchQuery, page, selectedRole, or priceIds changes

    // Update form values when editing a user
    useEffect(() => {
        if (Object.keys(editData).length !== 0) {
            setFormValues({
                id: editData.id,
                brandName: editData.CustomerSubdomain ? editData.CustomerSubdomain.subdomain : "",
                firstName: editData.first_name,
                lastName: editData.last_name,
                email: editData.email,
                phoneNumber: editData.contact_number,
                logo: editData.CustomerSubdomain ? editData.CustomerSubdomain.logo : "",
                featured_image: editData.CustomerSubdomain ? editData.CustomerSubdomain.feature_image : "",
                userAccountsLimt: editData.CustomerSubdomain ? editData.CustomerSubdomain.user_accounts_limit : "",
                socialMediaProfilesLimt: editData.CustomerSubdomain ? editData.CustomerSubdomain.social_media_profiles_limit : "",
                role: editData.role,
            });
            setValidationErrors({});
        } else {
            resetCustomerForm();
        }
    }, [editData]);

    // API calls
    async function fetchCustomers() {
        await dispatch(GetCustomer());
    }

    async function fetchNewCustomers(page) {
        await dispatch(PaginateCustomer(page));
    }

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

    const handleModalOpen = (row = {}) => {
        setEditData(row);
        setFormValues(row);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditData({});
        resetCustomerForm();
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const inputValue = name === "logo" || name === "featured_image" ? files[0] : value;

        setFormValues((prevState) => ({
            ...prevState,
            [name]: inputValue,
        }));
    };

    const handleEdit = () => {
        handleModalOpen(selectedRow);
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await dispatch(DeleteCustomer(selectedRow.id));
                resetCustomerForm();
                setEditData({});
                handleMenuClose();
                setDeleteAlertOpen(false);
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

    const handleCancel = () => {
        resetCustomerForm();
        setEditData({});
        setErrors({});
        setValidationErrors({});
        handleModalClose();
    };

    // Form handling
    const resetCustomerForm = () => {
        setFormValues({
            brandName: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            logo: "",
            featured_image: "",
            userAccountsLimt: "",
            socialMediaProfilesLimt: "",
            role: constant.CUSTOMER_ADMIN_NAME,
        });
    };

    const validateForm = () => {
        const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const imageExtensions = /\.(jpe?g|png|gif|bmp)$/i;
        let formErrors = {};

        // Basic validations
        if (!formValues.brandName) formErrors.brandName = "Sub Domain is Required";
        if (!formValues.firstName) formErrors.firstName = "First Name is Required";
        if (!formValues.lastName) formErrors.lastName = "Last Name is Required";

        if (!formValues.email) {
            formErrors.email = "Email is Required";
        } else if (!new RegExp(constant.EMAIL_PATTERN).test(formValues.email)) {
            formErrors.email = "Please enter valid email-ID.";
        }

        if (!formValues.phoneNumber) {
            formErrors.phoneNumber = "Contact Number is Required";
        } else if (isNaN(formValues.phoneNumber) || specialCharacters.test(formValues.phoneNumber)) {
            formErrors.phoneNumber = "Contact Number must be a valid number";
        }

        if (!formValues.userAccountsLimt) {
            formErrors.userAccountsLimt = "Account limit is Required";
        } else if (isNaN(formValues.userAccountsLimt) || formValues.userAccountsLimt === "0" ||
            specialCharacters.test(formValues.userAccountsLimt)) {
            formErrors.userAccountsLimt = "Account limit must be a valid number greater than 0";
        }

        if (!formValues.socialMediaProfilesLimt) {
            formErrors.socialMediaProfilesLimt = "Social Media Profile limit is Required";
        } else if (isNaN(formValues.socialMediaProfilesLimt) || formValues.socialMediaProfilesLimt === "0" ||
            specialCharacters.test(formValues.socialMediaProfilesLimt)) {
            formErrors.socialMediaProfilesLimt = "Social Media Profile limit must be a valid number greater than 0";
        }

        // File validations
        if (Object.keys(editData).length === 0) {
            if (!formValues.logo) {
                formErrors.logo = "Logo is Required";
            } else if (formValues.logo.name && !imageExtensions.test(formValues.logo.name)) {
                formErrors.logo = "Image must be valid image file.";
            }

            if (!formValues.featured_image) {
                formErrors.featured_image = "Brand banner image is Required";
            } else if (formValues.featured_image.name && !imageExtensions.test(formValues.featured_image.name)) {
                formErrors.featured_image = "Image must be valid image file.";
            }
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setUserFormSubmitting(true);

        try {
            let response;
            if (Object.keys(editData).length === 0) {
                // Creating customer
                response = await dispatch(CreateCustomer(formValues));
            } else {
                // Updating customer
                response = await dispatch(
                    UpdateCustomer({
                        ...formValues,
                        id: editData.id,
                        active: editData.active,
                    })
                );
            }

            setUserAddedAlertOpen(true);
            setResponseMessage(response.data.message);
            resetCustomerForm();
            setRefreshImgUploadComponent(true);
            setValidationErrors({});
            handleModalClose();
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
                const errorMsg = error.response.data.message;
                setValidationErrors(errorMsg);
            } else {
                toast.error("Check your internet connection");
            }
        } finally {
            setUserFormSubmitting(false);
        }
    };

    // Image handlers
    const logoImageHandler = (item) => {
        setFormValues((prevState) => ({
            ...prevState,
            logo: item,
        }));
    };

    const bannerImageHandler = (item) => {
        setFormValues((prevState) => ({
            ...prevState,
            featured_image: item,
        }));
    };

    // Helper function to truncate price IDs for display
    const truncatePriceId = (priceId) => {
        if (!priceId) return '';
        if (priceId.length <= 12) return priceId;
        return `${priceId.substring(0, 6)}...${priceId.substring(priceId.length - 6)}`;
    };

    return (
        <Layout>
            <div className={classes.main}>
                <div style={{ padding: 10 }} className="dashboardPageContainer">
                    <Container disableGutters maxWidth="xl">
                        <Grid className={classes.topFilter}>
                            <Buttons
                                variant="contained"
                                color="primary"
                                onClick={() => handleModalOpen()}
                                style={{ marginBottom: "16px", marginRight: "16px" }}
                            >
                                Add User
                            </Buttons>

                            {/* Search and Filter Section */}
                            <Grid container spacing={1} alignItems="center" className={classes.filterContainer}>
                                <Grid item>
                                    <StyledTextField
                                        className={classes.searchField}
                                        variant="outlined"
                                        placeholder="Search by name, email, subdomain..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton>
                                                    <Search />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item>
                                    <FormControl variant="outlined" className={classes.filterSelect} size="small">
                                        <InputLabel id="role-select-label">Role</InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            label="Role"
                                        >
                                            <MenuItem value="all">All Roles</MenuItem>
                                            <MenuItem value="super-admin">Super Admin</MenuItem>
                                            <MenuItem value="customer-admin">Customer Admin</MenuItem>
                                            <MenuItem value="customer-viewer">Customer Viewer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item>
                                    <FormControl variant="outlined" className={classes.filterSelect} size="small">
                                        <InputLabel id="plan-type-select-label">Plan Type</InputLabel>
                                        <Select
                                            labelId="plan-type-select-label"
                                            value={selectedPlanType}
                                            onChange={handlePlanTypeChange}
                                            label="Plan Type"
                                        >
                                            <MenuItem value="all">All Plans</MenuItem>
                                            {planTypes.map((planType) => (
                                                <MenuItem key={planType} value={planType}>
                                                    {planType}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item>
                                    <FormControl variant="outlined" className={classes.filterSelect} size="small">
                                        <InputLabel id="frequency-select-label">Frequency</InputLabel>
                                        <Select
                                            labelId="frequency-select-label"
                                            value={selectedFrequency}
                                            onChange={handleFrequencyChange}
                                            label="Frequency"
                                        >
                                            <MenuItem value="all">All Frequencies</MenuItem>
                                            {frequencies.map((frequency) => (
                                                <MenuItem key={frequency} value={frequency}>
                                                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                

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

            {/* User Form Modal */}
            <Modal
                style={{ overflow: "scroll", maxWidth: "100%" }}
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="user-modal-title"
                aria-describedby="user-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxWidth: "1000px",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        height: "calc(100vh - 100px)",
                        overflow: "auto",
                        borderRadius: 8,
                    }}
                >
                    <Typography variant="h6" id="user-modal-title">
                        {Object.keys(editData).length ? "Edit User" : "Add User"}
                    </Typography>

                    <form className={classes.userManagementForm} onSubmit={onSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="brandName"
                                    label="Sub Domain*"
                                    variant="outlined"
                                    error={errors.brandName || validationErrors.subdomain}
                                    helperText={
                                        errors.brandName ||
                                        (validationErrors.subdomain && validationErrors.subdomain.message)
                                    }
                                    value={formValues.brandName || ""}
                                    name="brandName"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="firstName"
                                    label="First Name*"
                                    variant="outlined"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    value={formValues.firstName || ""}
                                    name="firstName"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="lastName"
                                    label="Last Name*"
                                    variant="outlined"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    value={formValues.lastName || ""}
                                    name="lastName"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="email"
                                    label="Email*"
                                    variant="outlined"
                                    error={!!errors.email || !!validationErrors.email}
                                    helperText={
                                        errors.email ||
                                        (validationErrors.email && validationErrors.email.message)
                                    }
                                    value={formValues.email || ""}
                                    name="email"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="phoneNumber"
                                    label="Phone Number*"
                                    variant="outlined"
                                    error={!!errors.phoneNumber || !!validationErrors.contact_number}
                                    helperText={
                                        errors.phoneNumber ||
                                        (validationErrors.contact_number && validationErrors.contact_number.message)
                                    }
                                    value={formValues.phoneNumber || ""}
                                    name="phoneNumber"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="userAccountsLimt"
                                    label="No. of Account Limit*"
                                    variant="outlined"
                                    error={!!errors.userAccountsLimt || !!validationErrors.user_accounts_limit}
                                    helperText={
                                        errors.userAccountsLimt ||
                                        (validationErrors.user_accounts_limit && validationErrors.user_accounts_limit.message)
                                    }
                                    value={formValues.userAccountsLimt || ""}
                                    name="userAccountsLimt"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="socialMediaProfilesLimt"
                                    label="No. of Social Media Profile Limit*"
                                    variant="outlined"
                                    error={!!errors.socialMediaProfilesLimt || !!validationErrors.social_media_profiles_limit}
                                    helperText={
                                        errors.socialMediaProfilesLimt ||
                                        (validationErrors.social_media_profiles_limit && validationErrors.social_media_profiles_limit.message)
                                    }
                                    value={formValues.socialMediaProfilesLimt || ""}
                                    name="socialMediaProfilesLimt"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} className={classes.fileUploadConatiner}>
                            <Grid item xs={12} md={6}>
                                <UploadImg
                                    id="upload-logo"
                                    title="Upload Logo"
                                    name="logo"
                                    defaultImg={
                                        editData.CustomerSubdomain
                                            ? editData.CustomerSubdomain.logo
                                            : ""
                                    }
                                    getSelectedData={logoImageHandler}
                                    refresh={refreshImgUploadComponent}
                                    setRefreshImgUploadComponent={setRefreshImgUploadComponent}
                                />
                                <Typography className={classes.imgError}>
                                    {errors.logo ||
                                        (validationErrors.logo && validationErrors.logo.message) ||
                                        (validationErrors.brand_logo_size && validationErrors.brand_logo_size)}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <UploadImg
                                    id="upload-banner"
                                    title="Upload Banner"
                                    name="featured_image"
                                    defaultImg={
                                        editData.CustomerSubdomain
                                            ? editData.CustomerSubdomain.feature_image
                                            : ""
                                    }
                                    getSelectedData={bannerImageHandler}
                                    refresh={refreshImgUploadComponent}
                                    setRefreshImgUploadComponent={setRefreshImgUploadComponent}
                                />
                                <Typography className={classes.imgError}>
                                    {errors.featured_image ||
                                        (validationErrors.featured_image && validationErrors.featured_image.message) ||
                                        (validationErrors.brand_featured_size && validationErrors.brand_featured_size)}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box mt={3}>
                            <Buttons
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: "#49fcea",
                                    borderColor: "#49fcea",
                                    marginRight: 30,
                                }}
                            >
                                Cancel
                            </Buttons>
                            <Buttons
                                type="submit"
                                disabled={userFormSubmitting}
                            >
                                {Object.keys(editData).length === 0 ? "Save" : "Update"}
                                {userFormSubmitting && <Spinner size={24} />}
                            </Buttons>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Layout>
    );
};

const mapDispatchToProps = {
    CreateCustomer,
    UpdateCustomer,
    SearchCustomer
};

export default connect(null, mapDispatchToProps)(SuperAdminUserManagement);
