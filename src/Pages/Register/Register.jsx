import { Grid, Link, Typography, makeStyles, withStyles } from "@mui/material";
import TextField from "@mui/material/TextField";
import { ArrowForward } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Buttons from "../../Components/Buttons/Buttons";
import Spinner from "../../Components/Spinner";
import { formatServerImages, getSubDomain } from "utils/functions.js";
import styles from "../Login/Styles/index.js";

const StyledTextField = withStyles({
  root: {
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
          "-webkit-box-shadow": "0 0 0 100px rgb(250 250 250) inset",
          "-webkit-text-fill-color": "#323132",
        },
      },
      "& fieldset": {
        borderRadius: 12,
      },
    },
    "& .Mui-focused": {
      "& fieldset": {},
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => styles(theme));

const Register = () => {
  const [formValues, setFormValues] = useState({
    subdomain: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const subdomain = getSubDomain();

  useEffect(() => {
    if (subdomain) {
      window.location.replace("/login");
      return;
    }
  });

  const [errors, setErrors] = useState({});
  const { logoURL } = useSelector((state) => state.settings);
  const [userFormSubmitting, setUserFormSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formErrors = {};

    if (Object.values(formValues).every((value) => value !== "")) {
      if (formValues.password !== formValues.confirmPassword) {
        formErrors.confirmPassword = "Password does not match";
      }

      setErrors(formErrors);
      if (Object.keys(formErrors).length === 0) {
        setUserFormSubmitting(true);
      }
    }

    if (Object.keys(formErrors).length === 0) {
      await axios
        .post("/sign-up", formValues)
        .then(async (response) => {
          if (response.data.status && response.data.data) {
            toast.success("Registered Successfully");
            await new Promise((resolve) => setTimeout(resolve, 3000));
            window.location.href = "/card-details";
          }
          setErrors(response.data.message);
          throw new Error(response.data);
        })
        .catch((error) => {
          setErrors(error.response.data.message);
        })
        .finally(() => {
          setUserFormSubmitting(false);
        });
    }
  };

  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <div className={classes.root}>
            <div className={classes.loginTitle}>
              <img src={formatServerImages(logoURL)} height="55" alt="server" />
            </div>
            <div className="loginWrapper">
              <Typography className={classes.loginWelcome}>Sign Up</Typography>
              <Typography className={classes.loginDesc}>
                {" "}
                Please register your account by filling in the details
              </Typography>
            </div>
            <Grid>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4} justifyContent="space-between">
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
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
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
                      className={classes.inputField}
                      type="text"
                      id="lastName"
                      label="Last Name"
                      variant="outlined"
                      error={errors.lastName ? true : false}
                      helperText={errors && errors.lastName}
                      value={formValues.lastName}
                      title="Last Name"
                      name="lastName"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
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
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
                      className={classes.inputField}
                      type="text"
                      id="phoneNumber"
                      label="Phone"
                      variant="outlined"
                      error={errors.phoneNumber ? true : false}
                      helperText={errors && errors.phoneNumber}
                      value={formValues.phoneNumber}
                      title="Phone"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      name="phoneNumber"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
                      className={classes.inputField}
                      type="password"
                      id="password"
                      label="Password"
                      variant="outlined"
                      error={errors.password ? true : false}
                      helperText={errors && errors.password}
                      value={formValues.password}
                      name="password"
                      title="Password"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StyledTextField
                      lg={12}
                      className={classes.inputField}
                      type="password"
                      id="confirmPassword"
                      label="Confirm Password"
                      variant="outlined"
                      error={errors.confirmPassword ? true : false}
                      helperText={errors && errors.confirmPassword}
                      value={formValues.confirmPassword}
                      title="Confirm Password"
                      name="confirmPassword"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      lg={12}
                      className={classes.inputField}
                      type="text"
                      id="subdomain"
                      label="Username/Sub Domain"
                      variant="outlined"
                      error={errors.subdomain ? true : false}
                      helperText={errors && errors.subdomain}
                      value={formValues.subdomain}
                      name="subdomain"
                      title="Username/Sub Domain"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        classes: {
                          root: classes.placeHolder,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.btnWrapper}>
                      <Buttons
                        className={classes.MuiButton}
                        fullWidth
                        disableElevation
                        type="submit"
                        disabled={userFormSubmitting}
                      >
                        Sign up to start your free trial{" "}
                        <ArrowForward className={classes.btnIcon} />
                      </Buttons>
                      {userFormSubmitting && <Spinner size={24} />}
                    </div>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <Link href="/login" color="inherit">
                Already have an account? Login here.
              </Link>
            </Grid>

            <div className={classes.privacyPolicy}>
              <Link
                href="/privacy-policy"
                color="inherit"
                className={classes.footerText}
              >
                Privacy
              </Link>
              <div>|</div>
              <Typography className={classes.footerText}>
                Terms of Service
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
