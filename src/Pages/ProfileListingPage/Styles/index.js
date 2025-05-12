export const Styles = () => ({
  row: {
    marginTop: "65px",
    minHeight: "calc(100vh - 65px)",
    flexDirection: "column",
  },
  tabHeaderComp: {
    marginTop: "30px",
    display: (props) => (props.xs && props.profileOverview ? "block" : "flex"),
    padding: (props) => (props.xs ? "0px 10px" : props.md ? "0px 10px" : "0px 50px"),
    width: "100%",
    justifyContent: "space-between",
  },
  title: {
    textAlign: "center",
    textTransform: "capitalize",
  },
  subButtongGroup: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "60px",
  },
  modalBox: {
    alingSelf: "center",
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
    fontSize: 24,
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

  /* profile overview css */

  loadMoreButtonDivDashboard: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  customButton: {
    "& .MuiButtonBase-root": {
      "&:first-child": {
        marginRight: 25,
      },
    },
  },
  FormControl: {
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  lineStyle: {
    margin: "0px 15px",
    opacity: 0.2,
  },
  topPost: {
    flexGrow: 1,
    padding: (props) => (props.xs ? "60px 10px" : "60px 40px"),
    position: "relative",
  },
  chartWrapper: {
    flexGrow: 1,
    padding: (props) => (props.xs ? "0px 10px" : "0px 40px"),
    maxWidth: (props) => (props.xs ? "100vw" : "100%"),
  },
  profileOverviewCard: {
    padding: (props) => (props.xs ? "30px 10px" : "30px 40px"),
    width: "100%",
    height: (props) => (props.xs ? 150 : 200),
    position: "relative",
    overflow: "visible",
    maxWidth: "100vw",
  },
  cardlabels: {
    flexGrow: 1,
    padding: (props) => (props.xs ? "35px 10px" : "35px 40px"),
    width: "100%",
    maxWidth: "100vw",
    minWidth: "100%"
  },
  profileOverviewCardContent: {
    marginLeft: (props) => (props.xs ? 0 : 15),
    padding: (props) => (props.xs ? 5 : 16),
  },
  profileOverviewBasic: {
    display: (props) => (props.xs ? "block" : "flex"),
    alignItems: "center",
  },
  cardlabelsWrapper: {
    width: "450px",
    margin: "20px 10px 0px 10px",
  },
});
