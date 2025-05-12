const Classes = (theme) => ({
  row: {
    marginTop: '65px',
    minHeight: 'calc(100vh - 65px)',
    background: '#fff',
  },
  formContainer: {
    padding: '15px',
    height: '100%',
  },
  inputField: {
    width: '100%',
  },
  userType: {
    color: '#f8c144',
    fontSize: 20,
    margin: '0px',
    marginBottom: 20,
  },
  imgError: {
    color: ' #f44336',
    fontSize: '0.75rem',
    marginLeft: '15px',
    marginTop: '5px',
  },
  loginDesc: {
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 10,
    marginTop: 20,
    color: '#f44336',
  },

  // Subscription card
  heading: {
    fontSize: '2.1875rem',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    lineHeight: '2.625rem',
    letterSpacing: '-0.00833em',
    margin: '0px',
    color: 'black',
  },
  subHeading: {
    fontSize: '1.25rem',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    lineHeight: 1.5,
    letterSpacing: '0em',
    marginBottom: '16px',
    marginTop: '0px',
    color: 'black',
  },
  box: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '24px',
    margin: '20px 40px',
    border: "1px solid #E0E0E0",
    borderRadius: '6px',
    transitionDuration: '0.4s',
    '@media (max-width : 600px)': {
      maxWidth: '100%',
      padding: '24px',
    },
    "&:hover": {
      boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  select:{
    "& div" :{
      background: "transparent !important"
    }
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  selectContainer: {
    marginTop: '10px',
    width: '190px',
  },
  relative: {
    position: 'relative',
  },
  selectField: {
    paddingLeft: '20px',
    width: '100%',
    height: '40px',
    border: '1px solid grey',
    borderRadius: '6px',
    '&::before': {
      borderBottom: 'none !important',
    },
    '&::after': {
      borderBottom: 'none !important',
    },
    '&:focus-visible': {
      border: 'none',
    },
    '& .MuiSelect-select:focus': {
      borderRadius: '6px !important',
    },
  },
  iconContainer: {
    marginLeft: '20px',
    cursor: 'pointer',
    '& .MuiSvgIcon-root': {
      marginTop: '13px',
      color: '#f8c144',
    },
  },
  link: {
    color: '#f8c144',
    fontWeight: 900,
    textDecoration: 'none',
  },
  text: {
    fontSize: '1rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },

  paper: {
    padding: theme.spacing(4),
  },
  formSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  subscriptionDetail: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '1px solid #e0e0e0',
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
  button: {
    marginRight: theme.spacing(2),
  },
});

export default Classes;
