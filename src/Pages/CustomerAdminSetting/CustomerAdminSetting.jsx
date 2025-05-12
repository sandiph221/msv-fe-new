
import Layout from "../../Components/Layout";
import {
  Box,
  Grid,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Buttons from "../../Components/Buttons/Buttons";
import Spinner from "../../Components/Spinner";
import UploadImg from "../../Components/UploadImg";
import { UpdateCustomerBanner } from "../../store/actions/CustomersAction";
import { connect } from "react-redux";
import styles from "./Styles";
import { formatServerImages } from "utils/functions.js";
import ConnectToSocial from "../../Customer/Components/ConnectToSocial";

const useStyles = makeStyles((theme) => styles(theme));

const UserManagement = (props) => {
  const [userFormSubmitting, setUserFormSubmitting] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  const { logoURL, bannerURL } = useSelector((state) => state.settings);
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const [formValues, setFormValues] = React.useState({
    logo: logoURL ? logoURL : "",
    featured_image: bannerURL ? bannerURL : "",
  });
  const [validationErrors, setValidationErrors] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [disableSubmitBtn, SetDisableSubmitBtn] = React.useState(true);

  const onSubmit = async (event) => {
    event.preventDefault();
    let formErrors = {};

    // Image Size Validation
    if (formValues.logo.size > 2097152) {
      formErrors.logo = "Logo cannot be greater than 2 MB.";
    }
    if (formValues.featured_image.size < 2097152) {
      formErrors.featured_image = "Featured Image cannot be smaller than 2 MB.";
    }

    if (!formValues.logo) {
      formErrors.logo = "Logo is Required";
    }

    if (!formValues.featured_image) {
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
            ...formValues,
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

  React.useEffect(() => {
    console.log("State Update", logoURL, bannerURL);
  }, [logoURL, bannerURL]);

  React.useEffect(() => {
    if (
      formValues.logo instanceof File ||
      formValues.featured_image instanceof File
    ) {
      SetDisableSubmitBtn(false);
    }
  }, [formValues.logo, formValues.featured_image]);

  const classes = useStyles();

  return (
    <Layout>
      <Grid className={classes.row} container md={12} spacing={0}>
        <ConnectToSocial />

        <Container maxWidth="lg" lg={12} md={12} xs={12} item>
          <div className={classes.formContainer}>
            <Typography className={classes.userType}>
              <strong>Update Logo/Banner</strong>
            </Typography>

            <form className={classes.userManagementForm} onSubmit={onSubmit}>
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

              {/* <Typography className={classes.loginDesc}>
                  {" "}
                  Please select an image to update it*
              </Typography> */}

              <Box mt={3}>
                <Buttons type="submit" disabled={disableSubmitBtn}>
                  Update
                  {userFormSubmitting && <Spinner size={24} />}
                </Buttons>
              </Box>
            </form>
          </div>
        </Container>
      </Grid>
    </Layout>
  );
};

const mapDispatchToProps = { UpdateCustomerBanner };

export default connect(null, mapDispatchToProps)(UserManagement);
