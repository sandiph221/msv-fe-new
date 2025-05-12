import { useRef } from "react";
import {
  Button,
  makeStyles,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  subDays,
  endOfWeek,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subYears,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setCustomDateRangeAction } from "../../store/actions/SocialMediaProfileAction";
import { CustomButton } from "../CustomButton/CustomButton";
import moment from "moment-timezone";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#fff",
    marginLeft: "auto",
    width: 180,
  },
  filterSelect: {
    fontSize: 15,
    paddingLeft: 25,
    background: "#fff",
    width: "100%",
  },
  dateIcon: {
    position: "absolute",
    marginLeft: 7,
    padding: 2,
    zIndex: 5,
  },
  datePickerContainer: {
    position: "absolute",
    zIndex: 999,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    right: 0,
  },
}));

const TopFilter = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [customDate, setCustomDate] = React.useState(false);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const miniXs = useMediaQuery("(max-width:375px)");

  const { customDateRangeRed } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [selectedPreset, setSelectedPreset] = React.useState("Today");

  React.useEffect(() => {
    if (customDateRangeRed && customDateRangeRed.length > 0) {
      setStartDate(new Date(customDateRangeRed[0].startDate));
      setEndDate(new Date(customDateRangeRed[0].endDate));

      // Determine which preset this matches
      const preset = determinePreset(
        new Date(customDateRangeRed[0].startDate),
        new Date(customDateRangeRed[0].endDate)
      );
      setSelectedPreset(preset);
    }
  }, [customDateRangeRed]);

  const determinePreset = (start, end) => {
    const today = new Date();
    const yesterday = subDays(today, 1);

    if (isSameDay(start, today) && isSameDay(end, today)) {
      return "Today";
    } else if (isSameDay(start, yesterday) && isSameDay(end, today)) {
      return "Yesterday";
    } else if (
      isSameDay(start, startOfWeek(today)) &&
      isSameDay(end, endOfWeek(today))
    ) {
      return "This week";
    } else if (isSameDay(start, subDays(today, 6)) && isSameDay(end, today)) {
      return "Last 7 days";
    } else if (
      isSameDay(start, startOfMonth(today)) &&
      isSameDay(end, endOfMonth(today))
    ) {
      return "This month";
    } else if (
      isSameDay(start, startOfMonth(addMonths(today, -1))) &&
      isSameDay(end, endOfMonth(addMonths(today, -1)))
    ) {
      return "Last month";
    } else if (isSameDay(start, subDays(today, 30)) && isSameDay(end, today)) {
      return "Last 30 days";
    } else if (isSameDay(start, subYears(today, 1)) && isSameDay(end, today)) {
      return "Last 1 year";
    } else {
      return "Custom";
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const customClick = () => {
    setCustomDate(!customDate);
  };

  const handleClickAway = () => {
    setCustomDate(false);
  };

  const handleDateChange = () => {
    const convertedDate = [
      {
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      },
    ];

    dispatch(setCustomDateRangeAction(convertedDate));
    setCustomDate(false);
  };

  const applyPreset = (preset) => {
    let newStartDate, newEndDate;
    const today = new Date();

    switch (preset) {
      case "Today":
        newStartDate = today;
        newEndDate = today;
        break;
      case "Yesterday":
        newStartDate = subDays(today, 1);
        newEndDate = today;
        break;
      case "This week":
        newStartDate = startOfWeek(today);
        newEndDate = endOfWeek(today);
        break;
      case "Last 7 days":
        newStartDate = subDays(today, 6);
        newEndDate = today;
        break;
      case "This month":
        newStartDate = startOfMonth(today);
        newEndDate = endOfMonth(today);
        break;
      case "Last month":
        newStartDate = startOfMonth(addMonths(today, -1));
        newEndDate = endOfMonth(addMonths(today, -1));
        break;
      case "Last 30 days":
        newStartDate = subDays(today, 30);
        newEndDate = today;
        break;
      case "Last 1 year":
        newStartDate = subYears(today, 1);
        newEndDate = today;
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedPreset(preset);
  };

  const presets = [
    "Today",
    "Yesterday",
    "This week",
    "Last 7 days",
    "This month",
    "Last month",
    "Last 30 days",
    "Last 1 year",
  ];

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <div
        style={{ position: miniXs ? "initial" : "relative", height: "100%" }}
      >
        <Button
          variant="outlined"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: "#fff",
            marginLeft: props.xs ? "inHerit" : "auto",
            width: xs ? 150 : 180,
            height: "100%",
            textTransform: "capitalize",
          }}
          startIcon={<DateRangeIcon />}
          endIcon={<ArrowDropDownIcon />}
          onClick={customClick}
          title="button"
        >
          {selectedPreset}
        </Button>

        {customDate && (
          <div
            className={classes.datePickerContainer}
            style={{ right: miniXs ? 10 : 0 }}
          >
            <div
              style={{ display: "flex", flexDirection: xs ? "column" : "row" }}
            >
              <div
                style={{
                  marginRight: xs ? 0 : "20px",
                  marginBottom: xs ? "20px" : 0,
                }}
              >
                <h4>Presets</h4>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      style={{
                        padding: "8px 12px",
                        margin: "4px 0",
                        backgroundColor:
                          selectedPreset === preset ? "#FFF8DE" : "transparent",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4>Custom Range</h4>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <CustomButton defaultBackgroundColor onClick={handleDateChange}>
                Apply
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default TopFilter;
