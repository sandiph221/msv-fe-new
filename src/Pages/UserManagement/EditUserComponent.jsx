import {
    Box,
    Grid,
    Modal,
    Typography,
    makeStyles,
    withStyles,
    TextField,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Buttons from "Components/Buttons/Buttons";
import UploadImg from "Components/UploadImg";
import Spinner from "../../Components/Spinner";
import { UpdateCustomer } from "../../store/actions/CustomersAction";
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

const EditUserComponent = ({ open, onClose, editData, onUserUpdated }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

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
    const [refreshImgUploadComponent, setRefreshImgUploadComponent] = useState(false);

    // Update form values when editData changes
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

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const inputValue = name === "logo" || name === "featured_image" ? files[0] : value;

        setFormValues((prevState) => ({
            ...prevState,
            [name]: inputValue,
        }));
    };

    const handleCancel = () => {
        resetCustomerForm();
        setErrors({});
        setValidationErrors({});
        onClose();
    };

    const resetCustomerForm = () => {
        setFormValues({
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

        // File validations for edit mode - only validate if new files are uploaded
        if (formValues.logo && formValues.logo.name && !imageExtensions.test(formValues.logo.name)) {
            formErrors.logo = "Image must be valid image file.";
        }

        if (formValues.featured_image && formValues.featured_image.name && !imageExtensions.test(formValues.featured_image.name)) {
            formErrors.featured_image = "Image must be valid image file.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setUserFormSubmitting(true);

        try {
            const response = await dispatch(
                UpdateCustomer({
                    ...formValues,
                    id: editData.id,
                    active: editData.active,
                })
            );
            onUserUpdated(response.data.message);
            resetCustomerForm();
            setRefreshImgUploadComponent(true);
            setValidationErrors({});
            onClose();
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

    return (
        <Modal
            style={{ overflow: "scroll", maxWidth: "100%" }}
            open={open}
            onClose={onClose}
            aria-labelledby="edit-user-modal-title"
            aria-describedby="edit-user-modal-description"
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
                <Typography variant="h6" id="edit-user-modal-title">
                    Edit User
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
                            Update
                            {userFormSubmitting && <Spinner size={24} />}
                        </Buttons>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default EditUserComponent;
