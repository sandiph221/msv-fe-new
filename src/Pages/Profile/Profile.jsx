import { useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  makeStyles,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  withStyles,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Components/Layout";
import TextInput from "../../Components/TextInput/TextInput";
import Buttons from "../../Components/Buttons/Buttons";
import {
  ChangePassword,
  getSignInUser,
  updateCustomerFromProfile,
} from "../../store/actions/AuthAction";
import Spinner from "../../Components/Spinner";
import styles from "./Styles";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
// Password Requirements
import * as constant from "../../utils/constant";
import { toast } from "react-toastify";
import momentTZ from "moment-timezone";

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

const useStyles = makeStyles((theme) => styles(theme));

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));

  const { changePasswordLoading } = useSelector((state) => state.auth);

  const [passwordValues, setPasswordValues] = React.useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [userFormSubmiting, setUserFormSubmiting] = React.useState(false);
  const [passwordErrors, setErrorsPassword] = React.useState({});
  const [formValues, setFormValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [switchFormPassword, setSwitchFormPassword] = React.useState(false);
  const [profileUpdatedValue, setProfileUpdatedValue] = React.useState({});

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

  /* Resetting the form values */
  const resetCustomerForm = () => {
    setPasswordValues({
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleSubmit = async (event) => {
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
      setUserFormSubmiting(true);
      try {
        let response = await dispatch(
          ChangePassword(
            passwordValues.newPassword,
            passwordValues.confirmNewPassword
          )
        );
        setUserFormSubmiting(false);
        resetCustomerForm();
      } catch (error) {
        if (error.response) {
          let errorRes = error.response.data;

          if (errorRes.res_type == "validation") {
            setErrorsPassword({
              newPasswordError:
                errorRes.message && errorRes.message.old_password,
              confirmNewPasswordError:
                errorRes.message && errorRes.message.password,
            });
          }
          setUserFormSubmiting(false);
        } else {
          toast.error("Check your internet connection");
          setUserFormSubmiting(false);
        }
      }
    }
  };

  /* from switch on change password fucntion */
  const switchForm = () => {
    setSwitchFormPassword(true);
    setErrors({}); /* set errors value to null  */
  };

  /* password change form cancel button function */
  const handlePasswordChangeCancel = () => {
    setSwitchFormPassword(false);
    setErrors({}); /* set errors value to null  */
    setErrorsPassword({}); /* set errorsPassword value to null  */
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
      setUserFormSubmiting(true);
      try {
        const updateResponse = await dispatch(
          updateCustomerFromProfile(formValues)
        );
        setUserFormSubmiting(false);
        const user = updateResponse.data.data;
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
          setUserFormSubmiting(false);
        } else {
          toast.error("Check your internet connection");
          setUserFormSubmiting(false);
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

  //timezone list

  const timeZonesList = momentTZ.tz.names();

  const classes = useStyles();
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <Box
            className={classes.bannerTop}
            style={{
              backgroundColor: "background.paper",
              width: "100%",
              height: "50vh",
            }}
          ></Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            style={{
              width: xs ? "95%" : "70%",
              margin: "0 auto",
              marginBottom: "60px",
            }}
          >
            <div className={classes.containerMain}>
              <Grid container direction="row" p={0}>
                <Grid item>
                  <Link
                    component={Link}
                    to="/"
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      style={{ fontSize: 18 }}
                      component="div"
                      className={classes.backBtn}
                    >
                      <KeyboardBackspaceIcon className={classes.backBtnIcon} />{" "}
                      Back
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid
                  className={classes.profileDetails}
                  item
                  sm={12}
                  md={5}
                  xs={12}
                  // style={{ backgroundColor: "#E1F1F1" }}
                >
                  <Box style={{ margin: sm ? "0px" : "auto" }}>
                    <Grid
                      container
                      direction={"column"}
                      spacing={1}
                      alignItems="baseline"
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Grid item>
                          <Avatar className={classes.avatar} variant="circular">
                            {user.role === constant.SUPER_ADMIN_NAME
                              ? "SA"
                              : user.first_name.charAt(0) +
                                user.last_name.charAt(0)}
                          </Avatar>
                        </Grid>
                        <Grid
                          item
                          style={{ marginLeft: "15px", textAlign: "left" }}
                        >
                          {" "}
                          <Typography
                            align="left"
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography style={{ fontSize: 14 }}>
                            {" "}
                            {user.role}{" "}
                          </Typography>
                        </Grid>
                      </div>
                      <Grid item>
                        {/* <h1>{user.brand.brand_name}</h1> */}

                        <div style={{ margin: "30px 0" }}>
                          <div
                            style={{ display: "flex", marginBottom: "10px" }}
                          >
                            <MailOutlineIcon />
                            <Typography
                              align="left"
                              style={{ marginLeft: "10px", fontWeight: "bold" }}
                            >
                              {" "}
                              Contact Information{" "}
                            </Typography>
                          </div>
                          <Typography align="left">
                            Email: {user.email}
                          </Typography>
                          <Typography align="left">
                            Phone Number:{user.contact_number}
                          </Typography>
                        </div>
                        <div style={{ margin: "30px 0" }}>
                          <div
                            style={{ display: "flex", marginBottom: "10px" }}
                          >
                            <ContactMailOutlinedIcon />
                            <Typography
                              align="left"
                              style={{ marginLeft: "10px", fontWeight: "bold" }}
                            >
                              Basic Information
                            </Typography>
                          </div>
                          <Typography align="left">
                            {" "}
                            User Type: {user.role}{" "}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        item
                        alignItems="baseline"
                        style={{ margin: "0px auto" }}
                      >
                        <Buttons
                          onClick={switchForm}
                          disabled={switchFormPassword ? true : false}
                        >
                          {" "}
                          Change Password
                        </Buttons>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={7} style={{ display: "flex" }}>
                  <Box p={6} style={{ margin: "auto" }}>
                    <Grid container xs={12} direction="row" spacing={2}>
                      <Grid item xs={12}>
                        <form onSubmit={handleSubmit}>
                          {!switchFormPassword ? (
                            <Grid container spacing={2}>
                              {/* actual profile form component */}

                              <Grid item xs={12} md={6}>
                                <StyledTextField
                                  fullWidth
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
                                <FormControl
                                  style={{ width: "100%" }}
                                  variant="outlined"
                                >
                                  <InputLabel
                                    id="time-zone-select"
                                    focused={false}
                                  >
                                    {" "}
                                    Select Timezone{" "}
                                  </InputLabel>
                                  <Select
                                    label="Phone Number"
                                    style={{
                                      width: "100%",
                                      borderRadius: 12,
                                      color: "rgba(0, 0, 0, 0.5)",
                                    }}
                                    aria-label="timezone"
                                    name="timezone"
                                    value={
                                      formValues.timezone
                                        ? formValues.timezone
                                        : ""
                                    }
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
                                    <FormHelperText
                                      className={classes.errorHelperText}
                                    >
                                      User Role is Required
                                    </FormHelperText>
                                  ) : (
                                    ""
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid
                                container
                                xs={10}
                                style={{
                                  padding: "0 12px",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Buttons
                                  type="submit"
                                  className={classes.btnUpdatePassword}
                                  onClick={handleProfileUpdate}
                                  disabled={userFormSubmiting}
                                >
                                  {userFormSubmiting && <Spinner />}
                                  Save
                                </Buttons>
                              </Grid>
                              <Grid item xs={2}></Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <StyledTextField
                                  item
                                  lg={12}
                                  className={classes.inputField}
                                  variant="outlined"
                                  title="Password"
                                  label="New Password"
                                  error={
                                    passwordErrors &&
                                    passwordErrors.newPasswordError
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    passwordErrors &&
                                    passwordErrors.newPasswordError
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
                                  className={classes.inputField}
                                  variant="outlined"
                                  label="Confirm Password"
                                  title="Confirm Password"
                                  name="confirmNewPassword"
                                  error={
                                    passwordErrors &&
                                    passwordErrors.confirmNewPasswordError
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    passwordErrors &&
                                    passwordErrors.confirmNewPasswordError
                                  }
                                  value={passwordValues.confirmNewPassword}
                                  onChange={handleChange}
                                  fullWidth
                                  type="password"
                                />
                              </Grid>
                              <Grid container item xs={8} spacing={1}>
                                <Grid item xs={6}>
                                  <Buttons
                                    fullWidth
                                    onClick={handlePasswordChangeCancel}
                                    className={classes.btnUpdatePassword}
                                    color="primary"
                                    style={{
                                      backgroundColor: "#49fcea",
                                      borderColor: "#49fcea",
                                    }}
                                  >
                                    {" "}
                                    Cancel{" "}
                                  </Buttons>
                                </Grid>
                                <Grid item xs={6}>
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
                                    fullWidth
                                    type="submit"
                                    className={classes.btnUpdatePassword}
                                    disabled={userFormSubmiting}
                                  >
                                    {userFormSubmiting && <Spinner />}
                                    Save
                                  </Buttons>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </form>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProfilePage;
