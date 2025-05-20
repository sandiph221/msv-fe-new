import {
    Box,
    Button,
    Grid,
    Typography,
    makeStyles,
    useMediaQuery,
    useTheme,
    withStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Components/Layout";
import { useNavigate } from "react-router-dom";
import styles from "./Styles";
import Spinner from "../../Components/Spinner";
import React from "react";
import Alert from "../../Components/AlertBox/Alert";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import { getSignInUser } from "../../store/actions/AuthAction";
import Buttons from "../../Components/Buttons/Buttons";
import UploadImg from "../../Components/UploadImg";
import { formatServerImages } from "utils/functions.js";
import { UpdateCustomerBanner } from "../../store/actions/CustomersAction";
import ConnectToSocial from "../../Customer/Components/ConnectToSocial";
import SubscriptionDetail from "../SubscriptionManagementSetting/SubscriptionDetail";

const useStyles = makeStyles((theme) => styles(theme));

const AccountManagement = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const theme = useTheme();
    const match = useMediaQuery(theme.breakpoints.down("md"));
    const dispatch = useDispatch();

    const classes = useStyles();

    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const { logoURL, bannerURL } = useSelector((state) => state.settings);

    const [userFormSubmitting, setUserFormSubmitting] = React.useState(false);
    const [imgFormValues, setImgFormValues] = React.useState({
        logo: logoURL ? logoURL : "",
        featured_image: bannerURL ? bannerURL : "",
    });
    const [validationErrors, setValidationErrors] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [disableSubmitBtn, SetDisableSubmitBtn] = React.useState(true);

    useEffect(() => {
        console.log("AccountManagement useEffect");
        dispatch(getSignInUser(user.id));
    }, []);

    const deleteAccount = (data) => {
        setDeleteAlertOpen(true);
        setItemToDelete(data);
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`/account/${user.id}`);
            navigate("/logout");
        } catch (error) {
            console.log("error", error);
        }
    };

    React.useEffect(() => {
        if (
            imgFormValues.logo instanceof File ||
            imgFormValues.featured_image instanceof File
        ) {
            SetDisableSubmitBtn(false);
        }
    }, [imgFormValues.logo, imgFormValues.featured_image]);

    const logoImageHandler = (item) => {
        setImgFormValues((prevState) => ({
            ...prevState,
            logo: item,
        }));
    };

    const bannerImageHandler = (item) => {
        setImgFormValues((prevState) => ({
            ...prevState,
            featured_image: item,
        }));
    };

    const onImgSubmit = async (event) => {
        event.preventDefault();
        let formErrors = {};

        // Image Size Validation
        if (imgFormValues.logo.size > 2097152) {
            formErrors.logo = "Logo cannot be greater than 2 MB.";
        }
        if (imgFormValues.featured_image.size < 2097152) {
            formErrors.featured_image = "Featured Image cannot be smaller than 2 MB.";
        }

        if (!imgFormValues.logo) {
            formErrors.logo = "Logo is Required";
        }

        if (!imgFormValues.featured_image) {
            formErrors.featured_image = "Brand banner image is Required";
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            // Loader
            setUserFormSubmitting(true);
            SetDisableSubmitBtn(true);
            /* Updating */
            try {
                const logoBannerResponse = await dispatch(
                    UpdateCustomerBanner({
                        ...imgFormValues,
                    })
                );
                const logoBannerResData = logoBannerResponse.data;

                setUserFormSubmitting(false);
                setValidationErrors({});
            } catch (error) {
                /* error caught while creating customer */
                const logoBannerResError = error.response.data;
                const logoBannerErrorMsg = logoBannerResError.message;
                setUserFormSubmitting(false);
                SetDisableSubmitBtn(false);
                setValidationErrors(logoBannerErrorMsg);
            }
        }
    };

    return (
        <Layout>
            <Grid container className={classes.root}>
                <div
                    style={{
                        marginTop: 100,
                        marginBottom: 30,
                        width: "100%",
                        padding: "8px 50px",
                        marginInline: "auto",
                    }}
                >
                    <Typography variant="h2" className={classes.heading}>
                        Account Management
                    </Typography>
                    <Typography style={{ fontSize: "12px" }}>
                        Update your personal information, change passwords and connect apps
                    </Typography>

                    {user.role == "customer-admin" && <ConnectToSocial />}

                    {user.role == "customer-admin" && (
                        <Box className={classes.box}>
                            <Typography className={classes.userType}>
                                <strong>Update Logo/Banner</strong>
                            </Typography>

                            <form
                                className={classes.userManagementForm}
                                onSubmit={onImgSubmit}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <UploadImg
                                            id="upload-logo"
                                            title="Upload Logo"
                                            defaultImg={formatServerImages(logoURL)}
                                            getSelectedData={(item) => logoImageHandler(item)}
                                        />
                                        <Typography className={classes.imgError}>
                                            {" "}
                                            {(errors && errors.logo) ||
                                                (validationErrors.logo && validationErrors.logo) ||
                                                (validationErrors.brand_logo_size &&
                                                    validationErrors.brand_logo_size)}{" "}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <UploadImg
                                            id="upload-banner"
                                            title="Upload Banner"
                                            defaultImg={formatServerImages(bannerURL)}
                                            getSelectedData={(item) => bannerImageHandler(item)}
                                        />
                                        <Typography className={classes.imgError}>
                                            {" "}
                                            {(errors && errors.featured_image) ||
                                                (validationErrors.brand_featured_size &&
                                                    validationErrors.brand_featured_size)}{" "}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box
                                    mt={3}
                                    style={{
                                        display: "flex",
                                        padding: "0 12px",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Buttons type="submit" disabled={disableSubmitBtn}>
                                        Update
                                        {userFormSubmitting && <Spinner size={24} />}
                                    </Buttons>
                                </Box>
                            </form>
                        </Box>
                    )}

                    <Box className={classes.box}>
                        <div className={classes.flexRow}>
                            <Typography className={classes.userType}>
                                Account Management
                                <p style={{ fontSize: 14, color: "#666", marginTop: -2 }}>
                                    Deleting your account is a permanent action. Once you delete
                                    your account, you will not be able to recover it. Please be
                                    certain before proceeding.
                                </p>
                            </Typography>
                        </div>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            style={{
                                color: "#fff",
                                backgroundColor: "#ff0000",
                                opacity: 0.8,
                            }}
                            className={classes.button}
                            onClick={deleteAccount}
                        >
                            Delete Account
                        </Button>
                        <Alert
                            alert={itemToDelete}
                            icon={
                                <ErrorOutlineIcon
                                    style={{
                                        fontSize: "5rem",
                                        color: "#ff0000",
                                        paddingBottom: 0,
                                        opacity: 0.8,
                                    }}
                                />
                            }
                            title="Are you sure?"
                            confirmBtn="DELETE"
                            description="You're about to Delete your account. This process cannot be undone."
                            open={deleteAlertOpen}
                            setOpen={setDeleteAlertOpen}
                            onConfirm={handleDeleteAccount}
                            buttonbgcolor="#ff0000"
                            textColor="#fff"
                        />
                        <SubscriptionDetail/>
                    </Box>
                </div>
            </Grid>
        </Layout>
    );
};

export default AccountManagement;
  