import React from "react";
import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useSelector } from "react-redux";
import { formatImage } from "utils/functions.js";
import { CustomButton } from "../CustomButton/CustomButton";

// Register Chart.js components
Chart.register(...registerables);

// Rest of your styles and styled components...
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
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  graphTitle: {
    fontSize: 24,
    letterSpacing: 0,
    fontWeight: 600,
  },

  graphSection: {
    background: "#fff",
    padding: "35px 15px 10px 20px",
    border: "1px solid #bdbdbd",
    borderRadius: "5px",
  },

  dateFilterBtnGroup: {
    height: 34,
    background: "#fff",
    border: "1px solid #E0E0E0",
  },
  dateFilterBtn: {
    padding: (props) => (props.xs ? "7px 10px" : "7px 20px"),
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

//styled component

const StyledSwitch = withStyles({
  thumb: {
    backgroundColor: "#FBE281",
  },
  // colorSecondary: {
  //   backgroundColor: "#FBE281"
  // }
  // checked: {
  //   backgroundColor: "#FBE281"
  // }
  colorSecondary: {
    "&checked": {
      "&track": {
        backgroundColor: "#FBE281",
      },
    },
  },
})(Switch);

const StyledSelect = withStyles({
  root: {
    padding: 8,
    border: "1px solid #BDBDBD",
  },
})(Select);

const StyledMenuItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#FFF8DE",
    },
  },
})(MenuItem);

const StyledInputLabel = withStyles({
  outlined: {
    transform: "translate(10px, 12px) scale(0.8) !important",
  },
  focused: {
    color: "#757575 !important",
    opacity: "1 !important",
  },
})(InputLabel);

