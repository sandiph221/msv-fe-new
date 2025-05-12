export const Styles = (theme) => ({
  main: {
    padding: (props) => (props.sm ? "15px 0px" : "15px 40px"),
    marginTop: 75,
    minHeight: "84vh"
  },
  header: {
    background: "red",
  },
  titleOverview: {
    margin: "30px 0",
  },
  contentNewsfeed: {
    display: "flex",
    alignItems: "center",
  },
  contentNewsfeedImg: {
    height: 70,
    objectFit: "contain",
  },
  contentNewsfeedTitle: {
    marginLeft: 20,
    fontSize: 32,
    marginBottom: 0,
    fontWeight: "bold",
  },
  charts: {
    marginTop: 30,
    minHeight: 350,
  },
  growthChart: {
    position: "relative",
  },
  loader: {
    background: "rgba(255, 255, 255, 0.6)",
  },
  graphTitleSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  chartFallBackContainer: {
    height: "calc(100% - 47px)",
  },
  graphTitle: {
    fontSize: 20,
    letterSpacing: 0,
    fontWeight: 600,
  },
  chartFallBack: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    background: "#fff",
    border: "1px solid #bdbdbd",
    minHeight: 350,
    borderRadius: 4,
  },
  loadMoreButtonDivDashboard: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  topPostHeadSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  
  subTitle: {
    fontSize: (props) => (props.xs ? 16 : 22),
    fontWeight: 600,
  },
  topPost: {
    width: "100%",
    position: "relative",
    margin: 10,
  },
  downloadBtnImg: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});
