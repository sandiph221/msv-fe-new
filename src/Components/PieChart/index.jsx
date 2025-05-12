
import {
  makeStyles,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Doughnut, Chart } from "react-chartjs-2";

import { numbersFormat } from "utils/functions.js";

const useStyles = makeStyles((test) => ({
  unselected: {
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    transition: "0.3s ease",
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
  },

  profileImgBtn: {
    width: 28,
    height: 28,
    objectFit: "cover",
    borderRadius: "50%",
    marginRight: 8,
  },

  graphTitleSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "flex-end",
  },

  graphSection: {
    position: "relative",
  },

  graphTitle: {
    fontSize: 24,
    letterSpacing: 0,
    fontWeight: 600,
  },

  dateFilterBtnGroup: {
    height: 34,
    background: "#fff",
    border: "1px solid #E0E0E0",
  },
  dateFilterBtn: {
    padding: "7px 20px",
    fontSize: 13,
    fontWeight: "bold",
    border: "none",
    textTransform: "Capitalize",
  },
  selectedDateFiterBtnGroup: {
    color: "#323132",
    backgroundColor: "#fbe281",
  },
  pieChartDistributionChart: {
    position: "relative",
  },

  pieTotal: {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    top: "50%",
    marginTop: "-28px",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 42,
    fontWeight: "bold",
    color: "#323132",
  },

  zeroData: {
    width: "13vw",
    height: "13vw",
    margin: "auto",
    borderRadius: "50%",
    border: "35px solid rgba(224, 224, 224, 1)",
  },
}));
// Chart.plugins.register({
//   afterDraw: function(chart) {
//     console.log("pie index chart", chart);
//       if (chart && chart.data.datasets[0].data.every(item => item === 0)) {
//           let ctx = chart.chart.ctx;
//           let width = chart.chart.width;
//           let height = chart.chart.height;

//           chart.clear();
//           ctx.save();
//           ctx.textAlign = 'center';
//           ctx.textBaseline = 'middle';
//           ctx.fillText('No data to display', width / 2, height / 2);
//           ctx.fillStyle = "#FF0000";
//           ctx.fillRect(20, 20, 150, 100);
//           ctx.restore();
//       }
//   }
// })

const PieChart = (props) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const md = useMediaQuery(theme.breakpoints.down("md"));

  const chart = React.createRef();
  // Chart JS Options
  var chartOptions = {
    // Default legend display false
    legend: {
      display: false,
    },
    aspectRatio: 1,
    cutoutPercentage: 65,
  };

  const data = {
    datasets: [
      {
        data: [
          props.chartData.total_reactions,
          props.chartData.total_comments
            ? props.chartData.total_comments
            : props.chartData.feed_comment_count,
          props.chartData.total_shares
            ? props.chartData.total_shares
            : props.chartData.feed_share_count,
        ],
        backgroundColor: ["#FF3434", "#0B6670", "#F8C144"],
      },
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels:
      props.activeSocialMediaType == "instagram"
        ? ["Like", "Comments"]
        : ["Reactions", "Comments", "Share"],
  };

  const total =
    Math.abs(props.total) > 999
      ? Math.sign(props.total) * (Math.abs(props.total) / 1000).toFixed(1) + "k"
      : Math.sign(props.total) * Math.abs(props.total);

  /* fires on selecting profiles */
  React.useEffect(() => {
    if (props.getTotal) {
      props.getTotal(total);
      // Updating Chart
      {
        total != 0
          ? chart.current.chartInstance.update()
          : console.log("Pie Chart Data Empty");
      }
    }
  }, [props.getTotal]);

  const classes = useStyles();
  return (
    <Box>
      <div className={classes.graphSection}>
        <Typography
          style={{
            fontSize: xs ? 24 : 32,
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: "50%",
            marginTop: xs ? "-15px" : "-28px",
            left: 0,
            right: 0,
            textAlign: "center",
            fontWeight: "bold",
            color: "#323132",
          }}
        >
          {numbersFormat(props.total)}
        </Typography>
        {total != 0 ? (
          <Doughnut
            ref={chart}
            id="pieChartDistributions"
            data={data}
            options={chartOptions}
            height={props.postDetailsChart ? 400 : 80}
            width={props.postDetailsChart ? 800 : "auto"}
            // width={800}
          />
        ) : (
          <>
            <div></div>
            <Box
              id="emptyPie"
              component="canvas"
              style={{
                width: md ? "26vw" : "13vw",
                height: md ? "26vw" : "13vw",
                margin: "auto",
                borderRadius: "50%",
                border: "35px solid rgba(224, 224, 224, 1)",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </>
        )}
        {/* <Doughnut
            ref={chart}
            id="pieChartDistributions"
            data={data}
            options={chartOptions}
            height={80}
          /> */}
      </div>
    </Box>
  );
};

export default PieChart;