const BarChart = ({
  chartTitle,
  adddeSocialMedaiProfile = [],
  graphTitle,
  chartData,
  getSelectedProfile,
  switchShow,
  showPeriod,
  height,
  showLabel,
  chartId,
  noDecimalPoint,
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const matches = useMediaQuery("(max-width:420px)");
  const [addProfiles, setAddProfiles] = React.useState(
    adddeSocialMedaiProfile.length === 0 ? [] : [adddeSocialMedaiProfile[0].id]
  );
  const [selectProfiles, setSelectProfiles] = React.useState(
    adddeSocialMedaiProfile.length === 0 ? [] : [adddeSocialMedaiProfile[0].id]
  );
  const [dateFilter, setDateFilter] = React.useState("day");
  const [color, setColor] = React.useState("default");
  const [mobileView, setMobileView] = React.useState(false);
  const [kPerFans, setKPerFnas] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [checkedValue, setCheckedValue] = React.useState([]);

  // Create a valid default data structure for the chart
  const [validChartData, setValidChartData] = React.useState({
    labels: [],
    datasets: [],
  });

  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const { user } = useSelector((state) => state.auth);

  let subdomain = user?.CustomerSubdomain?.subdomain || "";

  // Ensure chartData is properly formatted
  useEffect(() => {
    if (chartData && typeof chartData === "object") {
      // Make sure datasets is an array
      const formattedData = {
        labels: chartData.labels || [],
        datasets: Array.isArray(chartData.datasets) ? chartData.datasets : [],
      };
      setValidChartData(formattedData);
    }
  }, [chartData]);

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setMobileView((prevState) => ({ ...prevState, mobileView: true }))
        : setMobileView((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", setResponsiveness);
    };
  }, []);

  // Define custom tooltip positioner
  if (!Chart.defaults.plugins.tooltip.positioners) {
    Chart.defaults.plugins.tooltip.positioners = {};
  }

  Chart.defaults.plugins.tooltip.positioners.custom = function (
    elements,
    position
  ) {
    if (!elements.length) {
      return false;
    }
    var offset = 0;
    let heightOffset = 0;

    if (elements[0].element.chart.width / 2 > position.x) {
      offset = 20;
    }
    if (elements[0].element.chart.height / 2 < position.y) {
      heightOffset = -70;
    } else {
      heightOffset = 70;
    }

    return {
      x: position.x + offset,
      y: position.y + heightOffset,
    };
  };

  const chart = React.createRef();

  // Create a custom plugin for the vertical line on hover
  const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw: (chart) => {
      if (chart.tooltip?._active && chart.tooltip._active.length) {
        const activePoint = chart.tooltip._active[0];
        const ctx = chart.ctx;
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = activePoint.element.width;
        ctx.strokeStyle = "#ddd9d9";
        ctx.globalAlpha = 0.9;
        ctx.globalCompositeOperation = "destination-over";
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  // Register the plugin
  Chart.register(verticalLinePlugin);

  // Chart JS Options
  var chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: graphTitle || "",
        position: "left",
      },
      tooltip: {
        mode: "x",
        displayColors: true,
        intersect: false,
        enabled: true,
        padding: 20,
        titleFont: {
          size: 18,
        },
        titleSpacing: 10,
        bodyFont: {
          size: 18,
        },
        xPadding: 18,
        yPadding: 18,
        yAlign: "center",
        caretSize: 12,
        position: "custom",
        titleMarginBottom: 18,
        callbacks: {
          title: function (tooltipItems) {
            if (tooltipItems && tooltipItems.length > 0) {
              const dataPointsIndex = tooltipItems[0].dataIndex;
              const dateRange = validChartData.timeline
                ? validChartData.timeline.filter(
                    (date, index) => index == dataPointsIndex
                  )
                : [];
              if (dateRange && dateRange.length !== 0) {
                if (dateFilter === "day") {
                  return `${
                    dateRange[0]?.start
                      ? new Date(dateRange[0].start)
                          .toDateString()
                          .split(" ")[1]
                      : ""
                  } ${
                    dateRange[0]?.start
                      ? new Date(dateRange[0].start)
                          .toDateString()
                          .split(" ")[2]
                      : ""
                  } `;
                } else {
                  return `From : ${
                    dateRange[0]?.start
                      ? new Date(dateRange[0].start)
                          .toDateString()
                          .split(" ")[1]
                      : ""
                  } ${
                    dateRange[0]?.start
                      ? new Date(dateRange[0].start)
                          .toDateString()
                          .split(" ")[2]
                      : ""
                  }  To: ${
                    dateRange[0]?.end
                      ? new Date(dateRange[0].end).toDateString().split(" ")[1]
                      : ""
                  } ${
                    dateRange[0]?.end
                      ? new Date(dateRange[0].end).toDateString().split(" ")[2]
                      : ""
                  }`;
                }
              } else {
                return tooltipItems[0].label
                  ? tooltipItems[0].label.toUpperCase()
                  : "";
              }
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: true,
          color: "rgb(153, 21, 21)",
          offset: true,
        },
        ticks: {
          color: "#323132",
          font: {
            size: 14,
            weight: 600,
            family: "'Poppins', sans-serif",
          },
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          color: "#757575",
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          precision: noDecimalPoint ? 0 : 1,
        },
      },
    },
    hover: {
      mode: "y",
      intersect: false,
    },
  };

  /* fires on selecting profiles */
  useEffect(() => {
    if (selectProfiles && selectProfiles.length !== 0 && getSelectedProfile) {
      getSelectedProfile(selectProfiles, dateFilter, kPerFans);
    }
  }, [dateFilter, kPerFans, selectProfiles, getSelectedProfile]);

  const updateAddedProfiles = (id) => {
    setOpen(true);
    if (addProfiles.includes(id)) {
      const removeProfile = addProfiles.filter((a) => a !== id);
      setAddProfiles(removeProfile);
    }
    // if profile is not selected add to state
    else {
      setAddProfiles((prevState) => [...prevState, id]);
    }
  };

  // Date Filter onchange validations and functions
  const handleAlignment = (event, newAlignment) => {
    setColor(event.target.checked ? "blue" : "default");
    if (newAlignment !== null) {
      setDateFilter(newAlignment);
    }
  };

  // handle function to fetch data per 1000 fans
  const handle1KperFans = () => {
    setKPerFnas(!kPerFans);
  };

  useEffect(() => {
    if (adddeSocialMedaiProfile && adddeSocialMedaiProfile.length !== 0) {
      setCheckedValue((prevState) => [
        ...prevState,
        adddeSocialMedaiProfile[0],
      ]);
    }
  }, [adddeSocialMedaiProfile]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    getContentAnchorEl: null,
  };

  const classes = useStyles({ xs });

  return (
    <Box style={{ maxWidth: "100vw" }}>
      <div>
        <Grid
          component="label"
          container
          alignItems="center"
          spacing={1}
          style={{
            height: 35,
            marginBottom: 10,
            display: "flex",
            justifyContent: xs ? "flex-start" : "flex-end",
            width: xs ? "auto" : "fit-content",
            marginLeft: "auto",
          }}
        >
          {switchShow ? (
            <>
              <Grid item>
                {" "}
                <Typography style={{ fontSize: 11 }}>
                  Interaction per fans
                </Typography>{" "}
              </Grid>
              <Grid item>
                <StyledSwitch
                  color="secondary"
                  size="small"
                  checked={kPerFans}
                  onChange={handle1KperFans}
                />
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 11 }}>
                  Interaction per 1k fans
                </Typography>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
      </div>
      <div
        className={classes.graphTitleSection}
        style={{ display: xs ? "block" : "flex", marginBottom: xs ? 35 : 15 }}
      >
        <div style={{ flexGrow: 1 }}>
          <Typography
            style={{
              fontSize: xs ? 16 : 22,
              letterSpacing: 0,
              fontWeight: 600,
              flexGrow: 1,
              whiteSpace: xs ? "break-spaces" : "nowrap",
            }}
            variant="h5"
          >
            {chartTitle}
          </Typography>
        </div>
        <div>
          {showPeriod === true ? (
            <ToggleButtonGroup
              style={{
                height: xs ? 28 : 34,
                background: "#fff",
                border: "1px solid #E0E0E0",
                float: "right",
              }}
              selected={color === "blue"}
              value={dateFilter}
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
          ) : (
            ""
          )}
        </div>
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
              minWidth: mobileView.mobileView ? "600px" : "100%",
            }}
          >
            {validChartData.datasets && validChartData.datasets.length > 0 ? (
              <Bar
                ref={chart}
                id={chartId ? chartId : "my-chart"}
                data={validChartData}
                options={chartOptions}
                height={height}
              />
            ) : (
              <div
                style={{
                  height: height || 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1">
                  No data available for the chart
                </Typography>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {showLabel !== "false" && !xs ? (
            <div
              style={{ display: "flex", marginTop: 10, padding: "0px 20px" }}
            >
              <Typography style={{ fontSize: 12, marginRight: 5 }}>
                {" "}
                Selected profiles:{" "}
              </Typography>
              <Typography
                style={{
                  fontSize: 12,
                  width: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: -5,
                }}
              >
                {selectProfiles.map((data, profileIndex) => {
                  const profileList = adddeSocialMedaiProfile.filter(
                    (profile) => profile.id === data
                  );
                  return profileList.map((data, index) => (
                    <img
                      key={`${data.id}-${index}`}
                      style={{
                        height: 25,
                        width: 25,
                        borderRadius: 25,
                        marginRight: 5,
                      }}
                      src={formatImage(
                        activeSocialMediaType,
                        subdomain,
                        data.picture
                      )}
                      alt={data.name || "Profile"}
                    />
                  ));
                })}
              </Typography>
            </div>
          ) : (
            ""
          )}
          <div>
            {showLabel !== "false" ? (
              <div
                id="chart-legends"
                style={{
                  position: "relative",
                  overflowX: mobileView.mobileView ? "scroll" : "hidden",
                }}
              >
                <FormControl
                  style={{
                    minWidth: 130,
                    marginRight: 10,
                  }}
                >
                  <StyledInputLabel
                    variant="outlined"
                    id="demo-simple-select-label"
                    shrink={false}
                  >
                    {" "}
                    Select profiles
                  </StyledInputLabel>
                  <StyledSelect
                    id="bar-chart-select-dropdown"
                    labelId="demo-simple-select-label"
                    variant="outlined"
                    displayEmpty={true}
                    value=""
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    MenuProps={menuProps}
                  >
                    {adddeSocialMedaiProfile.length > 0 ? (
                      <div style={{ position: "relative", maxHeight: "250px" }}>
                        {adddeSocialMedaiProfile.map((addedProfileList) => (
                          <StyledMenuItem
                            key={addedProfileList.id}
                            value={addedProfileList.id}
                            selected={true}
                            style={{
                              background:
                                addProfiles.indexOf(addedProfileList.id) > -1
                                  ? "#FFF8DE"
                                  : "transparent",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <div
                              id="styled-menu-item"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                type="checkbox"
                                onChange={(e) =>
                                  updateAddedProfiles(addedProfileList.id)
                                }
                                checked={
                                  addProfiles.indexOf(addedProfileList.id) > -1
                                }
                              />
                              <Avatar
                                src={formatImage(
                                  activeSocialMediaType,
                                  subdomain,
                                  addedProfileList.picture
                                )}
                                style={{
                                  width: 25,
                                  height: 25,
                                  marginRight: 10,
                                }}
                              />{" "}
                              <Typography
                                style={{ fontSize: 15, fontWeight: 600 }}
                              >
                                {" "}
                                {addedProfileList.name}{" "}
                              </Typography>{" "}
                            </div>
                          </StyledMenuItem>
                        ))}
                        <div
                          style={{
                            position: "sticky",
                            bottom: 0,
                            width: "100%",
                          }}
                        >
                          <CustomButton
                            onClick={() => setSelectProfiles(addProfiles)}
                            defaultBackgroundColor
                            width={"10px"}
                          >
                            Go
                          </CustomButton>
                        </div>
                      </div>
                    ) : (
                      <StyledMenuItem value="" selected={true}>
                        <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                          No Data Available
                        </Typography>{" "}
                      </StyledMenuItem>
                    )}
                  </StyledSelect>
                </FormControl>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default BarChart;
