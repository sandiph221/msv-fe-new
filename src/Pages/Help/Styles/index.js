export default (theme) => ({
  row: {
    marginTop: "65px",
    minHeight: "calc(100vh - 65px)",
    flexDirection: "column",
  },
  formContainer: {
    padding: "55px 30px",
    background: "#fff",
    height: "100%",
    minHeight: "calc(100vh - 65px)",
  },
  sidebar: {
    display: "flex",
    padding: "30px 20px",
    flexDirection: "column",
  },
  asideTop: {
    padding: "12px",
  },
  asideBottom: {
    overflowY: "auto",
  },

  userType: {
    color: "#f8c144",
    fontSize: 24,
  },
  userContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    // marginTop: theme.mixins.toolbar.minHeight,
    margin: "18px 0",
  },

  iconTextContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backIcon: {
    marginLeft: 8,
    color: "#33918A",
    fontWeight: 600,
  },
  navTextStyle: {
    textTransform: "none",
    marginLeft: 8,
    fontSize: 12,
  },
  // iconButtonContainer: {
  //   borderColor: "#323132",
  // },

  userItem: {
    width: "100%",
    display: "flex",
    justifyContent: "spaceBetween",
    borderRadius: "5px",
  },

  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(-360deg)",
    },
  },

  loadBtn: {
    color: "#323132",
    margin: "auto",

    // '&:hover': {
    //   cursor: 'pointer',
    //   backgroundColor: theme.palette.grey[100],
    //   "& $loadBtnIcon": {
    //     color: "purple"
    //   }
    // },
    "&:hover": {
      "& $loadBtnIcon": {
        animation: "$rotate .5s ease-in-out",
      },
    },
  },

  loadBtnIcon: {
    display: "block",
  },

  alertIcon: {
    fontSize: "5rem",
    color: "#f50057",
    paddingBottom: 0,
  },
  helpList: {
    borderRadius: 15,
    height: 95,
    border: "1px solid #bdbdbd",
    display: "flex",
    padding: 20,
    alignItems: "center",
    cursor: "pointer",
    transition: "0.5s ease-in-out",
    "&:hover":{
      backgroundColor: "#FFF8DE ",
      padding: "20px 20px 20px 30px",
    },
    
    "& p": {
      fontSize: 20,
      fontWeight: 600,
      color: "#323132",
      marginLeft: 15,
    },
  },
  helpIconList: {
    width: 55,
    height: 55,
    borderRadius: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
  },
  imgError: {
    color: " #f44336",
    fontSize: "0.75rem",
    marginLeft: "15px",
    marginTop: "5px",
  },
  articleCard: {
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "unset",
    width: "100%",
    "&:hover": {
      boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);"
    },
    
    "& .MuiCardContent-root:last-child": {
      paddingBottom: 16
    }
  }
});
