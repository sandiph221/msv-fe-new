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
  InputAdornment,
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
  SignInTokenOnly,
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

const getHostName = () => {
  if (window.location.host.includes("localhost")) {
    return location.host; // For local development, return a default hostname
  } else if (window.location.host.includes(".com")) {
    if (window.location.host.includes("www")) {
      return window.location.host.split(".")[1] + ".com";
    } else {
      return window.location.host;
    }
  } else {
    return "ravenxai.com"; // Default fallback
  }
};

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
    subdomain: "",
  });
  const [errors, setErrors] = useState({});
  const [hostName, setHostName] = useState(getHostName());

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
        navigate("/user");
      }
    }
    // else {
    //   navigate("/login");
    // }

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
        let signInParams = { ...formValues };

        //getting subdomain id is available
     
        // Add domain information
          const createResponse = await SignInTokenOnly(signInParams);
          if (createResponse) { 
              location.href=`http://${signInParams.subdomain}.${import.meta.env.VITE_DOMAIN_NAME}/subdomain-login?code=${encodeURIComponent(createResponse)}`;
          }         
          
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

      // Add domain information

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
        <div className="min-h-screen">
        <Grid container className="h-screen">
          {/* Login Form Section */}
          <Grid item xs={12} md={12} lg={6} className="flex items-center justify-center">
            <div className="w-full max-w-md px-6 py-8 md:px-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src={formatServerImages(logoURL)} 
                  alt="Company Logo" 
                  className="h-12 object-contain"
                />
              </div>
  
              {!showForgotPassword ? (
                <>
                  {/* Login Form */}
                  <div className="mb-6 text-center">
                    <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                      Log In
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      Please log in to your account using email & password
                    </Typography>
                  </div>
  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subdomain Field */}
                    <div>
                      <TextField
                        className="w-full"
                        type="text"
                        id="subdomain"
                        label="Subdomain"
                        variant="outlined"
                        error={!!errors.subdomain}
                        helperText={errors.subdomain}
                        value={formValues.subdomain}
                        name="subdomain"
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography>.{hostName}</Typography>
                            </InputAdornment>
                          ),
                          className: "rounded-lg"
                        }}
                      />
                    </div>
  
                    {/* Email Field */}
                    <div>
                      <TextField
                        className="w-full"
                        type="text"
                        id="email"
                        label="Email"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email}
                        value={formValues.email}
                        name="email"
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          className: "rounded-lg"
                        }}
                      />
                    </div>
  
                    {/* Password Field */}
                    <div>
                      <TextField
                        className="w-full"
                        type="password"
                        id="password"
                        label="Password"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={errors.password}
                        value={formValues.password}
                        name="password"
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          className: "rounded-lg"
                        }}
                      />
                    </div>
  
                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center">
                      <FormControlLabel
                        control={
                          <Checkbox 
                            color="primary" 
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Remember me
                          </Typography>
                        }
                      />
                      <Typography 
                        variant="body2" 
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={switchForm}
                      >
                        Forgot Password?
                      </Typography>
                    </div>
  
                    {/* Login Button */}
                    <div className="relative">
                      <Buttons
                        fullWidth
                        disableElevation
                        type="submit"
                        disabled={userFormSubmiting || facebookLoginLoading}
                        className="py-3 rounded-lg"
                      >
                        Log in
                      </Buttons>
                      {userFormSubmiting && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Spinner size={24} />
                        </div>
                      )}
                    </div>
                  </form>
  
                  {/* Facebook Login */}
                  <div className="mt-6">
                    <LoginSocialFacebook
                      appId={import.meta.env.VITE_REACT_APP_ID}
                      fieldsProfile="id,first_name,last_name,middle_name,name,name_format,picture,short_name,email"
                      onResolve={facebookLogin}
                      onReject={(error) => {
                        console.log({ error });
                        toast.error("Failed to connect to Facebook");
                        setFacebookLoginLoading(false);
                      }}
                    >
                      <div 
                        className={`flex justify-center items-center text-[#4267B2] font-semibold cursor-pointer mt-4 ${
                          (userFormSubmiting || facebookLoginLoading) ? 'opacity-50' : ''
                        }`}
                        onClick={() => 
                          !userFormSubmiting && 
                          !facebookLoginLoading && 
                          setFacebookLoginLoading(true)
                        }
                      >
                        <img 
                          src={facebookImage} 
                          alt="Facebook" 
                          className="h-5 mr-2" 
                        />
                        <span>Log in with Facebook</span>
                      </div>
                    </LoginSocialFacebook>
                  </div>
  
                  {/* Register Link */}
                  {!subDomain && (
                    <div className="mt-6 text-center">
                      <Link href="/register" color="inherit" className="hover:underline">
                        Need an account? Register here.
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Forgot Password Form */}
                  <div className="mb-6 text-center">
                    <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                      Forgot Password
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      Simply enter the email address you are registered with below. 
                      An email will be sent with a link to reset your Password.
                    </Typography>
                  </div>
  
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <TextField
                      className="w-full"
                      type="email"
                      id="forgotEmail"
                      label="Email"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email}
                      value={forgotEmail}
                      name="forgotEmail"
                      onChange={(event) => setForgotEmail(event.target.value)}
                      fullWidth
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
  
                    <div className="flex justify-between gap-4">
                      <Button
                        onClick={switchForm}
                        variant="outlined"
                        className="w-1/2 py-2 rounded-lg"
                      >
                        Cancel
                      </Button>
                      <div className="relative w-1/2">
                        <Buttons
                          type="submit"
                          fullWidth
                          disabled={changePasswordLoading}
                          className="py-2 rounded-lg"
                        >
                          Reset
                        </Buttons>
                        {changePasswordLoading && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Spinner size={24} />
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="text-center mt-4">
                      <Typography variant="body2" className="text-gray-700 inline">
                        Remember your Password?
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className="text-blue-600 cursor-pointer inline ml-1 hover:underline"
                        onClick={switchForm}
                      >
                        Log in
                      </Typography>
                    </div>
  
                    {/* Register Link */}
                    <div className="mt-4 text-center">
                      <Link href="/register" color="inherit" className="hover:underline">
                        Need an account? Register here.
                      </Link>
                    </div>
                  </form>
                </>
              )}
  
              {/* Footer Links */}
              <div className="flex justify-center mt-8 space-x-2 text-gray-600">
                <Link href="/privacy-policy" color="inherit" className="hover:underline">
                  Privacy
                </Link>
                <span>|</span>
                <Link href="/terms" color="inherit" className="hover:underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </Grid>
  
          {/* Banner Image Section */}
          {!isMobile && (
            <Grid item lg={6} className="hidden lg:block relative h-screen bg-blue-50">
              {bannerURL && (
                <img
                  src={formatServerImages(bannerURL)}
                  alt="Login Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </Grid>
          )}
        </Grid>
      </div>
)
  
};

export default Login;
