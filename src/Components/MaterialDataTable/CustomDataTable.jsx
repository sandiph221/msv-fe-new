import {
  makeStyles,
  Checkbox,
  Avatar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatImage, formatNumber } from "utils/functions.js";
import Spinner from "../Spinner/index";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import * as constant from "../../utils/constant";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Alert from "../AlertBox/Alert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { deleteAddedProfileList } from "../../store/actions/SocialMediaProfileAction";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  divTabelContent: {
    width: "100%",
    position: "relative",
  },
  table1: {
    flexGrow: 1,
    borderRight: "1px solid #bdbdbd",
    position: "relative",
    "& .table-1-table-data": {
      minHeight: 65,
      display: "flex",
      alignItems: "center",
    },
  },
  table2: {
    flexGrow: 2,
    overflowX: "auto",
    scrollBehavior: "smooth",
    "& .table-2-table-header-data": {
      display: "flex",
      justifyContent: "center",
    },

    "& .table-2-table-data": {
      padding: 24,
      fontSize: 14,
      paddingLeft: 14,
      display: "flex",
      justifyContent: "center",
      // minHeight: 65.5
    },
  },
  table3: {
    flexGrow: 3,
    borderLeft: "1px solid #bdbdbd",
    position: "relative",
    "& .table-3-table-data": {
      padding: 22,
      justifyContent: "center",
      // minHeight: 66.5
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
  },
  tableHeader: {
    "& div": {
      backgroundColor: "#F5F5F5",
      fontWeight: 600,
      fontSize: 14,
      textTransform: "capitalize",
      cursor: "pointer",
      "& :hover": {
        "& .arrowComponent": {
          display: "block",
        },
      },

      "& .arrowComponent": {
        display: "none",
      },
      "& .table-3-table-data": {
        alignItems: "center",
      },
    },
  },
  tableBody: {},
  tableRow: {
    display: "flex",
    minHeight: 70,
  },
  tableData: {
    minWidth: 200,
    padding: 12,
    width: "100%",
    borderBottom: "1px solid #bdbdbd",
    display: "flex",
  },
  tableCheckbox: {
    borderBottom: "1px solid #bdbdbd",
    display: "flex",
    alignItems: "center",
    paddingLeft: 16,

    "& .MuiCheckbox-colorSecondary.Mui-checked": {
      color: "#0B6670",
    },
  },
  arrow: {
    fontSize: 22,
    color: "#bdbdbd",
  },
  headerTextStyle: {
    margin: 0,
    whiteSpace: "break-spaces",
    textAlign: "center",
  },
}));

