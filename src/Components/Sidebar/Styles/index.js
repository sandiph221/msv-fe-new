export default (theme) => ({
  sidebar: {
    height: "100%",
    maxHeight: "calc(100vh - 65px)",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
  },
  asideTop: {
    padding: "12px",
  },
  asideBottom: {
    overflowY: "auto",
  },
  // drawer: {
  // backgroundColor: "#e1f1f1",
  // width: drawerWidth,
  // },
  // drawerOpen: {
  //   backgroundColor: "#FAFAFA",
  //   transition: theme.transitions.create("100%", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   position: "relative",

  // },

  // drawerClose: {
  //   backgroundColor: "#e1f1f1",
  //   transition: theme.transitions.create("width", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  //   overflowX: "hidden",
  //   width: theme.spacing(7) + 1,
  //   [theme.breakpoints.up("md")]: {
  //     width: theme.spacing(9) + 1,
  //   },
  //  },

  // textField: {
  //   backgroundColor: "#fff",
  //   width: "100%",
  //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "#33918A",
  //   },
  // },
  userType: {
    color: "#f8c144",
    fontSize: 24,
  },
  userContainer: {
    display: (props) => (props.xs ? "block" : "flex"),
    justifyContent: "space-between",
    width: "100%",
    // marginTop: theme.mixins.toolbar.minHeight,
    margin: "18px 0",
    textAlign: "center"
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
});
