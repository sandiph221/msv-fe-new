export const Styles = (theme) => ({
  appBar: {
    position: "fixed",
    top: 0,
    width: "100%",
    borderBottom: "1px solid #E0E0E0",
    background: "#fff",
    zIndex: 1201,
    boxShadow: "none",
    display: "flex",
    flexDirection: "row",
    padding: props => props.xs ? "8px" : props.sm ? "8px 20px" : "8px 50px"
  },
  menu: {
    top: "100px",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    height: 45,
    objectFit: "contain",
    marginRight: "auto",
    width: props => props.xs ? "90%" : "initial"
  },
  iconButton: {
    display: "flex",
    textDecoration: "none !important",
    // fontFamily: poppins,
    padding: props => props.md ? "12px 6px" : "12px 16px",
    margin: "0 10px",
    alignItems: "center",
    borderRadius: 5,
    fontSize: 15,
    transition: "0.2s ease",
    color: "#323132",
    height: 45,
    // Hover
    '&:hover': {
      background: "#fff8de",
    },

  },
  navTextStyle: {
    fontWeight: 600,
    textTransform: "capitalize",
    marginLeft: 8,
    fontSize: 15,
  },
  // Navbar Active
  navbarActive: {
    background: "#fbe281",
    '&:hover': {
      background: "#fbe281",
    },
  },
  icons: {
    background: "#fff !important",
    padding: 0,
    justifyContent: "flex-end"

  }
});
