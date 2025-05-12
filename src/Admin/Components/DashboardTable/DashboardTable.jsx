import {
  Avatar,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Components/Spinner";
import { formatImage, formatNumber } from "utils/functions.js";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import Moment from "moment-timezone";
import { Link, withRouter } from "react-router-dom";
import Alert from "../../../Components/AlertBox/Alert";
import {
  deletePagesInfo,
  updatePagesInfo,
} from "../../../store/actions/SuperAdminDashboardAction";

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

const DashboardTable = ({ data, loader }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
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
                    Profile
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Total Fans
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Last Updated
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Domain
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Avatar
                            src={formatImage(
                              activeSocialMediaType,
                              subdomain,
                              d.image
                            )}
                            style={{
                              marginRight: "16px",
                              border: "1px solid #E0E0E0",
                            }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <Link
                              className={classes.link}
                              to={{ pathname: d.page_url }}
                              target="_blank"
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
                              >
                                {d.profile}
                              </Typography>
                            </Link>
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
                      <div className={classes.tableData}>
                        <Typography>{formatNumber(d.fan_count)}</Typography>
                      </div>
                      <div className={classes.tableData}>
                        <Typography>
                          {Moment(d.updatedAt)
                            .tz("Australia/Sydney")
                            .format("YYYY-MM-DD hh:mm A")}
                          <br />
                          <span style={{ fontSize: 13, color: "#757575" }}>
                            Australia/Sydney
                          </span>
                        </Typography>
                      </div>
                      <div className={classes.tableData}>
                        {/* {d.subdomains.map(d => d)} */}
                        {d.subdomains.length > 3 ? (
                          <Tooltip title={d.subdomains.join(", ")}>
                            <Typography style={{ cursor: "pointer" }}>
                              {d.subdomains.slice(0, 3).join(", ")}...
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography>{d.subdomains.join(", ")}</Typography>
                        )}
                      </div>
                      <div className={classes.tableData}>
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteAddedprofile(d.profile_id)}
                          >
                            <RemoveCircleOutlineOutlinedIcon color="error" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update">
                          <IconButton
                            aria-label="delete"
                            onClick={() => updateAddedprofile(d.profile_id)}
                          >
                            <SystemUpdateAltIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
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

export default withRouter(DashboardTable);
