import {
    Box,
    Grid,
    Modal,
    Typography,
    makeStyles,
    withStyles,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Buttons from "Components/Buttons/Buttons";
import UploadImg from "Components/UploadImg";
import Spinner from "../../Components/Spinner";
import { CreateCustomer } from "../../store/actions/CustomersAction";
import * as constant from "../../utils/constant";

const Styles = (theme) => ({
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
});

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

const StyledFormControl = withStyles({
    root: {
        borderRadius: 15,
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderRadius: 12,
            },
        },
    },
})(FormControl);

const AddUserComponent = ({ open, onClose, onUserAdded }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [userFormSubmitting, setUserFormSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        role: "customer-admin",
        brandName: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        logo: null,
        featured_image: null,
        userAccountsLimt: "",
        socialMediaProfilesLimt: "",
        employeeNumber: "",
        position: "",
    });
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [refreshImgUploadComponent, setRefreshImgUploadComponent] = useState(false);

    // Reset refresh flag after component refresh
    useEffect(() => {
        if (refreshImgUploadComponent) {
            setRefreshImgUploadComponent(false);
        }
    }, [refreshImgUploadComponent]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const inputValue = name === "logo" || name === "featured_image" ? files[0] : value;

        setFormValues((prevState) => ({
            ...prevState,
            [name]: inputValue,
        }));

        // Clear validation errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        // Clear related fields when role changes
        if (name === "role") {
            if (value === "super-admin") {
                setFormValues((prevState) => ({
                    ...prevState,
                    brandName: "",
                    logo: null,
                    featured_image: null,
                    userAccountsLimt: "",
                    socialMediaProfilesLimt: "",
                    employeeNumber: "",
                    position: "",
                }));
                setRefreshImgUploadComponent(true);
                // Clear errors for customer-admin specific fields
                setErrors(prev => ({
                    ...prev,
                    brandName: "",
                    logo: "",
                    featured_image: "",
                    userAccountsLimt: "",
                    socialMediaProfilesLimt: "",
                    employeeNumber: "",
                    position: "",
                }));
            }
        }
    };

    const handleCancel = () => {
        resetCustomerForm();
        setErrors({});
        setValidationErrors({});
        onClose();
    };

    const resetCustomerForm = () => {
        setFormValues({
            role: "customer-admin",
            brandName: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            logo: null,
            featured_image: null,
            userAccountsLimt: "",
            socialMediaProfilesLimt: "",
            employeeNumber: "",
            position: "",
        });
        setRefreshImgUploadComponent(true);
    };

    const validateForm = () => {
        const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const imageExtensions = /\.(jpe?g|png|gif|bmp)$/i;
        let formErrors = {};

        // Basic validations for all roles
        if (!formValues.role) formErrors.role = "Role is Required";
        if (!formValues.firstName.trim()) formErrors.firstName = "First Name is Required";
        if (!formValues.lastName.trim()) formErrors.lastName = "Last Name is Required";

        if (!formValues.email.trim()) {
            formErrors.email = "Email is Required";
        } else if (!new RegExp(constant.EMAIL_PATTERN).test(formValues.email)) {
            formErrors.email = "Please enter valid email-ID.";
        }

        if (!formValues.phoneNumber.trim()) {
            formErrors.phoneNumber = "Contact Number is Required";
        } else if (isNaN(formValues.phoneNumber) || specialCharacters.test(formValues.phoneNumber)) {
            formErrors.phoneNumber = "Contact Number must be a valid number";
        }

        // Additional validations for customer-admin role only
        if (formValues.role === "customer-admin") {
            if (!formValues.brandName.trim()) formErrors.brandName = "Sub Domain is Required";

            if (!formValues.userAccountsLimt.trim()) {
                formErrors.userAccountsLimt = "Account limit is Required";
            } else if (isNaN(formValues.userAccountsLimt) || formValues.userAccountsLimt === "0" ||
                specialCharacters.test(formValues.userAccountsLimt)) {
                formErrors.userAccountsLimt = "Account limit must be a valid number greater than 0";
            }

            if (!formValues.socialMediaProfilesLimt.trim()) {
                formErrors.socialMediaProfilesLimt = "Social Media Profile limit is Required";
            } else if (isNaN(formValues.socialMediaProfilesLimt) || formValues.socialMediaProfilesLimt === "0" ||
                specialCharacters.test(formValues.socialMediaProfilesLimt)) {
                formErrors.socialMediaProfilesLimt = "Social Media Profile limit must be a valid number greater than 0";
            }

            // File validations for customer-admin
            if (!formValues.logo) {
                formErrors.logo = "Logo is Required";
            } else if (formValues.logo && formValues.logo.name && !imageExtensions.test(formValues.logo.name)) {
                formErrors.logo = "Image must be valid image file.";
            }

            if (!formValues.featured_image) {
                formErrors.featured_image = "Brand banner image is Required";
            } else if (formValues.featured_image && formValues.featured_image.name && !imageExtensions.test(formValues.featured_image.name)) {
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
            // Prepare form data - use the exact field names from formValues
            const submitData = {
                role: formValues.role,
                firstName: formValues.firstName.trim(),
                lastName: formValues.lastName.trim(),
                email: formValues.email.trim(),
                phoneNumber: formValues.phoneNumber.trim(),
            };

            // Add customer-admin specific fields
            if (formValues.role === "customer-admin") {
                submitData.brandName = formValues.brandName.trim();
                submitData.userAccountsLimt = formValues.userAccountsLimt.trim();
                submitData.socialMediaProfilesLimt = formValues.socialMediaProfilesLimt.trim();
                submitData.logo = formValues.logo;
                submitData.featured_image = formValues.featured_image;

                // Add employee fields if they exist
                if (formValues.employeeNumber.trim()) {
                    submitData.employeeNumber = formValues.employeeNumber.trim();
                }
                if (formValues.position.trim()) {
                    submitData.position = formValues.position.trim();
                }
            }

            console.log('Submitting data:', submitData); // Debug log

            const response = await dispatch(CreateCustomer(submitData));
            onUserAdded(response.data.message);
            resetCustomerForm();
            setValidationErrors({});
            onClose();
        } catch (error) {
            console.error('Submit error:', error); // Debug log
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

    const logoImageHandler = (item) => {
        console.log('Logo selected:', item); // Debug log
        setFormValues((prevState) => ({
            ...prevState,
            logo: item,
        }));

        // Clear logo error if exists
        if (errors.logo) {
            setErrors(prev => ({
                ...prev,
                logo: ""
            }));
        }
    };

    const bannerImageHandler = (item) => {
        console.log('Banner selected:', item); // Debug log
        setFormValues((prevState) => ({
            ...prevState,
            featured_image: item,
        }));

        // Clear featured_image error if exists
        if (errors.featured_image) {
            setErrors(prev => ({
                ...prev,
                featured_image: ""
            }));
        }
    };

    const isCustomerAdmin = formValues.role === "customer-admin";

    return (
        <Modal
            style={{ overflow: "scroll", maxWidth: "100%" }}
            open={open}
            onClose={onClose}
            aria-labelledby="add-user-modal-title"
            aria-describedby="add-user-modal-description"
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
                <Typography variant="h6" id="add-user-modal-title">
                    Add User
                </Typography>

                <form className={classes.userManagementForm} onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        {/* Role Selection */}
                        <Grid item xs={12}>
                            <StyledFormControl
                                variant="outlined"
                                className={classes.inputField}
                                error={!!errors.role}
                            >
                                <InputLabel id="role-label">Role*</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={formValues.role}
                                    onChange={handleChange}
                                    label="Role*"
                                    name="role"
                                >
                                    <MenuItem value="customer-admin">Customer Admin</MenuItem>
                                    <MenuItem value="super-admin">Super Admin</MenuItem>
                                </Select>
                            </StyledFormControl>
                            {errors.role && (
                                <Typography className={classes.imgError}>
                                    {errors.role}
                                </Typography>
                            )}
                        </Grid>

                        {/* Sub Domain - Only for Customer Admin */}
                        {isCustomerAdmin && (
                            <Grid item xs={12}>
                                <StyledTextField
                                    className={classes.inputField}
                                    type="text"
                                    id="brandName"
                                    label="Sub Domain*"
                                    variant="outlined"
                                    error={!!errors.brandName || !!validationErrors.subdomain}
                                    helperText={
                                        errors.brandName ||
                                        (validationErrors.subdomain && validationErrors.subdomain.message)
                                    }
                                    value={formValues.brandName}
                                    name="brandName"
                                    onChange={handleChange}
                                />
                            </Grid>
                        )}

                        {/* Basic User Information */}
                        <Grid item xs={12} md={6}>
                            <StyledTextField
                                className={classes.inputField}
                                type="text"
                                id="firstName"
                                label="First Name*"
                                variant="outlined"
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                value={formValues.firstName}
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
                                value={formValues.lastName}
                                name="lastName"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledTextField
                                className={classes.inputField}
                                type="email"
                                id="email"
                                label="Email*"
                                variant="outlined"
                                error={!!errors.email || !!validationErrors.email}
                                helperText={
                                    errors.email ||
                                    (validationErrors.email && validationErrors.email.message)
                                }
                                value={formValues.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledTextField
                                className={classes.inputField}
                                type="tel"
                                id="phoneNumber"
                                label="Phone Number*"
                                variant="outlined"
                                error={!!errors.phoneNumber || !!validationErrors.contact_number}
                                helperText={
                                    errors.phoneNumber ||
                                    (validationErrors.contact_number && validationErrors.contact_number.message)
                                }
                                value={formValues.phoneNumber}
                                name="phoneNumber"
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Employee Information - Only for Customer Admin */}
                        {isCustomerAdmin && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <StyledTextField
                                        className={classes.inputField}
                                        type="text"
                                        id="employeeNumber"
                                        label="Employee Number"
                                        variant="outlined"
                                        error={!!errors.employeeNumber}
                                        helperText={errors.employeeNumber}
                                        value={formValues.employeeNumber}
                                        name="employeeNumber"
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <StyledTextField
                                        className={classes.inputField}
                                        type="text"
                                        id="position"
                                        label="Position"
                                        variant="outlined"
                                        error={!!errors.position}
                                        helperText={errors.position}
                                        value={formValues.position}
                                        name="position"
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Limits - Only for Customer Admin */}
                        {isCustomerAdmin && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <StyledTextField
                                        className={classes.inputField}
                                        type="number"
                                        id="userAccountsLimt"
                                        label="No. of Account Limit*"
                                        variant="outlined"
                                        error={!!errors.userAccountsLimt || !!validationErrors.user_accounts_limit}
                                        helperText={
                                            errors.userAccountsLimt ||
                                            (validationErrors.user_accounts_limit && validationErrors.user_accounts_limit.message)
                                        }
                                        value={formValues.userAccountsLimt}
                                        name="userAccountsLimt"
                                        onChange={handleChange}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <StyledTextField
                                        className={classes.inputField}
                                        type="number"
                                        id="socialMediaProfilesLimt"
                                        label="No. of Social Media Profile Limit*"
                                        variant="outlined"
                                        error={!!errors.socialMediaProfilesLimt || !!validationErrors.social_media_profiles_limit}
                                        helperText={
                                            errors.socialMediaProfilesLimt ||
                                            (validationErrors.social_media_profiles_limit && validationErrors.social_media_profiles_limit.message)
                                        }
                                        value={formValues.socialMediaProfilesLimt}
                                        name="socialMediaProfilesLimt"
                                        onChange={handleChange}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    {/* File Upload Section - Only for Customer Admin */}
                    {isCustomerAdmin && (
                        <Grid container spacing={3} className={classes.fileUploadConatiner}>
                            <Grid item xs={12} md={6}>
                                <UploadImg
                                    id="upload-logo"
                                    title="Upload Logo*"
                                    name="logo"
                                    defaultImg=""
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
                                    title="Upload Banner*"
                                    name="featured_image"
                                    defaultImg=""
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
                    )}

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
                            Save
                            {userFormSubmitting && <Spinner size={24} />}
                        </Buttons>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddUserComponent;
