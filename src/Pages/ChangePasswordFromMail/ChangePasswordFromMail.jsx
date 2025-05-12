
import {
  Grid,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Buttons from '../../Components/Buttons/Buttons';
import { connect } from 'react-redux';
import { ChangePasswordEmailVerification } from '../../store/actions/AuthAction';
import Spinner from '../../Components/Spinner';
// Default Profile Page Styles
import styles from '../Login/Styles';
// Password Requirements
import * as constant from '../../utils/constant';

// Default Login Page Styles
const useStyles = makeStyles((theme) => styles(theme));

const ChangePasswordFromMail = ({ history }) => {
  const { logoURL, bannerURL } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down('md'));
  const { apiRes } = useSelector((state) => state.apiResReducer);
  const { changePasswordLoading, password } = useSelector(
    (state) => state.auth
  );
  const [passwordValues, setPasswordValues] = React.useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const url_string = window.location.href;
  var url = new URL(url_string);
  var authorization_token = url.searchParams.get('Authorization');

  const [passwordErrors, setErrorsPassword] = React.useState({});
  const handleChange = (event) => {
    setPasswordValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = {};

    // Password minumum requirements which includes lower case letter, upper case letter, numbers and special characters and minimum 8 characters
    if (!constant.PASSWORD_PATTERN.test(passwordValues.newPassword)) {
      formErrors.newPasswordError =
        'Password must contain a minimum 8 characters, at least one number, one uppercase letter, one lowercase letter.';
    }
    // Check if password and confirm password are same
    if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
      formErrors.confirmNewPasswordError =
        'New password and confirm password does not match.';
    }
    // Check empty value
    if (!passwordValues.newPassword) {
      formErrors.newPasswordError = 'New Password is Required*';
    }
    if (!passwordValues.confirmNewPassword) {
      formErrors.confirmNewPasswordError = 'Confirm Password is Required*';
    }

    setErrorsPassword(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await dispatch(
        ChangePasswordEmailVerification(
          authorization_token,
          passwordValues.newPassword
        )
      );
    }
  };

  React.useEffect(() => {
    if (password && password.status) {
      history.push('/login');
    }
  }, [password]);

  // Default Login Page Styles
  const classes = useStyles();
  return (
    <Grid container>
      <Grid
        item
        xl={6}
        lg={6}
        md={12}
        sm={12}
        xs={12}
      >
        <div className={classes.root}>
          <Typography className={classes.loginTitle}>
            <img
              src={logoURL}
              height='70'
              alt='logo-image'
            />
          </Typography>
          <Grid>
            <Typography className={classes.loginWelcome}>
              Reset Password
            </Typography>
            <Typography className={classes.loginDesc}>
              {' '}
              Please use a strong password consisting a mix of letters, numbers
              & symbols to make your account secure.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={3}
                justifyContent='space-between'
              >
                <Grid
                  item
                  xs={12}
                >
                  <TextField
                    lg={12}
                    className={classes.inputField}
                    variant='outlined'
                    title='Password'
                    label='New Password'
                    error={
                      passwordErrors && passwordErrors.newPasswordError
                        ? true
                        : false
                    }
                    helperText={
                      passwordErrors && passwordErrors.newPasswordError
                    }
                    name='newPassword'
                    value={passwordValues.newPassword}
                    onChange={handleChange}
                    fullWidth
                    type='password'
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextField
                    lg={12}
                    className={classes.inputField}
                    variant='outlined'
                    label='Confirm Password'
                    title='Confirm Password'
                    name='confirmNewPassword'
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
                    type='password'
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                >
                  <div className={classes.btnWrapper}>
                    <Buttons
                      className={classes.MuiButton}
                      fullWidth
                      disableElevation
                      type='submit'
                      disabled={changePasswordLoading}
                    >
                      Reset
                    </Buttons>
                    {changePasswordLoading && <Spinner size={24} />}
                  </div>
                </Grid>
              </Grid>

              <Grid
                item
                container
                direction='row'
                justify='center'
                alignItems='center'
                style={{ marginTop: 20 }}
              >
                <Typography>
                  {' '}
                  <h3
                    className='forgot-password'
                    style={{ color: '#323132', fontWeight: 'normal' }}
                  >
                    Remember your Password?
                  </h3>
                </Typography>
                {'    '}
                <Typography
                  component={Link}
                  to='/login'
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className='forgot-password'>&nbsp;Log in</h3>
                </Typography>
              </Grid>
            </form>
          </Grid>

          <div className={classes.privacyPolicy}>
            <Typography className={classes.footerText}>Privacy</Typography>
            <div>|</div>
            <Typography className={classes.footerText}>
              Terms Of Service
            </Typography>
          </div>
        </div>
      </Grid>
      {!match && (
        <Grid
          className={classes.loginBannerImg}
          item
          xl={6}
          lg={6}
        >
          <img
            className={classes.loginImg}
            src={bannerURL}
            alt='Banner Image'
          />
        </Grid>
      )}
    </Grid>
  );
};

const mapDispatchToProps = { ChangePasswordEmailVerification };
// connect(null, mapDispatchToProps), withRouter(ChangePasswordFromMail);

export default withRouter(
  connect(null, mapDispatchToProps)(ChangePasswordFromMail)
);
