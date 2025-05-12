export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '60px 0',
    justifyContent: 'space-evenly',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(18),
      marginRight: theme.spacing(18),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  loginWelcome: {
    paddingTop: theme.spacing(2),
    color: '#212121',
    fontSize: 38,
    fontWeight: 600,
  },
  loginDesc: {
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 30,
    marginTop: 30,
  },
  MuiFormControlLabel: {
    fontSize: 15,
    fontWeight: 400,
    color: 'lightBlack',
  },
  MuiButton: {
    textTransform: 'none',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 8,
    backgroundColor: '#EDB548',
    color: '#fff',
    fontSize: 15,
    '&:hover': {
      backgroundColor: '#EDB548',
    },
  },
  '.MuiButton-label': {
    color: 'lightBlack',
    fontWeight: 600,
    paddingTop: 15,
    paddingBottom: 15,
  },

  footerText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
    marginRight: 4,
    textDecoration: 'underline',
  },

  privacyPolicy: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 30,
  },
  btnWrapper: {
    position: 'relative',
  },
  loginBannerImg: {
    height: '100vh',
  },
  loginImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  forgotBtnContainer: {
    margin: '30px 0',
  },
  forgotBtn: {
    textTransform: 'capitalize',
    color: '#323132',
    fontWeight: 600,
    fontSize: '15px',
    width: '90%',
    paddingTop: 12,
    paddingBottom: 12,
  },
  placeHolder: {
    fontSize: 12,
  },
  forgotPassword: {
    fontSize: 15,
    color: '#6BCDCE',
    cursor: 'pointer',
    fontWeight: 600,
  },
});
