import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoginSocialFacebook } from "reactjs-social-login";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import facebookImage from "../../assets/images/facebook.png";
import Buttons from "../../Components/Buttons/Buttons";
import Spinner from "../../Components/Spinner";
import { formatServerImages, getSubDomain } from "utils/functions.js";
import {
  FacebookSignIn,
  ForgotPassword,
  SignIn,
} from "../../store/actions/AuthAction";
import * as constant from "../../utils/constant";
import styles from "./Styles/index.js";

// Styled components approach instead of withStyles
const StyledTextField = styled(TextField)(({ theme }) => ({
  borderRadius: 15,
  "& .MuiInputLabel-shrink": {
    color: "#323132",
  },
  "& .MuiOutlinedInput-input": {
    padding: 15,
    color: "#323132",
  },
  "& .MuiOutlinedInput-root": {
    "& input": {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px rgb(250 250 250) inset", // Fixed
        WebkitTextFillColor: "#323132", // Fixed
      },
    },
    "& fieldset": {
      borderRadius: 12,
    },
  },
  "& .Mui-focused": {
    "& fieldset": {},
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, isAuth } = useSelector((state) => state.auth);
  const { subdomainID, logoURL, bannerURL } = useSelector(
    (state) => state.settings
  );
  const { apiRes } = useSelector((state) => state.apiResReducer);

  const [userFormSubmiting, setUserFormSubmiting] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [facebookLoginLoading, setFacebookLoginLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const subDomain = getSubDomain();

  // Create a styles object from the imported styles function
  const classes = {};
  Object.entries(styles(theme)).forEach(([key, value]) => {
    classes[key] = value;
  });

  useEffect(() => {
    if (isAuth) {
      if (user && user.role === constant.SUPER_ADMIN_NAME) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }

    // Receive Response for Forgot password
    if (apiRes && apiRes.requestFrom) {
      switch (apiRes.requestFrom) {
        case "forgot-password":
          if (apiRes.response.status === true) {
            setForgotEmail("");
          }
          break;
        default:
          break;
      }
    }
  }, [user, isAuth, apiRes, navigate]);

  const handleChange = (e) => {
    setFormValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formErrors = {};

    if (typeof formValues.email !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(constant.EMAIL_PATTERN);

      if (!pattern.test(formValues.email)) {
        formErrors.email = "Please enter valid email-ID.";
      }
    }

    if (!formValues.email && !formValues.password) {
      formErrors.email = constant.FORM_ERROR_EMAIL;
      formErrors.password = constant.FORM_ERROR_PASSWORD;
    }
    if (!formValues.email) {
      formErrors.email = constant.FORM_ERROR_EMAIL;
    }
    if (!formValues.password) {
      formErrors.password = constant.FORM_ERROR_PASSWORD;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setUserFormSubmiting(true);

      try {
        let signInParams = formValues;

        //getting subdomain id is available
        if (subdomainID) {
          signInParams.subdomain_id = `${subdomainID}`;
        }

        const createResponse = await dispatch(SignIn(signInParams));
        setUserFormSubmiting(false);
        setErrors({});
      } catch (error) {
        /* error caught while creating customer */
        if (error.response) {
          const createResError = error.response.data;
          const formErrors = createResError.message;
          if (
            formErrors.subdomain_id ||
            formErrors === "Subdomain does not exits"
          ) {
            toast.error("Invalid Subdomain");
          }
          toast.error(formErrors.subdomain || formErrors);

          setUserFormSubmiting(false);
          setErrors(formErrors);
        } else {
          toast.error("Check your internet connection");
          setUserFormSubmiting(false);
          setErrors(formErrors);
        }
      }
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    var subdomain = window.location.host.split(".")[1]
      ? window.location.host.split(".")[0]
      : "false";

    let formErrors = {};

    if (!forgotEmail) {
      formErrors.email = constant.FORM_ERROR_EMAIL;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setChangePasswordLoading(true);

      try {
        await dispatch(ForgotPassword(forgotEmail, subdomain));
        setChangePasswordLoading(false);
        setErrors({});
      } catch (error) {
        /* error caught while creating customer */
        if (error.response) {
          const forgotResError = error.response.data;
          const formErrors = forgotResError.message;
          setErrors(formErrors);
          setChangePasswordLoading(false);
        } else {
          toast.error("Check your internet connection");
          setChangePasswordLoading(false);
          setErrors(formErrors);
        }
      }
      setShowForgotPassword(true);
    }
  };

  const switchForm = () => {
    setShowForgotPassword(!showForgotPassword);
    setErrors({});
  };

  const facebookLogin = async (response) => {
    try {
      setFacebookLoginLoading(true);

      let signInParams = {};

      //getting subdomain id if available
      if (subdomainID) {
        signInParams.subdomain_id = `${subdomainID}`;
      }

      // Extract access token from the response
      const accessToken = response.data.accessToken;

      await dispatch(FacebookSignIn(accessToken, signInParams));
      setFacebookLoginLoading(false);
      setErrors({});
    } catch (error) {
      /* error caught while creating customer */
      if (error.response) {
        const createResError = error.response.data.message;
        toast.error(createResError.subdomain || createResError);

        setFacebookLoginLoading(false);
      } else {
        toast.error("Check your internet connection");
        setFacebookLoginLoading(false);
      }
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <div style={classes.root}>
            <div style={classes.loginTitle}>
              {/* <img src={formatServerImages(logoURL)} height="55" alt="server" /> */}
            </div>
            {!showForgotPassword ? (
              <>
                <div className="loginWrapper">
                  <Typography sx={classes.loginWelcome}>Log In</Typography>
                  <Typography sx={classes.loginDesc}>
                    Please log in to your account using email & password
                  </Typography>
                </div>
                <Grid>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs={12}>
                        <StyledTextField
                          sx={classes.inputField}
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
                          fullWidth
                          InputLabelProps={{
                            sx: classes.placeHolder,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          sx={classes.inputField}
                          type="password"
                          id="password"
                          label="Password"
                          variant="outlined"
                          error={errors.password ? true : false}
                          helperText={errors && errors.password}
                          value={formValues.password}
                          title="Password"
                          name="password"
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{
                            sx: classes.placeHolder,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <div className="forgotpass-container">
                          <FormControlLabel
                            value="end"
                            control={
                              <Checkbox
                                disableRipple
                                disableFocusRipple
                                color="primary"
                                size="small"
                              />
                            }
                            sx={classes.MuiFormControlLabel}
                            label="Remember me"
                            labelPlacement="end"
                          />

                          <Typography
                            sx={{
                              ...classes.forgotPassword,
                              cursor: "pointer",
                            }}
                            onClick={switchForm}
                          >
                            Forgot Password
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12}>
                        <div style={classes.btnWrapper}>
                          <Buttons
                            sx={classes.MuiButton}
                            fullWidth
                            disableElevation
                            type="submit"
                            disabled={userFormSubmiting || facebookLoginLoading}
                          >
                            Log in
                          </Buttons>
                          {userFormSubmiting && <Spinner size={24} />}
                        </div>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <LoginSocialFacebook
                    appId={import.meta.env.VITE_REACT_APP_ID}
                    fieldsProfile={
                      "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email"
                    }
                    onResolve={facebookLogin}
                    onReject={(error) => {
                      console.log({ error });
                      toast.error("Failed to connect to Facebook");
                      setFacebookLoginLoading(false);
                    }}
                  >
                    <div
                      style={{
                        color: "#4267B2",
                        fontSize: 15,
                        fontWeight: "600",
                        cursor: "pointer",
                        opacity:
                          userFormSubmiting || facebookLoginLoading
                            ? "0.5"
                            : "1",
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: 20,
                        maxWidth: "50%",
                        margin: "0 auto",
                      }}
                      onClick={() =>
                        !userFormSubmiting &&
                        !facebookLoginLoading &&
                        setFacebookLoginLoading(true)
                      }
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          style={{ height: 20 }}
                          src={facebookImage}
                          alt="Facebook"
                        />
                        <div style={{ paddingLeft: 5, whiteSpace: "nowrap" }}>
                          Log in with Facebook
                        </div>
                      </div>
                    </div>
                  </LoginSocialFacebook>
                </Grid>
                {!subDomain && (
                  <Grid item xs={12}>
                    <Link href="/register" color="inherit">
                      Need an account? Register here.
                    </Link>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <div>
                  <Typography sx={classes.loginWelcome}>
                    Forgot Password
                  </Typography>
                  <Typography sx={classes.loginDesc}>
                    Simply enter the email address you are registered with
                    below. An email will be sent with a link to reset your
                    Password.
                  </Typography>
                </div>
                <div>
                  <form onSubmit={handleForgotPassword}>
                    <StyledTextField
                      sx={classes.inputField}
                      type="email"
                      id="forgotEmail"
                      label="Email"
                      variant="outlined"
                      error={errors.email ? true : false}
                      helperText={errors && errors.email}
                      value={forgotEmail}
                      name="forgotEmail"
                      title="Email"
                      onChange={(event) => setForgotEmail(event.target.value)}
                      fullWidth
                      InputLabelProps={{
                        sx: classes.placeHolder,
                      }}
                    />

                    <Grid
                      sx={classes.forgotBtnContainer}
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item lg={6} xs={6}>
                        <Button
                          onClick={switchForm}
                          sx={classes.forgotBtn}
                          variant="contained"
                          color="inherit"
                        >
                          Cancel
                        </Button>
                      </Grid>

                      <Grid item lg={6} xs={6} style={{ textAlign: "right" }}>
                        <div style={classes.btnWrapper}>
                          <Buttons
                            type="submit"
                            onClick={handleForgotPassword}
                            sx={classes.forgotBtn}
                            disabled={changePasswordLoading}
                          >
                            Reset
                          </Buttons>
                          {changePasswordLoading && <Spinner size={24} />}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography
                          className="forgot-password"
                          sx={{ color: "#323132", fontWeight: "normal" }}
                        >
                          Remember your Password?
                        </Typography>
                      </Grid>
                      {"    "}
                      <Grid item onClick={switchForm}>
                        <Typography
                          className="forgot-password"
                          sx={{ cursor: "pointer" }}
                          onClick={switchForm}
                        >
                          &nbsp;Log in
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                  <Grid item xs={12}>
                    <Link href="/register" color="inherit">
                      Need an account? Register here.
                    </Link>
                  </Grid>
                </div>
              </>
            )}

            <div style={classes.privacyPolicy}>
              <Link
                href="/privacy-policy"
                color="inherit"
                sx={classes.footerText}
              >
                Privacy
              </Link>
              <div>|</div>
              <Typography sx={classes.footerText}>Terms of Service</Typography>
            </div>
          </div>
        </Grid>
        {!isMobile && (
          <Grid sx={classes.loginBannerImg} item xl={6} lg={6}>
            {bannerURL && (
              <img
                style={classes.loginImg}
                // src={formatServerImages(bannerURL)}
                alt="Banner"
              />
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Login;
