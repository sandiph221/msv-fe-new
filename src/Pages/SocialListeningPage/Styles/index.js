import { Opacity } from "@mui/icons-material";

export default (theme) => ({
  row: {
    marginTop: "65px",
    minHeight: "calc(100vh - 65px)",
    flexDirection: "column",
  },
  tabHeaderComp: {
    marginTop: "30px",
    display: "flex",
    padding: (props) => props.xs ? "0px 20px" : "0px 40px",
    width: "100%",
    justifyContent: 'space-between'
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
    background: "rgba(255, 255, 255, 0.6)"
  },
  graphTitleSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: 'flex-end'
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

  profileOverview: {

  },
  clearBtn: {
    marginLeft: 10,
    alignSelf: "center",
    color: "#0B6670",
    fontSize: 15,
    fontWeight: "600",
    cursor: "pointer",
    textTransform: "capitalize",

    "&:hover": {
      backgroundColor: "transparent"

    }
  }
});