const CustomDataTable = ({
  data,
  loader,
  selectedLabels,
  getSelectedProfileList,
  history,
  allLabels,
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [checkedData, setCheckedData] = useState([]);
  const [sort, setSort] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const scrollerRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  let subdomain = user.CustomerSubdomain.subdomain;

  const scrollScroller = (scrollSide) => {
    if (scrollSide === "right") {
      scrollerRef.current.scrollLeft += 200;
    } else {
      scrollerRef.current.scrollLeft += -200;
    }
  };

  //checkbox function
  const handleChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedData([...checkedData, value]);
    } else {
      const filteredValue = checkedData.filter((c) => c !== value);
      setCheckedData(filteredValue);
    }
  };

  React.useEffect(() => {
    const selectedProfileList = data.filter((d) =>
      checkedData.includes(`${d.id}`)
    );
    getSelectedProfileList(selectedProfileList);
  }, [checkedData]);

  //handele all select function

  const handleAllChange = (event) => {
    let { checked } = event.target;
    const dataId = sortedData.map((d) => `${d.id}`);
    if (checked) {
      setCheckedData(dataId);
    } else {
      setCheckedData([]);
    }
  };

  /* deleting added social media profiles dialog opens */
  const deleteAddedprofile = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };
  /* Deleting social medai profiles list  */
  const handleDelete = () => {
    if (itemToDelete) {
      dispatch(deleteAddedProfileList(itemToDelete));
    }
  };

  //sorted features
  const [sortedField, setSortedField] = React.useState({});
  const [sortedData, setSortedData] = React.useState(null);

  React.useMemo(() => {
    let sortedProducts = [...data];
    if (sortedField !== null) {
      sortedProducts.sort((a, b) => {
        if (a[sortedField.key] < b[sortedField.key]) {
          return sortedField.direction === "ascending" ? -1 : 1;
        }
        if (a[sortedField.key] > b[sortedField.key]) {
          return sortedField.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortedProducts);
  }, [data, sortedField]);

  const requestSort = (key) => {
    setSort(!sort);
    let direction = "ascending";
    if (sortedField.key === key && sortedField.direction === "ascending") {
      direction = "descending";
    }
    setSortedField({ key, direction });
  };

  const isLabelSelected = (s) => {
    const [selectedlabel] = selectedLabels.filter((sl) => sl.key === s.key);
    if (selectedlabel) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div
        className={classes.divTabelContent}
        style={{ display: xs ? "block" : "flex" }}
      >
        {loader ? (
          <Spinner />
        ) : xs ? (
          sortedData.map((d, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                width: "100%",
                padding: "10px 0px",
                borderBottom: "1px solid #bdbdbd",
                backgroundColor:
                  checkedData && checkedData.includes(`${d.id}`)
                    ? "rgb(255, 248, 222)"
                    : "transparent",
              }}
            >
              <div>
                <Checkbox
                  checked={checkedData.includes(`${d.id}`)}
                  onChange={handleChange}
                  value={d.id}
                />
              </div>
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex" }}>
                  <div>
                    <Avatar
                      src={formatImage(
                        activeSocialMediaType,
                        subdomain,
                        d.picture
                      )}
                      style={{
                        marginRight: "6px",
                        border: "1px solid #E0E0E0",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 14, color: "#000", fontWeight: "600" }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#757575",
                        fontWeight: "400",
                      }}
                    >
                      {d.username}
                    </div>
                  </div>
                </div>
                <div
                  style={{ paddingTop: 10, display: "flex", flexWrap: "wrap" }}
                >
                  {allLabels.map((s) => {
                    if (isLabelSelected(s)) {
                      return (
                        <div
                          style={{
                            width: "33%",
                            padding: 5,
                            marginBottom: 5,
                            wordBreak: "break-word",
                          }}
                        >
                          <div style={{ fontSize: 10, color: "#757575" }}>
                            {s.mobileTitle}
                          </div>
                          <div style={{ fontSize: 12, color: "#000" }}>
                            {d[s.key] ? formatNumber(d[s.key]) : 0}{" "}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                {user.role !== constant.CUSTOMER_VIEWER_NAME ? (
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteAddedprofile(d.id)}
                    style={{ padding: 9 }}
                  >
                    <RemoveCircleOutlineOutlinedIcon color="error" />
                  </IconButton>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <div
              className={classes.table1}
              style={{ minWidth: md ? (sm ? 290 : 360) : 500 }}
            >
              <div className={`${classes.tableHeader}`}>
                <div className={classes.tableRow}>
                  <div className={classes.tableCheckbox}>
                    <Checkbox onChange={handleAllChange} />
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Profile
                  </div>
                </div>
              </div>
              <div className={classes.tableBody}>
                {sortedData &&
                  sortedData.map((d) => (
                    <div
                      className={classes.tableRow}
                      style={{
                        backgroundColor:
                          checkedData && checkedData.includes(`${d.id}`)
                            ? "rgb(255, 248, 222)"
                            : "transparent",
                      }}
                    >
                      <div className={classes.tableCheckbox}>
                        <Checkbox
                          checked={checkedData.includes(`${d.id}`)}
                          onChange={handleChange}
                          value={d.id}
                        />
                      </div>
                      <div className={classes.tableData}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {d.is_data_downloading && (
                            <div
                              style={{
                                width: 6,
                                height: 30,
                                backgroundColor: "#FBE281",
                                position: "absolute",
                                left: 5,
                              }}
                            ></div>
                          )}

                          <Avatar
                            src={formatImage(
                              activeSocialMediaType,
                              subdomain,
                              d.picture
                            )}
                            style={{
                              marginRight: "16px",
                              border: "1px solid #E0E0E0",
                            }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              style={{
                                fontWeight: 600,
                                textTransform: "capitalize",
                                whiteSpace: "break-space",
                                fontSize: 15,
                                cursor: "pointer",
                                maxHeight: 25,
                                overflow: "hidden",
                              }}
                              onClick={() =>
                                history.push("/brand-overview", d.id)
                              }
                            >
                              {d.name}
                            </Typography>
                            <Typography
                              style={{
                                textTransform: "capitalize",
                                whiteSpace: "nowrap",
                                fontSize: 13,
                                color: "#757575",
                                maxHeight: 23,
                                overflow: "hidden",
                              }}
                            >
                              {d.username}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 15,
                  right: 0,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  borderLeft: "1px solid #bdbdbd",
                  borderBottom: "1px solid #bdbdbd",
                  borderTop: "1px solid #bdbdbd",
                  cursor: "pointer",
                  width: 20,
                }}
                onClick={() => scrollScroller("left")}
              >
                <ArrowBackIosIcon
                  style={{
                    position: "absolute",
                    left: 5,
                    color: "#bdbdbd",
                    fontSize: 20,
                  }}
                />
              </div>
            </div>
            <div
              className={`${classes.table2} table-2-component`}
              ref={scrollerRef}
              style={{ minWidth: md ? (sm ? 220 : 290) : 500 }}
            >
              <div className={`${classes.tableHeader}`}>
                <div className={classes.tableRow}>
                  {allLabels.map((s) =>
                    isLabelSelected(s) ? (
                      <div
                        className={`${classes.tableData} table-2-table-header-data`}
                        style={{ display: "flex", alignItems: "center" }}
                        onClick={() => requestSort(`${s.key}`)}
                      >
                        <p className={classes.headerTextStyle}>{s.title} </p>
                        {sortedField.direction === "ascending" ? (
                          <ArrowDropDownIcon
                            className={`${classes.arrow} arrowComponent`}
                          />
                        ) : (
                          <ArrowDropUpIcon
                            className={`${classes.arrow} arrowComponent`}
                          />
                        )}{" "}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
              <div className={classes.tableBody}>
                {sortedData &&
                  sortedData.map((d) => (
                    <div
                      className={classes.tableRow}
                      style={{
                        backgroundColor:
                          checkedData && checkedData.includes(`${d.id}`)
                            ? "rgb(255, 248, 222)"
                            : "transparent",
                      }}
                    >
                      {allLabels.map((s) => {
                        if (isLabelSelected(s)) {
                          return (
                            <div
                              className={`${classes.tableData} table-2-table-data`}
                              style={{
                                backgroundColor:
                                  checkedData && checkedData.includes(`${d.id}`)
                                    ? "rgb(255, 248, 222)"
                                    : "transparent",
                              }}
                            >
                              {" "}
                              {d[s.key] ? formatNumber(d[s.key]) : 0}{" "}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ))}
              </div>
            </div>
            <div className={classes.table3}>
              <div className={classes.tableHeader}>
                <div className={classes.tableRow}>
                  <div className={`${classes.tableData} table-3-table-data`}>
                    Delete
                  </div>
                </div>
              </div>
              <div className={classes.tableBody}>
                {data.map((d) => (
                  <div
                    className={classes.tableRow}
                    style={{
                      backgroundColor:
                        checkedData && checkedData.includes(`${d.id}`)
                          ? "rgb(255, 248, 222)"
                          : "transparent",
                    }}
                  >
                    <div className={`${classes.tableData} table-3-table-data`}>
                      {user.role !== constant.CUSTOMER_VIEWER_NAME ? (
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteAddedprofile(d.id)}
                        >
                          <RemoveCircleOutlineOutlinedIcon color="error" />
                        </IconButton>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 15,
                  left: 0,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  borderRight: "1px solid #bdbdbd",
                  borderBottom: "1px solid #bdbdbd",
                  borderTop: "1px solid #bdbdbd",
                  cursor: "pointer",
                }}
                onClick={() => scrollScroller("right")}
              >
                <ArrowForwardIosIcon
                  style={{
                    color: "#bdbdbd",
                    fontSize: 20,
                  }}
                />
              </div>
            </div>
          </>
        )}
        <Alert
          alert={itemToDelete}
          icon={
            <ErrorOutlineIcon
              style={{
                fontSize: "5rem",
                color: "#f50057",
                paddingBottom: 0,
              }}
            />
          }
          title="Are you sure?"
          confirmBtn="DELETE"
          description="You're about to Delete the profile. This process cannot be undone."
          open={deleteAlertOpen}
          setOpen={setDeleteAlertOpen}
          onConfirm={handleDelete}
          buttonbgcolor="#f50057"
        />
      </div>
    </>
  );
};

export default withRouter(CustomDataTable);
