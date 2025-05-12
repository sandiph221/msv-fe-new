import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  TextField,
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Layout from "../../Components/Layout";
import styles from "./Styles";
import Spinner from "../../Components/Spinner";

import Alert from "../../Components/AlertBox/Alert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from "axios";
import { toast } from "react-toastify";
import * as constant from "../../utils/constant";
import {
  ChangePassword,
  getSignInUser,
  updateCustomerFromProfile,
} from "../../store/actions/AuthAction";
import Buttons from "../../Components/Buttons/Buttons";
import momentTZ from "moment-timezone";
import UploadImg from "../../Components/UploadImg";
import { formatServerImages } from "utils/functions.js";
import { UpdateCustomerBanner } from "../../store/actions/CustomersAction";
import ConnectToSocial from "../../Customer/Components/ConnectToSocial";

const StyledTextField = withStyles({
  root: {
    borderRadius: 15,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {},
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => styles(theme));

const AccountManagement = (props) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const classes = useStyles();

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { logoURL, bannerURL } = useSelector((state) => state.settings);
  const { changePasswordLoading } = useSelector((state) => state.auth);

  const [passwordValues, setPasswordValues] = React.useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [userFormSubmitting, setUserFormSubmitting] = React.useState(false);
  const [passwordErrors, setErrorsPassword] = React.useState({});
  const [formValues, setFormValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [imgFormValues, setImgFormValues] = React.useState({
    logo: logoURL ? logoURL : "",
    featured_image: bannerURL ? bannerURL : "",
  });
  const [validationErrors, setValidationErrors] = React.useState({});
  const [imgErrors, setImgErrors] = React.useState({});
  const [disableSubmitBtn, SetDisableSubmitBtn] = React.useState(true);

  const handleChange = (event) => {
    setPasswordValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    setFormValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    dispatch(getSignInUser(user.id));
  }, []);

  const deleteAccount = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/account/${user.id}`);
      props.history.push("/logout");
    } catch (error) {
      console.log("error", error);
    }
  };

  /* Resetting the form values */
  const resetCustomerForm = () => {
    setPasswordValues({
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  /* handling profile update  */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    let formErrors = {};

    // Check empty value
    if (!formValues.firstName) {
      formErrors.firstName = "First name is Required*";
    }
    if (!formValues.lastName) {
      formErrors.lastName = "last name is Required*";
    }
    if (!formValues.email) {
      formErrors.email = "Email is Required*";
    }
    if (!formValues.phoneNumber) {
      formErrors.phoneNumber = "Phone number is Required*";
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setUserFormSubmitting(true);
      try {
        const updateResponse = await dispatch(
          updateCustomerFromProfile(formValues)
        );
        setUserFormSubmitting(false);
        const user = updateResponse.data.data;
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
          setUserFormSubmitting(false);
        } else {
          toast.error("Check your internet connection");
          setUserFormSubmitting(false);
        }
      }
    }
  };

  /* setting existing form values */
  React.useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        position: user.position,
        employeeNumber: user.employee_number,
        phoneNumber: user.contact_number,
        timezone: user.timezone,
      });
    }
  }, [user]);

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

  const timeZonesList = momentTZ.tz.names();

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const formErrors = {};

    // Password minumum requirements which includes lower case letter, upper case letter, numbers and special characters and minimum 8 characters
    if (!constant.PASSWORD_PATTERN.test(passwordValues.newPassword)) {
      formErrors.newPasswordError =
        "Password must contain a minimum 8 characters, at least one number, one uppercase letter, one lowercase letter.";
    }
    // Check if password and confirm password are same
    if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
      formErrors.confirmNewPasswordError =
        "Your new password and confirmation password do not match.";
    }
    // Check empty value
    if (!passwordValues.newPassword) {
      formErrors.newPasswordError = "New Password is Required*";
    }
    if (!passwordValues.confirmNewPassword) {
      formErrors.confirmNewPasswordError = "Confirm Password is Required*";
    }

    setErrorsPassword(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setUserFormSubmitting(true);
      try {
        let response = await dispatch(
          ChangePassword(
            passwordValues.newPassword,
            passwordValues.confirmNewPassword
          )
        );
        setUserFormSubmitting(false);
        resetCustomerForm();
      } catch (error) {
        if (error.response) {
          let errorRes = error.response.data;

          if (errorRes.res_type === "validation") {
            setErrorsPassword({
              newPasswordError:
                errorRes.message && errorRes.message.old_password,
              confirmNewPasswordError:
                errorRes.message && errorRes.message.password,
            });
          }
          setUserFormSubmitting(false);
        } else {
          toast.error("Check your internet connection");
          setUserFormSubmitting(false);
        }
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

          <Box className={classes.box}>
            {/* <div className={classes.formContainer}></div> */}
            <Typography className={classes.userType}>
              <strong>General Information</strong>
            </Typography>

            <Grid item xs={12}>
              <form onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  {/* actual profile form component */}

                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="firstName"
                      label="First Name"
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
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="lastName"
                      label="Last Name"
                      variant="outlined"
                      error={errors.lastName ? true : false}
                      helperText={errors && errors.lastName}
                      value={formValues.lastName}
                      name="lastName"
                      title="Last Name"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="email"
                      label="Email"
                      variant="outlined"
                      error={errors.email ? true : false}
                      helperText={errors && errors.email}
                      value={formValues.email}
                      name="email"
                      title="Email"
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="employeeNumber"
                      label="Employee Number"
                      variant="outlined"
                      error={errors.employeeNumber ? true : false}
                      helperText={errors && errors.employeeNumber}
                      value={formValues.employeeNumber}
                      name="employeeNumber"
                      title="Employee Number"
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="position"
                      label="Position"
                      variant="outlined"
                      error={errors.position ? true : false}
                      helperText={errors && errors.position}
                      value={formValues.position}
                      name="position"
                      title="Position"
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      className={classes.inputField}
                      type="text"
                      id="phoneNumber"
                      label="Phone Number"
                      variant="outlined"
                      error={errors.phoneNumber ? true : false}
                      helperText={errors && errors.phoneNumber}
                      value={formValues.phoneNumber}
                      name="phoneNumber"
                      title="Phone Number"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl style={{ width: "100%" }} variant="outlined">
                      <InputLabel id="time-zone-select" focused={false}>
                        {" "}
                        Select Timezone{" "}
                      </InputLabel>
                      <Select
                        label="Phone Number"
                        size="small"
                        style={{
                          width: "100%",
                          height: "40px",
                          color: "rgba(0, 0, 0, 0.5)",
                        }}
                        className={classes.select}
                        aria-label="timezone"
                        name="timezone"
                        value={formValues.timezone ? formValues.timezone : ""}
                        error={errors.role ? true : false}
                        onChange={handleChange}
                      >
                        {timeZonesList.map((timeZone, index) => (
                          <MenuItem key={index} value={timeZone}>
                            {" "}
                            {timeZone}{" "}
                          </MenuItem>
                        ))}
                        {/*
                            <MenuItem value="customer-viewer">Viewer</MenuItem> */}
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
                  <Grid
                    xs={12}
                    style={{
                      display: "flex",
                      padding: "0 12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Buttons
                      type="submit"
                      className={classes.btnUpdatePassword}
                      onClick={handleProfileUpdate}
                      disabled={userFormSubmitting}
                    >
                      {userFormSubmitting && <Spinner />}
                      Save Changes
                    </Buttons>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Box>

          <Box className={classes.box}>
            {/* <div className={classes.formContainer}></div> */}
            <Typography className={classes.userType}>
              <strong>Change Password</strong>
            </Typography>

            <Grid item xs={12}>
              <form onSubmit={handleChangePasswordSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <StyledTextField
                      item
                      size="small"
                      lg={12}
                      className={classes.inputField}
                      variant="outlined"
                      title="Password"
                      label="New Password"
                      error={
                        passwordErrors && passwordErrors.newPasswordError
                          ? true
                          : false
                      }
                      helperText={
                        passwordErrors && passwordErrors.newPasswordError
                      }
                      name="newPassword"
                      value={passwordValues.newPassword}
                      onChange={handleChange}
                      fullWidth
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <StyledTextField
                      item
                      lg={12}
                      size="small"
                      className={classes.inputField}
                      variant="outlined"
                      label="Confirm Password"
                      title="Confirm Password"
                      name="confirmNewPassword"
                      error={
                        passwordErrors && passwordErrors.confirmNewPasswordError
                          ? true
                          : false
                      }
                      helperText={
                        passwordErrors && passwordErrors.confirmNewPasswordError
                      }
                      value={passwordValues.confirmNewPassword}
                      onChange={handleChange}
                      fullWidth
                      type="password"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      padding: "0 12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    {changePasswordLoading && (
                      <div
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          display: "flex",
                          paddingTop: 8,
                          paddingBottom: 4,
                        }}
                      >
                        <Spinner />
                      </div>
                    )}
                    <Buttons
                      type="submit"
                      className={classes.btnUpdatePassword}
                      disabled={userFormSubmitting}
                    >
                      {userFormSubmitting && <Spinner />}
                      Save Changes
                    </Buttons>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Box>

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
          </Box>
        </div>
      </Grid>
    </Layout>
  );
};

export default AccountManagement;
