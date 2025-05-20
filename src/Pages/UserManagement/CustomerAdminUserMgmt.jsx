import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
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
    withStyles,
} from "@material-ui/core";
import { Delete, Edit, Search } from "@material-ui/icons";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Buttons from "Components/Buttons/Buttons";
import { connect, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Alert from "../../Components/AlertBox/Alert";
import Spinner from "../../Components/Spinner";
import Layout from "../../Components/Layout";
import {
    CreateCustomer,
    DeleteCustomer,
    GetCustomer,
    PaginateCustomer,
    SearchCustomer,
    UpdateCustomer,
} from "../../store/actions/CustomersAction";
import * as constant from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { Styles } from "./Styles";
import "./Styles/style.css";

const useStyles = makeStyles((theme) => Styles(theme));

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

const CustomerAdmin = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { customers, getCustomersLoading } = useSelector((state) => state.customerInfo);

    // State management
    const [userFormSubmitting, setUserFormSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        employeeNumber: "",
        position: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editData, setEditData] = useState({});
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userAddedAlertOpen, setUserAddedAlertOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Check user role
    useEffect(() => {
        if (user.role === constant.CUSTOMER_VIEWER_NAME) {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Update form values when editing
    useEffect(() => {
        if (Object.keys(editData).length !== 0) {
            setFormValues({
                id: editData.id,
                firstName: editData.first_name,
                lastName: editData.last_name,
                email: editData.email,
                phoneNumber: editData.contact_number,
                employeeNumber: editData.employee_number,
                position: editData.position,
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

    async function fetchSearchCustomers(page, search) {
        await dispatch(SearchCustomer(page, search));
    }

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search to avoid too many API calls
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                fetchSearchCustomers(page, query);
            } else {
                fetchCustomers();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Form handlers
    const handleChange = (event) => {
        setFormValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const resetCustomerForm = () => {
        setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            employeeNumber: "",
            position: "",
            role: "",
        });
    };

    // Table handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (searchQuery.trim()) {
            fetchSearchCustomers(newPage, searchQuery);
        } else {
            fetchNewCustomers(newPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Modal handlers
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

    // Menu handlers
    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleEdit = () => {
        handleModalOpen(selectedRow);
        handleMenuClose();
    };

    const deleteUser = () => {
        setDeleteAlertOpen(true);
        setItemToDelete(selectedRow);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await dispatch(DeleteCustomer(selectedRow.id));
                resetCustomerForm();
                setEditData({});
                handleMenuClose();
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Check your internet connection");
                }
            }
        }
    };

    const handleCancel = () => {
        resetCustomerForm();
        setEditData({});
        setErrors({});
        setValidationErrors({});
        handleModalClose();
    };

    // Form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        let formErrors = {};

        // Validation
        if (!formValues.firstName) formErrors.firstName = "First Name is Required";
        if (!formValues.lastName) formErrors.lastName = "Last Name is Required";
        if (!formValues.email) formErrors.email = "Email is Required";
        if (!formValues.position) formErrors.position = "Position is Required";
        if (!formValues.role) formErrors.role = "User Role is Required";
        if (!formValues.employeeNumber) formErrors.employeeNumber = "Employee Number is Required";
        if (!formValues.phoneNumber) formErrors.phoneNumber = "Contact Number is Required";

        // Email validation
        if (formValues.email && !new RegExp(constant.EMAIL_PATTERN).test(formValues.email)) {
            formErrors.email = "Please enter valid email-ID.";
        }

        // Phone validation
        if (formValues.phoneNumber) {
            if (isNaN(formValues.phoneNumber)) {
                formErrors.phoneNumber = "Contact Number must be a valid number";
            }
            if (specialCharacters.test(formValues.phoneNumber)) {
                formErrors.phoneNumber = "Contact Number cannot contain any special characters.";
            }
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setUserFormSubmitting(true);

            try {
                let response;
                if (Object.keys(editData).length === 0) {
                    // Create new customer
                    response = await dispatch(CreateCustomer(formValues));
                } else {
                    // Update existing customer
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
                setUserFormSubmitting(false);
                setValidationErrors({});
                handleModalClose();
            } catch (error) {
                if (error.response) {
                    const errorMsg = error.response.data.message;
                    toast.error(errorMsg);
                    setValidationErrors(typeof errorMsg === 'object' ? errorMsg : { general: errorMsg });
                } else {
                    toast.error("Check your internet connection");
                }
                setUserFormSubmitting(false);
            }
        }
    };

    const menuProps = {
        borderRadius: "12px",
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
            borderRadius: 12,
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left",
        },
        getContentAnchorEl: null,
    };

    const columns = [
        { id: "employee_number", label: "Employee ID", minWidth: 170 },
        { id: "first_name", label: "First Name", minWidth: 170 },
        { id: "last_name", label: "Last Name", minWidth: 170 },
        { id: "email", label: "Email", minWidth: 170 },
        { id: "position", label: "Position", minWidth: 170 },
        { id: "action", label: "Action", minWidth: 80, align: "right" },
    ];

    return (
        <Layout>
            <div className={classes.main}>
                <div style={{ padding: 10 }} className="dashboardPageContainer">
                    <Container disableGutters maxWidth="xl">
                        <Box className={classes.topFilter}>
                            <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={12} md={6} style={{ display: "flex" }}>
                                    <Buttons
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleModalOpen()}
                                        style={{ marginBottom: "16px", marginRight: "16px" }}
                                    >
                                        Add User
                                    </Buttons>

                                    {/* Search Field */}
                                    <StyledTextField
                                        className={classes.searchField}
                                        placeholder="Search by name, email, phone..."
                                        variant="outlined"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        InputProps={{
                                            startAdornment: <Search style={{ color: 'gray', marginRight: 8 }} />,
                                        }}
                                        style={{ width: '300px' }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

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
                                                {customers?.users &&
                                                    customers.users
                                                        .slice(
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
                                                                    const value = row[column.id];
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

                            {/* Delete Confirmation Dialog */}
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

                            {/* Success Alert */}
                            <Alert
                                icon={
                                    <ErrorOutlineIcon
                                        style={{
                                            fontSize: "5rem",
                                            color: "#4caf50",
                                            paddingBottom: 0,
                                        }}
                                    />
                                }
                                title="Success"
                                confirmBtn="OK"
                                description={responseMessage}
                                open={userAddedAlertOpen}
                                setOpen={setUserAddedAlertOpen}
                                buttonbgcolor="#4caf50"
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
                closeAfterTransition
                BackdropProps={{
                    timeout: 500,
                }}
                disableAutoFocus={true}
                disableEnforceFocus={true}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxWidth: "1200px",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        height: "calc(100vh - 24px)",
                        overflow: "scroll",
                        borderRadius: 8,
                    }}
                >
                    <Typography variant="h6" id="user-modal-title">
                        {formValues.id ? "Edit User" : "Add User"}
                    </Typography>
                    <form
                        container
                        className={classes.userManagementForm}
                        onSubmit={onSubmit}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="firstName"
                                    label="First Name*"
                                    variant="outlined"
                                    error={errors.firstName ? true : false}
                                    helperText={errors && errors.firstName}
                                    value={formValues.firstName}
                                    name="firstName"
                                    title="First Name"
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
                                    error={errors.lastName ? true : false}
                                    helperText={errors && errors.lastName}
                                    value={formValues.lastName}
                                    title="Last Name"
                                    name="lastName"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    item
                                    className={classes.inputField}
                                    type="text"
                                    id="email"
                                    label="Email*"
                                    variant="outlined"
                                    error={errors.email || validationErrors.email ? true : false}
                                    helperText={
                                        (errors && errors.email) ||
                                        (validationErrors.email && validationErrors.email.message)
                                    }
                                    value={formValues.email}
                                    name="email"
                                    title="Email"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    item
                                    className={classes.inputField}
                                    type="text"
                                    id="employeeNumber"
                                    label="Employee Number*"
                                    variant="outlined"
                                    error={
                                        errors.employeeNumber || validationErrors.employeeNumber
                                            ? true
                                            : false
                                    }
                                    helperText={
                                        (errors && errors.employeeNumber) ||
                                        (validationErrors.employeeNumber &&
                                            validationErrors.employeeNumber)
                                    }
                                    value={formValues.employeeNumber}
                                    name="employeeNumber"
                                    title="Employee Number"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    item
                                    className={classes.inputField}
                                    type="text"
                                    id="position"
                                    label="Position*"
                                    variant="outlined"
                                    error={
                                        errors.position || validationErrors.position ? true : false
                                    }
                                    helperText={
                                        (errors && errors.position) ||
                                        (validationErrors.position && validationErrors.position)
                                    }
                                    value={formValues.position}
                                    name="position"
                                    title="Position"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    item
                                    className={classes.inputField}
                                    type="text"
                                    id="phoneNumber"
                                    label="Phone Number*"
                                    variant="outlined"
                                    error={
                                        errors.phoneNumber || validationErrors.contact_number
                                            ? true
                                            : false
                                    }
                                    helperText={
                                        (errors && errors.phoneNumber) ||
                                        (validationErrors.contact_number &&
                                            validationErrors.contact_number.message)
                                    }
                                    value={formValues.phoneNumber}
                                    name="phoneNumber"
                                    title="Phone Number"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl style={{ width: "100%" }} variant="outlined">
                                    <Select
                                        style={{
                                            width: "100%",
                                            borderRadius: 12,
                                            color: "rgba(0, 0, 0, 0.5)",
                                        }}
                                        aria-label="role"
                                        name="role"
                                        value={formValues.role ? formValues.role : ""}
                                        error={errors.role ? true : false}
                                        onChange={handleChange}
                                        MenuProps={menuProps}
                                        displayEmpty
                                        defaultValue="customer-admin"
                                    >
                                        <MenuItem value="" disabled>
                                            User Role*
                                        </MenuItem>
                                        <MenuItem value="customer-admin">Admin</MenuItem>
                                        <MenuItem value="customer-viewer">Viewer</MenuItem>
                                    </Select>
                                    {errors.role ? (
                                        <FormHelperText className={classes.errorHelperText}>
                                            User Role is Required
                                        </FormHelperText>
                                    ) : (
                                        ""
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Box mt={3}>
                            <Buttons
                                disabled={userFormSubmitting}
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: "#49fcea",
                                    borderColor: "#49fcea",
                                    marginRight: 30,
                                }}
                            >
                                Cancel
                            </Buttons>
                            <Buttons type="submit" disabled={userFormSubmitting}>
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

const mapDispatchToProps = { CreateCustomer, UpdateCustomer };

export default connect(null, mapDispatchToProps)(CustomerAdmin);
                