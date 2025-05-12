export const Styles = (theme) => ({
  row: {
    marginTop: "65px",
    minHeight: "calc(100vh - 65px)",
    flexDirection: "column",
  },
  tabHeaderComp: {
    marginTop: "30px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: (props) => (props.xs ? "0px 10px" : "0px 40px"),
    width: "100%",
    alignItems: "center"
  },

  //Content News feed css

  ContentNewsFeedPostsContainer: {
    padding: (props) => (props.xs ? "15px 10px" : "15px 40px"),
  },
  contentNewsFeedCount: {
    fontSize: "22px",
    fontWeight: 600,
  },

  selectedPagesDiv: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: -10,
  },
  dropDown: {
    width: 200,
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  postWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    padding: (props) => (props.xs ? "0px 10px" : "0px 40px"),
  },
  inputWrapper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 50,
    width: (props) => (props.xs ? "100%" : "50%"),
  },
  chipComp: {
    display: "flex",
    justifyContent: "center",
    "& .clearname": {
      marginLeft: 10,
      alignSelf: "center",
      color: "#0B6670",
      fontSize: 15,
      fontWeight: "600",
      cursor: "pointer",
    },
  },
  noData: {
    textAlign: "center"
  },

});
