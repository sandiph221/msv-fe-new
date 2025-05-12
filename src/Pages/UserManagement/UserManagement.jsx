import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  withStyles,
} from '@mui/material';

import Layout from '../../Components/Layout';

import { Delete, Edit } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Buttons from 'Components/Buttons/Buttons';
import UploadImg from 'Components/UploadImg';
import { connect, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getPagesInfo } from 'store/actions/SuperAdminDashboardAction';
import Alert from '../../Components/AlertBox/Alert';
import Spinner from '../../Components/Spinner';
import {
  CreateCustomer,
  DeleteCustomer,
  GetCustomer,
  PaginateCustomer,
  SearchCustomer,
  UpdateCustomer,
} from '../../store/actions/CustomersAction';
import * as constant from '../../utils/constant';
import { Styles } from './Styles';
import './Styles/style.css';

const useStyles = makeStyles((theme) => Styles(theme));

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
  const dispatch = useDispatch();
  const [userFormSubmitting, setUserFormSubmitting] = React.useState(false);
  const [superAdmin, setSuperAdmin] = React.useState(false);
  const [customerAdmin, setCustomerAdmin] = React.useState(true);
  const { user } = useSelector((state) => state.auth);
  const { logoUrl, bannerUrl } = useSelector((state) => state.settings);
  const [formValues, setFormValues] = React.useState({
    id: '',
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleModalOpen = (row = {}) => {
    setEditData(row);
    setFormValues(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData({});
    resetCustomerForm();
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { customers, getCustomersLoading } = useSelector(
    (state) => state.customerInfo
  );

  async function fetchCustomers() {
    await dispatch(GetCustomer());
    // setPage(1)
  }

  async function fetchNewCustomers(page) {
    await dispatch(PaginateCustomer(page));
  }

  async function fetchSearchCustomers(page, search) {
    await dispatch(SearchCustomer(page, search));
  }

  const handlePageChange = (pageNumber) => {
    dispatch(getPagesInfo(pageNumber));
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (event) => {
    let inputValue =
      event.target.name === 'logo' || event.target.name === 'featured_image'
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
      setUserFormSubmitting(true);

      if (Object.keys(editData).length === 0) {
        /* Creating customer */
        try {
          const createResponse = await dispatch(CreateCustomer(formValues));
          const createResData = createResponse.data.message;
          setUserAddedAlertOpen(true);
          setResponseMessage(createResData);
          resetCustomerForm();
          setUserFormSubmitting(false);
          setRefreshImgUploadComponent(true);
          setValidationErrors({});
          setCustomerAdmin(true);
          setSuperAdmin(false);
          handleModalClose();
        } catch (error) {
          /* error caught while creating customer */
          if (error.response) {
            toast.error(error.response.data.message);
            const createResError = await error.response.data;
            const createErrorMsg = createResError.message;
            setUserFormSubmitting(false);
            setRefreshImgUploadComponent(false);
            setValidationErrors(createErrorMsg);
          } else {
            toast.error('Check your internet connection');
            setUserFormSubmitting(false);
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
          setUserFormSubmitting(false);
          setRefreshImgUploadComponent(true);
          setRefreshImgUpdateComponent(true);
          setEditData({});
          setValidationErrors({});
          setCustomerAdmin(true);
          setSuperAdmin(false);
          handleModalClose();
        } catch (error) {
          /* error caught while updating customer */
          if (error.response) {
            const updateresError = error.response.data.message;
            setValidationErrors(updateresError);
            setUserFormSubmitting(false);
          } else {
            toast.error('Check your internet connection');
            setUserFormSubmitting(false);
          }
        }
      }
    }
  };

  const addUserData = () => {
    // resetCustomerForm();
    // setEditData({});
    // setErrors({});
    // setSuperAdmin(false);
    // setCustomerAdmin(true);

    handleModalOpen();
  };

  React.useEffect(() => {
    if (Object.keys(editData).length !== 0) {
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
        id: editData.id,
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

  const handleEdit = () => {
    handleModalOpen(selectedRow);
    handleMenuClose();
  };

  /* deleting selected customer */
  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await dispatch(DeleteCustomer(selectedRow.id));
        resetCustomerForm();
        setEditData({});
        resetCustomerForm();
        setSuperAdmin(false);
        setCustomerAdmin(true);
        handleMenuClose();
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
    setItemToDelete(selectedRow);
  };

  /*handling cancel buttom */
  const handleCancel = () => {
    resetCustomerForm();
    setEditData({});
    setErrors({});
    setValidationErrors({});
    setSuperAdmin(false);
    setCustomerAdmin(true);
    handleModalClose();
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

  const columns = [
    ...(user.role === constant.CUSTOMER_ADMIN_NAME
      ? [{ id: 'employee_number', label: 'Employee ID', minWidth: 170 }]
      : []),
    { id: 'first_name', label: 'First Name', minWidth: 170 },
    { id: 'last_name', label: 'Last Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'position', label: 'Position', minWidth: 170 },
    ...(user.role === constant.SUPER_ADMIN_NAME
      ? [
          {
            id: 'subdomain',
            label: 'Subdomain',
            minWidth: 170,
            format: (value) => value.CustomerSubdomain.subdomain,
          },
        ]
      : []),
    { id: 'action', label: 'Action', minWidth: 80, align: "right" },
  ];

  return (
    <Layout>
      <div className={classes.main}>
        <div
          style={{ padding: 10 }}
          className='dashboardPageContainer'
        >
          <Container
            disableGutters
            maxWidth='xl'
          >
            <Box className={classes.topFilter}>
              <Grid
                container
                spacing={2}
                justifyContent='space-between'
              >
                <Grid
                  item
                  style={{ display: 'flex' }}
                >
                  {/* <FilterDays

                /> */}
                  <Buttons
                    variant='contained'
                    color='primary'
                    onClick={addUserData}
                    style={{ marginBottom: '16px' }}
                  >
                    Add User
                  </Buttons>
                </Grid>
              </Grid>
            </Box>
            {/* <PageTitle /> */}
            <Grid container>
              {getCustomersLoading ? (
                <Spinner />
              ) : (
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table
                      stickyHeader
                      aria-label='sticky table'
                    >
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customers?.users &&
                          customers.users
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role='checkbox'
                                  tabIndex={-1}
                                  key={row.code}
                                >
                                  {columns.map((column) => {
                                    const value =
                                      column.id === 'subdomain'
                                        ? column.format(row)
                                        : row[column.id];

                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.id === 'action' ? (
                                          <IconButton
                                            onClick={(event) =>
                                              handleMenuOpen(event, row)
                                            }
                                          >
                                            <MoreVertIcon />
                                          </IconButton>
                                        ) : column.format &&
                                          typeof value === 'number' ? (
                                          column.format(value)
                                        ) : (
                                          value
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                      </TableBody>
                    </Table>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>
                        <Edit
                          color='primary'
                          style={{ marginRight: 10 }}
                        />{' '}
                        Edit
                      </MenuItem>
                      <MenuItem onClick={deleteUser}>
                        <Delete
                          color='secondary'
                          style={{ marginRight: 10 }}
                        />{' '}
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component='div'
                    count={
                      customers?.users?.length ? customers?.users?.length : 0
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              )}
              <Alert
                alert={selectedRow}
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
            </Grid>
          </Container>
        </div>
      </div>
      <Modal
        style={{ overflow: 'scroll', maxWidth: '100%' }}
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby='user-modal-title'
        aria-describedby='user-modal-description'
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', // Adjust the modal width here
            maxWidth: '1200px', // Optional, to cap the maximum width
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            height: 'calc(100vh - 24px)',
            overflow: 'scroll',
            borderRadius: 8,
          }}
        >
          <Typography
            variant='h6'
            id='user-modal-title'
          >
            {formValues.id ? 'Edit User' : 'Add User'}
          </Typography>
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
                  error={errors.email || validationErrors.email ? true : false}
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
                          validationErrors.social_media_profiles_limit.message)
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
              <Buttons
                disabled={userFormSubmitting}
                onClick={handleCancel}
                style={{
                  backgroundColor: '#49fcea',
                  borderColor: '#49fcea',
                  marginRight: 30,
                }}
              >
                Cancel
              </Buttons>
              <Buttons
                type='submit'
                disabled={userFormSubmitting}
              >
                {Object.keys(editData).length === 0 ? 'Save' : 'Update'}

                {userFormSubmitting && <Spinner size={24} />}
              </Buttons>
            </Box>
          </form>
        </Box>
      </Modal>
    </Layout>
  );
};

const mapDispatchToProps = { CreateCustomer, UpdateCustomer };

export default connect(null, mapDispatchToProps)(UserManagement);
