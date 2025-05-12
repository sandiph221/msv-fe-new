import { Opacity } from "@mui/icons-material";

export default (props) => ({
  row: {
    marginTop: "65px",
    minHeight: "calc(100vh - 65px)",
    flexDirection: "column",
  },
  tabHeaderComp: {
    marginTop: "30px",
    display: "flex",
    padding: (props) => (props.xs ? "0px 10px" : "0px 40px"),
    justifyContent: "space-between"
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
  profileListComponent: {
    padding: "24px",
    height: "60vh",
  },
  charts: {
    marginTop: 30,
    minHeight: 350,
  },
  growthChart: {
    position: "relative",
  },
  loader: {
    background: "rgba(255, 255, 255, 0.6)"
  },


  /* profile overview css */

  profileOverview: {

  },

  pieChart: {
    marginTop: 65,
  },

  pieChartDistribution: {
    background: "#fff",
    border: "1px solid #bdbdbd",
  },

  pieProfileDetails: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  chartTitle: {
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: 0,
  },

  pieChartContainer: {
    marginTop: 45,
  },

  graphTitleSection: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 15,
    justifyContent: "space-between",
  },

  pieProfileImg: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    marginRight: 8,
    border: "1px solid #e0e0e0",
    objectFit: "cover",
  },

  pieProfileName: {
    color: "#323132",
    fontSize: 15,
    fontWeight: "normal",
  },

  pieChartDetailHeader: {
    display: "flex",
    alignItems: "center",

  },

  pieDistributionTitle: {
    fontWeight: 600,
  },

  pieDistributionIcon: {
    width: 38,
    height: 38,
    padding: 7,
    borderRadius: "50%",
    marginRight: 20,
  },

  chartDetails: {
    width: "70%",
    margin: "auto"
  },

  pieChartProfile: {
    position: "relative",
    margin: "30px 0",
    borderRight: "1px solid rgba(224, 224, 224, 1)"
  },

  chartFallBackContainer: {
    height: "calc(100% - 47px)",
  },

  pieChartContainer: {
    position: "relative",
  },

  graphTitleSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: 'flex-end'
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
  },

  ContentNewsFeedPostsContainer: {
    padding: (props) => (props.xs ? "15px 10px" : "40px 0px"),
    width: "100%",
    "& .top_post_title": {
      marginBottom: 20,
      display: (props) => (props.xs ? "block" : "flex"),
      justifyContent: "space-between"
    }
  },

  loadMoreButtonDivDashboard: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
});
