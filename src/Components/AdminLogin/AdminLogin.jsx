import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Grid,
  Typography,
  TextField,
  useTheme,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import Buttons from "../Buttons/Buttons";
import Spinner from "../Spinner";
import { formatServerImages } from "../../utils/functions";
import { SignIn } from "../../store/actions/AuthAction";
import * as constant from "../../utils/constant";

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
        WebkitBoxShadow: "0 0 0 100px rgb(250 250 250) inset",
        WebkitTextFillColor: "#323132",
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

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { user, isAuth } = useSelector((state) => state.auth);
  const { logoURL } = useSelector((state) => state.settings);

  const [userFormSubmiting, setUserFormSubmiting] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Create a styles object
  const classes = {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 10%",
      height: "100vh",
      width: "100%",
    },
    loginTitle: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 30,
      "& img": {
        maxHeight: 60,
      },
    },
    loginWelcome: {
      fontSize: 24,
      fontWeight: 600,
      color: "#323132",
      marginBottom: 10,
    },
    loginDesc: {
      fontSize: 14,
      color: "#323132",
      marginBottom: 30,
    },
    inputField: {
      marginBottom: 20,
    },
    placeHolder: {
      color: "#323132",
    },
    btnWrapper: {
      position: "relative",
      display: "inline-block",
      width: "100%",
    },
    MuiButton: {
      backgroundColor: "#323132",
      color: "#fff",
      padding: "10px 0",
      "&:hover": {
        backgroundColor: "#000",
      },
    },
  };

  useEffect(() => {
    if (isAuth) {
      if (user && user.role === constant.SUPER_ADMIN_NAME) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user");
      }
    }
  }, [user, isAuth, navigate]);

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
        let signInParams = { ...formValues };
        
        const createResponse = await dispatch(SignIn(signInParams));
        setUserFormSubmiting(false);
        setErrors({});
      } catch (error) {
        /* error caught while creating customer */
        if (error.response) {
          const createResError = error.response.data;
          const formErrors = createResError.message;
          toast.error(formErrors);

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

  return (
    <div>
      <Grid container>
        <Grid container item xl={12} lg={12} md={12} sm={12} xs={12}>
          <div style={classes.root}>
            <div style={classes.loginTitle}>
              {logoURL && <img src={formatServerImages(logoURL)} alt="Logo" />}
            </div>
            <div>
              <Typography sx={classes.loginWelcome}>Admin Login</Typography>
              <Typography sx={classes.loginDesc}>
                Please log in to your admin account using email & password
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
                    <div style={classes.btnWrapper}>
                      <Buttons
                        sx={classes.MuiButton}
                        fullWidth
                        disableElevation
                        type="submit"
                        disabled={userFormSubmiting}
                      >
                        Log in
                      </Buttons>
                      {userFormSubmiting && <Spinner size={24} />}
                    </div>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminLogin;
