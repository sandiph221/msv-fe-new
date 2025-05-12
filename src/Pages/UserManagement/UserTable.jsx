import {
  makeStyles,
  Checkbox,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatImage, formatNumber } from "utils/functions.js";
import Spinner from "../../Components/Spinner";

import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Alert from "../../Components/AlertBox/Alert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link, withRouter } from "react-router-dom";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import {
  deletePagesInfo,
  updatePagesInfo,
} from "../../store/actions/SuperAdminDashboardAction";
import Moment from "moment-timezone";

const useStyles = makeStyles((theme) => ({
  divTabelContent: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  table1: {
    flexGrow: 1,
    position: "relative",
    minWidth: 500,
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
    alignItems: "center",
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
  link: {
    color: "initial",
    textDecoration: "none",
  },
}));

const UserTable = ({
  data,
  loader,
  selectedLabels,
  getSelectedProfileList,
  history,
  allLabels,
}) => {
  console.log("data", data);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [checkedData, setCheckedData] = useState([]);
  const [sort, setSort] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToUpdate, setItemToUpdate] = React.useState(null);
  const { user } = useSelector((state) => state.auth);
  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  let subdomain = user.CustomerSubdomain
    ? user.CustomerSubdomain.subdomain
    : "";

  //handele all select function

  /* deleting added social media profiles dialog opens */
  const deleteAddedprofile = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };
  const updateAddedprofile = (data) => {
    setUpdateAlertOpen(true);
    setItemToUpdate(data);
  };
  /* Deleting social medai profiles list  */
  const handleDelete = () => {
    if (itemToDelete) {
      dispatch(deletePagesInfo(itemToDelete));
    }
  };

  /* udpate social medai profiles list  */
  const handleUpdate = () => {
    if (itemToUpdate) {
      dispatch(updatePagesInfo(itemToUpdate));
    }
  };

  return (
    <>
      <div className={classes.divTabelContent}>
        {loader ? (
          <Spinner />
        ) : (
          <>
            <div className={classes.table1}>
              <div className={`${classes.tableHeader}`}>
                <div className={classes.tableRow}>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    First Name
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Last Name
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Position
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    SubDomain
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Actions
                  </div>
                </div>
              </div>
              <div className={classes.tableBody}>
                {data.length !== 0 &&
                  data.map((d, i) => (
                    <div key={i} className={classes.tableRow}>
                      <div className={classes.tableData}>
                        <Typography>{d.first_name}</Typography>
                      </div>
                      <div className={classes.tableData}>
                        <Typography>{d.last_name}</Typography>
                      </div>
                      <div className={classes.tableData}>
                        <Typography>{d.position}</Typography>
                      </div>
                      <div className={classes.tableData}>
                        <Typography>{d.CustomerSubdomain.subdomain}</Typography>
                      </div>
                      <div className={classes.tableData}>
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteAddedprofile(d.id)}
                          >
                            <RemoveCircleOutlineOutlinedIcon color="error" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update">
                          <IconButton
                            aria-label="delete"
                            onClick={() => updateAddedprofile(d.id)}
                          >
                            <SystemUpdateAltIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* <div className={classes.table3}>
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
              </div> */}
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
          description={`You're about to delete the profile. This process cannot be undone.`}
          open={deleteAlertOpen}
          setOpen={setDeleteAlertOpen}
          onConfirm={handleDelete}
          buttonbgcolor="#f50057"
        />
        <Alert
          alert={itemToUpdate}
          icon={
            <ErrorOutlineIcon
              style={{
                fontSize: "5rem",
                color: "#2196f3",
                paddingBottom: 0,
              }}
            />
          }
          title="Are you sure?"
          confirmBtn="UPDATE"
          description={`You're about to update the profile. This process cannot be undone.`}
          open={updateAlertOpen}
          setOpen={setUpdateAlertOpen}
          onConfirm={handleUpdate}
          buttonbgcolor="#2196f3"
        />
      </div>
    </>
  );
};

export default withRouter(UserTable);
