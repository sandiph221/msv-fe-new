// export default (theme) => ({
//   row: {
//     marginTop: "65px",
//     minHeight: "calc(100vh - 65px)",
//   },


//   formContainer: {
//     padding: "55px 30px",
//     background: "#fff",
//     height: "100%",
//     minHeight: "calc(100vh - 65px)",
//   },

//   inputField: {
//     width: "100%",
//     borderRadius: 30,
//     // padding: "15px 14px",
//   },

//   errorHelperText: {
//     color: "#f44336"
//   },

//   userType: {
//     color: "#f8c144",
//     fontSize: 24,
//   },
//   userManagementForm: {
//     // width: "calc(100vh - 60px)",
//     marginTop: 20,
//   },
//   fileUploadConatiner: {
//     display: "flex",
//     margin: 0,
//   },
//   fileUploadbutton: {
//     backgroundColor: "#FBE281",
//   },
//   radio: {
//     "&$checked": {
//       color: "#FBE281",
//     },
//   },
//   checked: {},
//   imgError: {
//     color: " #f44336",
//     fontSize: "0.75rem",
//     marginLeft: "15px",
//     marginTop: "5px",
//   },
// });
export const Styles = (theme) => ({
  main: {
    padding: (props) => (props.sm ? '15px 0px' : '15px 40px'),
    marginTop: 75,
    minHeight: '84vh',
  },
  root: {
    width: '100%',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.1)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  container: {
    maxHeight: 440,
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: '8px',
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },

  row: {
    marginTop: '65px',
    minHeight: 'calc(100vh - 65px)',
  },

  formContainer: {
    padding: '55px 30px',
    background: '#fff',
    height: '100%',
    minHeight: 'calc(100vh - 65px)',
  },

  inputField: {
    width: '100%',
    borderRadius: 30,
    // padding: "15px 14px",
  },

  errorHelperText: {
    color: '#f44336',
  },

  userType: {
    color: '#f8c144',
    fontSize: 24,
  },
  userManagementForm: {
    // width: "calc(100vh - 60px)",
    marginTop: 20,
  },
  fileUploadConatiner: {
    display: 'flex',
    margin: 0,
  },
  fileUploadbutton: {
    backgroundColor: '#FBE281',
  },
  radio: {
    '&$checked': {
      color: '#FBE281',
    },
  },
  checked: {},
  imgError: {
    color: ' #f44336',
    fontSize: '0.75rem',
    marginLeft: '15px',
    marginTop: '5px',
  },
});
