import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Typography,
  makeStyles,
  withStyles
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { connect, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Alert from '../../Components/AlertBox/Alert';
import Buttons from '../../Components/Buttons/Buttons';
import Layout from '../../Components/Layout';
import Sidebar from '../../Components/Sidebar';
import Spinner from '../../Components/Spinner';
import UploadImg from '../../Components/UploadImg';
import {
  CreateCustomer,
  DeleteCustomer,
  UpdateCustomer,
} from '../../store/actions/CustomersAction';
import * as constant from '../../utils/constant';
import styles from './Styles';
import './Styles/style.css';

const useStyles = makeStyles((theme) => styles(theme));

const StyledTextField = withStyles({
  root: {
    borderRadius: 15,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 12,
      },
    },
  },
})(TextField);

const UserManagement = ({ history }) => {
  const [userFormSubmiting, setUserFormSubmiting] = React.useState(false);
  const [superAdmin, setSuperAdmin] = React.useState(false);
  const [customerAdmin, setCustomerAdmin] = React.useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formValues, setFormValues] = React.useState({
    brandName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    employeeNumber: '',
    position: '',
    role: '',
    logo: '',
    featured_image: '',
    userAccountsLimt: '',
    socialMediaProfilesLimt: '',
  });
  const [errors, setErrors] = React.useState({});
  const [validationErrors, setValidationErrors] = React.useState({});
  const [editData, setEditData] = React.useState({});
  const [refreshImgUploadComponent, setRefreshImgUploadComponent] =
    React.useState(false);
  const [refreshImgUpdateComponent, setRefreshImgUpdateComponent] =
    React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [userAddedAlertOpen, setUserAddedAlertOpen] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState('');

  const handleChange = (event) => {
    let inputValue =
      event.target.name == 'logo' || event.target.name == 'featured_image'
        ? event.target.files[0]
        : event.target.value;

    setFormValues((prevState) => ({
      ...prevState,
      [event.target.name]: inputValue,
    }));
  };

  /* Resetting the form values */
  const resetCustomerForm = () => {
    setFormValues({
      brandName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      employeeNumber: '',
      position: '',
      role: '',
      logo: '',
      featured_image: '',
      userAccountsLimt: '',
      socialMediaProfilesLimt: '',
    });
  };
  React.useEffect(() => {
    if (user.role === constant.CUSTOMER_VIEWER_NAME) {
      history.push('/admin/dashboard');
    }
  }, [user]);

  const onSubmit = async (event) => {
    // Special Characters
    const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const imageExtensions = /\.(jpe?g|png|gif|bmp)$/i;

    event.preventDefault();

    let formErrors = {};

    /** Logo and Banner Validation **/

    // Check for Special Characters
    // if (
    //   user.role === constant.SUPER_ADMIN_NAME &&
    //   specialCharacters.test(formValues.brandName)
    // ) {
    //   formErrors.brandName =
    //     "Sub Domain cannot contain any special characters.";
    // }

    // Check for empty value
    if (
      user.role === constant.SUPER_ADMIN_NAME &&
      customerAdmin &&
      !formValues.brandName
    ) {
      formErrors.brandName = 'Sub Domain is Required';
    }

    if (!formValues.firstName) {
      formErrors.firstName = 'First Name is Required';
    }

    if (!formValues.lastName) {
      formErrors.lastName = 'Last Name is Required';
    }

    if (!formValues.email) {
      formErrors.email = 'Email is Required';
    }
    if (typeof formValues.email !== 'undefined') {
      //regular expression for email validation
      var pattern = new RegExp(constant.EMAIL_PATTERN);
      if (!pattern.test(formValues.email)) {
        formErrors.email = 'Please enter valid email-ID.';
      }
    }
    if (user.role === constant.CUSTOMER_ADMIN_NAME && !formValues.position) {
      formErrors.position = 'Position is Required';
    }
    if (user.role === constant.CUSTOMER_ADMIN_NAME && !formValues.role) {
      formErrors.role = 'User Role is Required';
    }

    if (
      user.role === constant.CUSTOMER_ADMIN_NAME &&
      !formValues.employeeNumber
    ) {
      formErrors.employeeNumber = 'Employee Number is Required';
    }
    if (!formValues.phoneNumber) {
      formErrors.phoneNumber = 'Contact Number is Required';
    }
    /* checking if the fields contains only number */
    if (isNaN(formValues.phoneNumber)) {
      formErrors.phoneNumber = 'Contact Number must be a valid ';
    }
    if (specialCharacters.test(formValues.phoneNumber)) {
      formErrors.phoneNumber =
        'Contact Number cannot contain any special characters.';
    }
    if (
      user.role === constant.SUPER_ADMIN_NAME &&
      customerAdmin &&
      !formValues.userAccountsLimt
    ) {
      formErrors.userAccountsLimt = ' Account limit is Required';
    }
    if (isNaN(formValues.userAccountsLimt)) {
      formErrors.userAccountsLimt =
        'The user account limit must be an integer  ';
    }
    if (formValues.userAccountsLimt === '0') {
      formErrors.userAccountsLimt =
        'The user account limit must be greater than 0 ';
    }
    if (specialCharacters.test(formValues.userAccountsLimt)) {
      formErrors.userAccountsLimt =
        'Account limit cannot contain any special characters.';
    }
    if (
      user.role === constant.SUPER_ADMIN_NAME &&
      customerAdmin &&
      !formValues.socialMediaProfilesLimt
    ) {
      formErrors.socialMediaProfilesLimt =
        ' Social Media Profile limit is Required';
    }
    if (isNaN(formValues.socialMediaProfilesLimt)) {
      formErrors.socialMediaProfilesLimt =
        'The social media profile limit must be an integer ';
    }
    if (formValues.socialMediaProfilesLimt === '0') {
      formErrors.socialMediaProfilesLimt =
        'Social Media Profile limit must be greater than 0 ';
    }
    if (specialCharacters.test(formValues.socialMediaProfilesLimt)) {
      formErrors.socialMediaProfilesLimt =
        'Social Media Profile limit cannot contain any special characters.';
    }

    // Create Validation due to API data structuring
    if (Object.keys(editData).length === 0) {
      // File type validation
      if (
        user.role === constant.SUPER_ADMIN_NAME &&
        customerAdmin &&
        !imageExtensions.test(formValues.logo.name)
      ) {
        formErrors.logo = 'Image must be valid image file.';
      }
      if (
        user.role === constant.SUPER_ADMIN_NAME &&
        customerAdmin &&
        !imageExtensions.test(formValues.featured_image.name)
      ) {
        formErrors.featured_image = 'Image must be valid image file.';
      }

      // Image Size Validation
      // if (
      //   user.role === constant.SUPER_ADMIN_NAME &&
      //   customerAdmin &&
      //   formValues.logo.size > 2097152
      // ) {
      //   formErrors.logo = "Logo cannot be greater than 2 MB.";
      // }
      // if (
      //   user.role === constant.SUPER_ADMIN_NAME &&
      //   customerAdmin &&
      //   formValues.featured_image.size < 2097152
      // ) {
      //   formErrors.featured_image =
      //     "Featured Image cannot be smaller than 2 MB.";
      // }
    }

    // Edit Validation due to API data structuring
    else {
      // File type validation
      if (
        user.role === constant.SUPER_ADMIN_NAME &&
        customerAdmin &&
        !imageExtensions.test(editData.CustomerSubdomain.logo)
      ) {
        formErrors.logo = 'Image must be valid image file.';
      }
      if (
        user.role === constant.SUPER_ADMIN_NAME &&
        customerAdmin &&
        !imageExtensions.test(editData.CustomerSubdomain.feature_image)
      ) {
        formErrors.featured_image = 'Image must be valid image file.';
      }

      // Image Size Validation
      // if (
      //   user.role === constant.SUPER_ADMIN_NAME &&
      //   customerAdmin &&
      //   formValues.logo.size > 2097152
      // ) {
      //   formErrors.logo = "Logo cannot be greater than 2 MB.";
      // }
      // if (
      //   user.role === constant.SUPER_ADMIN_NAME &&
      //   customerAdmin &&
      //   formValues.featured_image.size < 2097152
      // ) {
      //   formErrors.featured_image =
      //     "Featured Image cannot be smaller than 2 MB.";
      // }
    }

    if (
      user.role === constant.SUPER_ADMIN_NAME &&
      customerAdmin &&
      !formValues.logo
    ) {
      formErrors.logo = 'Logo is Required';
    }

    if (
      user.role === constant.SUPER_ADMIN_NAME &&
      customerAdmin &&
      !formValues.featured_image
    ) {
      formErrors.featured_image = 'Brand banner image is Required';
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      //call api and add user data
      setUserFormSubmiting(true);

      if (Object.keys(editData).length === 0) {
        /* Creating customer */
        try {
          const createResponse = await dispatch(CreateCustomer(formValues));
          const createResData = createResponse.data.message;
          setUserAddedAlertOpen(true);
          setResponseMessage(createResData);
          resetCustomerForm();
          setUserFormSubmiting(false);
          setRefreshImgUploadComponent(true);
          setValidationErrors({});
          setCustomerAdmin(true);
          setSuperAdmin(false);
        } catch (error) {
          /* error caught while creating customer */
          if (error.response) {
            toast.error(error.response.data.message);
            const createResError = await error.response.data;
            const createErrorMsg = createResError.message;
            setUserFormSubmiting(false);
            setRefreshImgUploadComponent(false);
            setValidationErrors(createErrorMsg);
          } else {
            toast.error('Check your internet connection');
            setUserFormSubmiting(false);
            setRefreshImgUploadComponent(false);
          }
        }
      } else {
        /* Updating customer */
        try {
          const updateResponse = await dispatch(
            UpdateCustomer({
              ...formValues,
              id: editData.id,
              active: editData.active,
            })
          );
          const updateResData = updateResponse.data.message;
          setUserAddedAlertOpen(true);
          setResponseMessage(updateResData);
          resetCustomerForm();
          setUserFormSubmiting(false);
          setRefreshImgUploadComponent(true);
          setRefreshImgUpdateComponent(true);
          setEditData({});
          setValidationErrors({});
          setCustomerAdmin(true);
          setSuperAdmin(false);
        } catch (error) {
          /* error caught while updating customer */
          if (error.response) {
            const updateresError = error.response.data.message;
            setValidationErrors(updateresError);
            setUserFormSubmiting(false);
          } else {
            toast.error('Check your internet connection');
            setUserFormSubmiting(false);
          }
        }
      }
    }
  };

  const getSelectedData = (editInfoData) => {
    setEditData(editInfoData);
    setErrors({});
  };
  const addUserData = () => {
    resetCustomerForm();
    setEditData({});
    setErrors({});
    setSuperAdmin(false);
    setCustomerAdmin(true);
  };

  React.useEffect(() => {
    if (editData !== {}) {
      let brandName = editData.CustomerSubdomain
        ? editData.CustomerSubdomain.subdomain
        : '';
      let logo = editData.CustomerSubdomain
        ? editData.CustomerSubdomain.logo
        : '';
      let featured_image = editData.CustomerSubdomain
        ? editData.CustomerSubdomain.feature_image
        : '';
      let user_accounts_limit = editData.CustomerSubdomain
        ? editData.CustomerSubdomain.user_accounts_limit
        : '';
      let social_media_profiles_limit = editData.CustomerSubdomain
        ? editData.CustomerSubdomain.social_media_profiles_limit
        : '';

      setFormValues({
        brandName: brandName,
        firstName: editData.first_name,
        lastName: editData.last_name,
        email: editData.email,
        phoneNumber: editData.contact_number,
        employeeNumber: editData.employee_number,
        position: editData.position,
        role: editData.role,
        logo: logo,
        featured_image: featured_image,
        userAccountsLimt: user_accounts_limit,
        socialMediaProfilesLimt: social_media_profiles_limit,
      });
      setValidationErrors({});
    } else {
      resetCustomerForm();
    }
    /* switching form on editing user  */
    if (editData.role === constant.SUPER_ADMIN_NAME) {
      setSuperAdmin(true);
      setCustomerAdmin(false);
    }
    if (editData.role === constant.CUSTOMER_ADMIN_NAME) {
      setSuperAdmin(false);
      setCustomerAdmin(true);
    }
  }, [editData]);

  /* checking for api response after submit>> */

  /* SETTING logo IMAGE TO STATE */
  const logoImageHandler = (item) => {
    setFormValues((prevState) => ({
      ...prevState,
      logo: item,
    }));
  };

  /* SETTING BANNER IMAGE TO STATE */
  const bannerImageHandler = (item) => {
    setFormValues((prevState) => ({
      ...prevState,
      featured_image: item,
    }));
  };

  /* deleteing selected customer */
  const handleDelete = async () => {
    if (editData) {
      try {
        await dispatch(DeleteCustomer(editData.id));
        resetCustomerForm();
        setEditData({});
        resetCustomerForm();
        setSuperAdmin(false);
        setCustomerAdmin(true);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Check your internet connection');
        }
      }
    }
  };

  /* switching form for super-admin  */
  const changeSuperAdmin = () => {
    setSuperAdmin(true);
    setCustomerAdmin(false);
    resetCustomerForm();
    setValidationErrors({});
    setErrors({});
    setEditData({});
  };

  /* switching form for customer-admin  */
  const changeCustomerAdmin = () => {
    setCustomerAdmin(true);
    setSuperAdmin(false);
    resetCustomerForm();
    setErrors({});
    setValidationErrors({});
    setEditData({});
  };

  /* setting role value inside formValues object */
  React.useEffect(() => {
    if (superAdmin) {
      setFormValues({
        ...formValues,
        role: constant.SUPER_ADMIN_NAME,
      });
    }
  }, [superAdmin]);

  /* deleting added social media profiles dialog opens */
  const deleteUser = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };

  /*handling cancle buttom */
  const handleCancle = () => {
    resetCustomerForm();
    setEditData({});
    setErrors({});
    setValidationErrors({});
    setSuperAdmin(false);
    setCustomerAdmin(true);
  };

  const classes = useStyles();

  const menuProps = {
    borderRadius: '12px',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
      borderRadius: 12,
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
  };
  return (
    <Layout>
      <Grid
        className={classes.row}
        container
        md={12}
        spacing={0}
      >
        <Grid
          xl={3}
          lg={4}
          md={5}
          sm={12}
          xs={12}
          item
        >
          <Sidebar
            getSelectedData={getSelectedData}
            addUserData={addUserData}
            resetForm={resetCustomerForm}
            editData={setEditData}
            validationErrors={setValidationErrors}
            errors={setErrors}
            userFormSubmiting={userFormSubmiting}
            responseMessage={responseMessage}
            handleCancle={handleCancle}
          />
        </Grid>
        <Grid
          className={classes.formContainer}
          xl={9}
          lg={8}
          md={7}
          sm={12}
          xs={12}
          item
        >
          <Container maxWidth='xl'>
            {Object.keys(editData).length === 0 ? (
              <Typography className={classes.userType}>
                <strong>New User</strong>
              </Typography>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography className={classes.userType}>
                  <strong>Update User</strong>
                </Typography>
                <Buttons
                  style={{
                    backgroundColor: '#F44336',
                    borderColor: '#F44336',
                    color: '#fff',
                  }}
                  onClick={deleteUser}
                >
                  Delete User
                </Buttons>
                <Alert
                  alert={itemToDelete}
                  icon={
                    <ErrorOutlineIcon
                      style={{
                        fontSize: '5rem',
                        color: '#f50057',
                        paddingBottom: 0,
                      }}
                    />
                  }
                  title='Are you sure?'
                  confirmBtn='DELETE'
                  description="You're about to Delete the profile. This process cannot be undone."
                  open={deleteAlertOpen}
                  setOpen={setDeleteAlertOpen}
                  onConfirm={handleDelete}
                  buttonbgcolor='#f50057'
                />
              </div>
            )}
            {user.role === constant.SUPER_ADMIN_NAME ? (
              Object.keys(editData).length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='outlined'
                    style={{
                      padding: 10,
                      borderRadius: 15,
                      marginRight: '60px',
                      backgroundColor: customerAdmin ? '#FBE281' : '',
                      border: customerAdmin
                        ? 'none'
                        : '1px solid rgba(0, 0, 0, 0.23)',
                    }}
                    onClick={changeCustomerAdmin}
                    disabled={Object.keys(editData).length !== 0 ? true : false}
                  >
                    Create Customer Admin
                  </Button>
                  <Button
                    variant='outlined'
                    style={{
                      padding: 10,
                      borderRadius: 15,
                      backgroundColor: superAdmin ? '#FBE281' : '',
                      border: superAdmin
                        ? 'none'
                        : '1px solid rgba(0, 0, 0, 0.23)',
                    }}
                    onClick={changeSuperAdmin}
                    disabled={
                      editData &&
                      editData.role === 'customer-admin' &&
                      !superAdmin
                        ? true
                        : false
                    }
                  >
                    {' '}
                    Create Super Admin{' '}
                  </Button>
                </div>
              ) : (
                ''
              )
            ) : (
              ''
            )}
           <form
              container
              className={classes.userManagementForm}
              onSubmit={onSubmit}
            >
              <Grid
                container
                spacing={3}
              >
                {user.role === constant.SUPER_ADMIN_NAME ? (
                  superAdmin ? (
                    ''
                  ) : (
                    <Grid
                      item
                      xs={12}
                    >
                      <StyledTextField
                        className={classes.inputField}
                        type='text'
                        id='brandName'
                        label='Sub Domain*'
                        variant='outlined'
                        error={
                          errors.brandName || validationErrors.subdomain
                            ? true
                            : false
                        }
                        helperText={
                          (errors && errors.brandName) ||
                          (validationErrors.subdomain &&
                            validationErrors.subdomain.message)
                        }
                        value={formValues.brandName}
                        name='brandName'
                        onChange={handleChange}
                        disabled={false}
                      />
                    </Grid>
                  )
                ) : (
                  ' '
                )}
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <StyledTextField
                    className={classes.inputField}
                    type='text'
                    id='firstName'
                    label='First Name*'
                    variant='outlined'
                    error={errors.firstName ? true : false}
                    helperText={errors && errors.firstName}
                    value={formValues.firstName}
                    name='firstName'
                    title='First Name'
                    // ref={firstNameInput}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <StyledTextField
                    className={classes.inputField}
                    type='text'
                    id='lastName'
                    label='Last Name*'
                    variant='outlined'
                    error={errors.lastName ? true : false}
                    helperText={errors && errors.lastName}
                    value={formValues.lastName}
                    title='Last Name'
                    name='lastName'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <StyledTextField
                    item
                    className={classes.inputField}
                    type='text'
                    id='email'
                    label='Email*'
                    variant='outlined'
                    error={
                      errors.email || validationErrors.email ? true : false
                    }
                    helperText={
                      (errors && errors.email) ||
                      (validationErrors.email && validationErrors.email.message)
                    }
                    value={formValues.email}
                    name='email'
                    title='Email'
                    onChange={handleChange}
                  />
                </Grid>
                {user.role === constant.CUSTOMER_ADMIN_NAME && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <StyledTextField
                      item
                      lg={6}
                      className={classes.inputField}
                      type='text'
                      id='employeeNumber'
                      label='Employee Number*'
                      variant='outlined'
                      error={
                        errors.employeeNumber || validationErrors.employeeNumber
                          ? true
                          : false
                      }
                      helperText={
                        (errors && errors.employeeNumber) ||
                        (validationErrors.employeeNumber &&
                          validationErrors.employeeNumber)
                      }
                      value={formValues.employeeNumber}
                      name='employeeNumber'
                      title='Employee Number'
                      onChange={handleChange}
                    />
                  </Grid>
                )}
                {user.role === constant.CUSTOMER_ADMIN_NAME && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <StyledTextField
                      item
                      lg={6}
                      className={classes.inputField}
                      type='text'
                      id='position'
                      label='Position*'
                      variant='outlined'
                      error={
                        errors.position || validationErrors.position
                          ? true
                          : false
                      }
                      helperText={
                        (errors && errors.position) ||
                        (validationErrors.position && validationErrors.position)
                      }
                      value={formValues.position}
                      name='position'
                      title='Position'
                      onChange={handleChange}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <StyledTextField
                    item
                    lg={6}
                    className={classes.inputField}
                    type='text'
                    id='phoneNumber'
                    label='Phone Number*'
                    variant='outlined'
                    error={
                      errors.phoneNumber || validationErrors.contact_number
                        ? true
                        : false
                    }
                    helperText={
                      (errors && errors.phoneNumber) ||
                      (validationErrors.contact_number &&
                        validationErrors.contact_number.message)
                    }
                    value={formValues.phoneNumber}
                    name='phoneNumber'
                    title='Phone Number'
                    onChange={handleChange}
                  />
                </Grid>
                {user.role === constant.SUPER_ADMIN_NAME ? (
                  superAdmin ? (
                    ''
                  ) : (
                    <Grid
                      item
                      xs={12}
                      md={6}
                    >
                      <StyledTextField
                        item
                        lg={6}
                        className={classes.inputField}
                        type='text'
                        id='userAccountsLimt'
                        label='No. of Account Limit*'
                        variant='outlined'
                        error={
                          errors.userAccountsLimt ||
                          validationErrors.user_accounts_limit
                            ? true
                            : false
                        }
                        helperText={
                          (errors && errors.userAccountsLimt) ||
                          (validationErrors.user_accounts_limit &&
                            validationErrors.user_accounts_limit.message)
                        }
                        value={formValues.userAccountsLimt}
                        name='userAccountsLimt'
                        title='No. of Account Limit'
                        onChange={handleChange}
                      />
                    </Grid>
                  )
                ) : (
                  ''
                )}

                {user.role === constant.SUPER_ADMIN_NAME ? (
                  superAdmin ? (
                    ' '
                  ) : (
                    <Grid
                      item
                      xs={12}
                      md={6}
                    >
                      <StyledTextField
                        item
                        lg={6}
                        className={classes.inputField}
                        type='text'
                        id='socialMediaProfilesLimt'
                        label='No. of Social Media Profile Limit*'
                        variant='outlined'
                        error={
                          errors.socialMediaProfilesLimt ||
                          validationErrors.social_media_profiles_limit
                            ? true
                            : false
                        }
                        helperText={
                          (errors && errors.socialMediaProfilesLimt) ||
                          (validationErrors.social_media_profiles_limit &&
                            validationErrors.social_media_profiles_limit
                              .message)
                        }
                        value={formValues.socialMediaProfilesLimt}
                        name='socialMediaProfilesLimt'
                        title='No. of Social Media Profile Limit'
                        onChange={handleChange}
                      />
                    </Grid>
                  )
                ) : (
                  ''
                )}

                {user.role === constant.SUPER_ADMIN_NAME ? (
                  ''
                ) : (
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <FormControl
                      style={{ width: '100%' }}
                      variant='outlined'
                    >
                      <Select
                        style={{
                          width: '100%',
                          borderRadius: 12,
                          color: 'rgba(0, 0, 0, 0.5)',
                        }}
                        aria-label='role'
                        name='role'
                        value={formValues.role ? formValues.role : ''}
                        error={errors.role ? true : false}
                        onChange={handleChange}
                        MenuProps={menuProps}
                        displayEmpty
                        defaultValue='customer-admin'
                      >
                        <MenuItem
                          value=''
                          disabled
                        >
                          User Role*
                        </MenuItem>
                        <MenuItem value='customer-admin'>Admin</MenuItem>
                        <MenuItem value='customer-viewer'>Viewer</MenuItem>
                      </Select>
                      {errors.role ? (
                        <FormHelperText className={classes.errorHelperText}>
                          User Role is Required
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                  </Grid>
                )}

                {user.role === constant.SUPER_ADMIN_NAME ? (
                  <Grid
                    container
                    spacing={3}
                    className={classes.fileUploadConatiner}
                  >
                    {superAdmin ? (
                      ''
                    ) : (
                      <Grid
                        item
                        xs={12}
                        lg={6}
                      >
                        <UploadImg
                          id='upload-logo'
                          title='Upload Logo'
                          name='logo'
                          defaultImg={
                            editData.CustomerSubdomain
                              ? editData.CustomerSubdomain.logo
                              : ''
                          }
                          getSelectedData={(item) => {
                            logoImageHandler(item);
                          }}
                          refresh={refreshImgUploadComponent}
                          setRefreshImgUploadComponent={
                            setRefreshImgUploadComponent
                          }
                        />
                        <Typography className={classes.imgError}>
                          {' '}
                          {(errors && errors.logo) ||
                            (validationErrors.logo &&
                              validationErrors.logo.message) ||
                            (validationErrors.brand_logo_size &&
                              validationErrors.brand_logo_size)}{' '}
                        </Typography>
                      </Grid>
                    )}

                    {superAdmin ? (
                      ''
                    ) : (
                      <Grid
                        item
                        xs={12}
                        lg={6}
                      >
                        <UploadImg
                          id='upload-banner'
                          title='Upload Banner'
                          name='featured_image'
                          defaultImg={
                            editData.CustomerSubdomain
                              ? editData.CustomerSubdomain.feature_image
                              : ''
                          }
                          getSelectedData={(item) => {
                            bannerImageHandler(item);
                          }}
                          refresh={refreshImgUploadComponent}
                          setRefreshImgUploadComponent={
                            setRefreshImgUploadComponent
                          }
                        />
                        <Typography className={classes.imgError}>
                          {' '}
                          {(errors && errors.featured_image) ||
                            (validationErrors.featured_image &&
                              validationErrors.featured_image.message) ||
                            (validationErrors.brand_featured_size &&
                              validationErrors.brand_featured_size)}{' '}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>

              <Box mt={3}>
                {Object.keys(editData).length !== 0 && (
                  <Buttons
                    disabled={userFormSubmiting}
                    onClick={handleCancle}
                    style={{
                      backgroundColor: '#49fcea',
                      borderColor: '#49fcea',
                      marginRight: 30,
                    }}
                  >
                    Cancel
                  </Buttons>
                )}
                <Buttons
                  type='submit'
                  disabled={userFormSubmiting}
                >
                  {Object.keys(editData).length === 0 ? 'Save' : 'Update'}

                  {userFormSubmiting && <Spinner size={24} />}
                </Buttons>
              </Box>
            </form>
          </Container>
        </Grid>
      </Grid>
      {userAddedAlertOpen && (
        <Dialog
          open={userAddedAlertOpen}
          aria-labelledby='alert-box'
          maxWidth={'sm'}
          fullWidth={true}
        >
          <DialogTitle
            id='alert-box'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <CheckCircleOutlineIcon
              style={{ width: 90, height: 90, color: '#28a745' }}
            />
          </DialogTitle>
          <DialogTitle
            id='alert-box'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {' '}
            {responseMessage}
          </DialogTitle>

          <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
            <Buttons
              className={classes.btnItem}
              onClick={() => {
                setUserAddedAlertOpen(false);
                setResponseMessage('');
              }}
              variant='contained'
            >
              done
            </Buttons>
          </DialogActions>
        </Dialog>
      )}
    </Layout>
  );
};

const mapDispatchToProps = { CreateCustomer, UpdateCustomer };

export default connect(null, mapDispatchToProps)(UserManagement);
