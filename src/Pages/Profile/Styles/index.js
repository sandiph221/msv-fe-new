export default (theme) => ({
  containerMain: {
    boxShadow: "0 0 63px rgba(0, 0, 0, 0.1)",
    padding: 0,
    color: "rgba(0, 0, 0, 0.87)",
    padding: 0,
    zIndex: 1300,
    boxShadow:
      "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px",
    marginTop: "-160px",
    backgroundColor: "rgb(255, 255, 255)",
  },

  bannerTop: {
    backgroundImage: "linear-gradient(to right, #F8C1441A, #FBE281)",
  },

  profileDetails: {
    display: "flex",
    padding: 30,
    background: "#FFF8DE",
    boxShadow: "0 0 63px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },

  avatar: {
    margin: "auto",
    width: 90,
    height: 90,
    fontSize: 22,
    textTransform: "uppercase"
  },

  btnUpdatePassword: {
    textTransform: "Capitalize",
    paddingLeft: 60,
    paddingRight: 60,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 30,
  },

  backBtn: {
    marginTop: "-40px",
    color: "#323232",
    fontSize: 17,
    fontWeight: 600,
    textDecoration: "none",
  },
  backBtnIcon: {
    verticalAlign: "middle",
    fontSize: 22,
    marginRight: 10,
  }
});
