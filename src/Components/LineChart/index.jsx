
import {
  makeStyles,
  Box,
  Typography,
  BottomNavigation,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Line, Chart } from "react-chartjs-2";
import { blue } from "@mui/material/colors";

const useStyles = makeStyles((test) => ({
  selected: {
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
  },

  graphTitleSection: {
    display: (props) => props.xs ? "block" : "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "flex-end",
  },

  graphTitle: {
    fontSize: 24,
    letterSpacing: 0,
    fontWeight: 600,
  },

  graphSection: {
    background: "#fff",
    padding: "35px 15px",
    border: "1px solid #bdbdbd",
    borderRadius: "5px",
  },

  dateFilterBtnGroup: {
    height: 30,
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
}));

const LineChart = (props) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectProfiles, setSelectProfiles] = React.useState([
    props.adddeSocialMedaiProfile && props.adddeSocialMedaiProfile.length === 0
      ? ""
      : props.adddeSocialMedaiProfile && props.adddeSocialMedaiProfile[0].id,
  ]);
  const [postDateFilter, setDateFilter] = React.useState("day");
  const [color, setColor] = React.useState("default");
  const [mobileView, setMobileView] = React.useState(false);

  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setMobileView((prevState) => ({ ...prevState, mobileView: true }))
        : setMobileView((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []); //for responsive use

  Chart.Tooltip.positioners.custom = function (elements, position) {
    if (!elements.length) {
      return false;
    }
    var offset = 0;
    let heightOffset = 0
    //adjust the offset left or right depending on the event position
    if (elements[0]._chart.width / 2 > position.x) {
      offset = 20;
    }
    if (elements[0]._chart.height / 2 < position.y) {
      heightOffset = -70;
    } else {
      heightOffset = 70
    }
    // if(elements[0]._chart.width / 2 > position.y) {
    //   heightOffset = 70
    // }
    return {
      x: position.x + offset,
      y: position.y + heightOffset,
    };
  };

  const chart = React.createRef();

  // Chart JS Options
  var chartOptions = {
    responsive: true,
    maintainAspectRatio: props.sentimentChart ? false : true,
    aspectRatio: 1,
    // Default legend display true
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 15,
        usePointStyle: true,
        padding: 30,
        fontSize: 15,
      },
    },
    tooltips: {
      // Disable the on-canvas tooltip
      mode: "x",
      displayColors: true,
      intersect: false,
      enabled: true,
      padding: 20,
      titleFontSize: 18,
      titleSpacing: 10,
      bodyFontSize: 18,
      xPadding: 18,
      yPadding: 18,
      yAlign: "center",
      caretSize: 12,
      position: "custom",
      titleMarginBottom: 18,
      callbacks: {
        title: function (tooltipItem) {
          if (tooltipItem) {
            const dataPointsIndex = tooltipItem.map((data) => {
              return `${data.index}`;
            });
            const points = dataPointsIndex.slice(0, 1)
            const dateRange = props.chartData.timeline
              ? props.chartData.timeline.filter(
                (date, index) => index == points
              )
              : [];
            if (dateRange && dateRange.length !== 0) {
              if (postDateFilter === "day") {
                return `${dateRange
                  ? new Date(dateRange[0].start).toDateString().split(" ")[1]
                  : ""
                  } ${dateRange
                    ? new Date(dateRange[0].start).toDateString().split(" ")[2]
                    : ""
                  } `
              } else {
                return `From : ${dateRange
                  ? new Date(dateRange[0].start).toDateString().split(" ")[1]
                  : ""
                  } ${dateRange
                    ? new Date(dateRange[0].start).toDateString().split(" ")[2]
                    : ""
                  }  To: ${dateRange
                    ? new Date(dateRange[0].end).toDateString().split(" ")[1]
                    : ""
                  } ${dateRange
                    ? new Date(dateRange[0].end).toDateString().split(" ")[2]
                    : ""
                  }`;
              }
            } else {
              return tooltipItem.map((item) => item.label.toUpperCase());
            }
          }
        },
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: "#323132",
            fontSize: 14,
            fontStyle: 600,
            fontFamily: "'Poppins', sans-serif",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            fontColor: "#757575",
            fontSize: 12,
            fontFamily: "'Poppins', sans-serif",
          },
        },
      ],
    },

    // Graph Title
    title: {
      display: true,
      text: props.graphTitle,
      position: "left",
    },
  };

  /* fires on selecting profiles */
  React.useEffect(() => {
    props.getPostsData(selectProfiles, postDateFilter);
    // Updating Chart
    chart.current.chartInstance.update();
  }, [selectProfiles, postDateFilter]);

  //   const updateSelectedProfiles = (id) =>  {

  //     /* data fetched through api call*/
  //     // if profile is selected, Unselect it and update state
  //     if (selectProfiles.includes(id)){
  //       const unselectProfile = selectProfiles.filter((selectProfiles) =>
  //        selectProfiles !== id
  //       );
  //       setSelectProfiles(unselectProfile);
  //     }
  //     // if profile is not selected add to state
  //     else {
  //       setSelectProfiles((prevState) => [...prevState, id]);
  //     }
  //   };

  // Date Filter onchange validations and functions
  const handleAlignment = (event, newAlignment) => {
    setColor(event.target.checked ? "blue" : "default");
    if (newAlignment !== null) {
      setDateFilter(newAlignment);
    }
  };

  const classes = useStyles({ xs });
  return (
    <Box style={{ maxWidth: '100vw' }}>
      <div className={classes.graphTitleSection}>
        <Typography
          style={{ fontSize: xs ? 14 : 22, letterSpacing: 0, fontWeight: 600 }}
          variant="h5"
        >
          {props.chartTitle}
        </Typography>

        <ToggleButtonGroup
          style={{
            height: xs ? 28 : 34,
            background: "#fff",
            border: "1px solid #E0E0E0",
            marginTop: xs ? 35 : 0
          }}
          selected={color === "blue"}
          value={postDateFilter}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
          size="small"
        >
          <ToggleButton
            className={classes.dateFilterBtn}
            value="day"
            aria-label="day"
          >
            {mobileView.mobileView ? "D" : "Day"}
          </ToggleButton>
          <ToggleButton
            className={classes.dateFilterBtn}
            value="week"
            aria-label="week"
          >
            {mobileView.mobileView ? "W" : "Week"}
          </ToggleButton>
          <ToggleButton
            className={classes.dateFilterBtn}
            value="month"
            aria-label="month"
          >
            {mobileView.mobileView ? "M" : "Month"}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={classes.graphSection}>
        <div
          id="bar-charts"
          style={{
            position: "relative",
            overflowX: mobileView.mobileView ? "scroll" : "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: xs ? "1024px" : sm ? "100%" : "100%",

            }}
          >
            <Line
              ref={chart}
              id={props.chartId ? props.chartId : "myChart"}
              data={props.chartData}
              options={chartOptions}
              height={sm ? "584px" : 80}
            />
          </div>
        </div>
        {/* 
          {props.showLabel != "false" ? 
            <div id="chart-legends" className={classes.chartProfiles} style={{  display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
              // List of Added Profiles
              {props.adddeSocialMedaiProfile.map((item) =>
                <span key={item.profileId} onClick={ () => updateSelectedProfiles(item.id)}
                  className={`label-item ${selectProfiles.includes(item.id) ? '' : classes.selected }`} 
                  style={{margin: 15, cursor: "pointer", border: "1px solid", backgroundColor: item.backgroundColor, borderColor: item.borderColor, borderRadius: 4, padding: "8px 10px", color: "#323132", fontSize: 13, fontWeight: "bold" }}>
                  {item.page_name}
                </span>
              )}
            </div>
             :
            ''
          } 
        */}
      </div>
    </Box>
  );
};

export default LineChart;
