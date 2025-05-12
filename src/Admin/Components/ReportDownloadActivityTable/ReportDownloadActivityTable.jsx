import { makeStyles, Typography } from "@mui/material";
import Moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import fbIcon from "../../../assets/images/facebook.png";
import instaBg from "../../../assets/images/instabg.png";
import { CustomButton } from "../../../Components/CustomButton/CustomButton";
import Spinner from "../../../Components/Spinner";

import {
  getMoreUserReportDownloadActivity,
  getUserReportDownloadActivity,
} from "../../../store/actions/UserActivityAction";

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
    overflow: "auto",
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
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
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
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
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
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
    padding: 12,
    width: "100%",
    borderBottom: "1px solid #bdbdbd",
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    wordBreak: "break-all",
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

const ReportDownloadActivityTable = ({ selectedSubdomain }) => {
  const dispatch = useDispatch();

  const { customDateRangeRed } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const { userReportDownloadActivity } = useSelector(
    (state) => state.userActivityReducer
  );

  const [page, setPage] = useState(1);

  const getDateFilter = () =>
    `start_date=${customDateRangeRed[0].startDate}&end_date=${customDateRangeRed[0].endDate}`;

  useEffect(() => {
    let filter = getDateFilter();
    if (selectedSubdomain.length > 0) {
      filter = `${filter}&subdomain_id=${selectedSubdomain[0]}`;
    }

    dispatch(getUserReportDownloadActivity(filter), page);
  }, [customDateRangeRed, selectedSubdomain]);

  useEffect(() => {
    if (page > 1) {
      let filter = getDateFilter();
      if (selectedSubdomain.length > 0) {
        filter = `${filter}&subdomain_id=${selectedSubdomain[0]}`;
      }

      dispatch(getMoreUserReportDownloadActivity(filter, page));
    }
  }, [page]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.divTabelContent}>
        {userReportDownloadActivity.loading ? (
          <Spinner />
        ) : (
          <>
            <div className={classes.table1}>
              <div className={`${classes.tableHeader}`}>
                <div className={classes.tableRow}>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Name
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Email
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Profile
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    File Type
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Domain
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Download Time
                  </div>
                </div>
              </div>
              <div className={classes.tableBody}>
                {!userReportDownloadActivity.loading &&
                userReportDownloadActivity.success
                  ? userReportDownloadActivity.data.map((d, i) => (
                      <div key={i} className={classes.tableRow}>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.name}
                          </Typography>
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.email}
                          </Typography>
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {JSON.parse(d.profile).join(", ")}
                          </Typography>
                          {d.social_type === "facebook" ? (
                            <img
                              style={{ height: 20, width: 20, marginLeft: 10 }}
                              alt="platform-icon"
                              src={fbIcon}
                            />
                          ) : (
                            <img
                              alt="platform-icon"
                              style={{ height: 25, width: 25, marginLeft: 10 }}
                              src={instaBg}
                            />
                          )}
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.file_type}
                          </Typography>
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.CustomerSubdomain
                              ? d.CustomerSubdomain.subdomain
                              : null}
                          </Typography>
                        </div>
                        <div className={classes.tableData}>
                          <div>
                            <Typography style={{ fontSize: 14 }}>
                              {Moment(d.download_time).tz('Australia/Sydney').format(
                                "YYYY-MM-DD hh:mm A"
                              )}
                            </Typography>
                            <Typography
                              style={{ fontSize: 13, color: "#757575" }}
                            >
                              Australia/Sydney
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))
                  : <div style={{
                      textAlign: "center",
                      margin: "20px auto",
                      fontSize: 16 ,
                      color: "#757575",
                      fontWeight: 500}}>
                        No data found
                      </div> }
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ margin: "20px auto" }}>
        <CustomButton onClick={() => setPage(parseInt(page) + 1)}>
          Load more
        </CustomButton>
      </div>
    </>
  );
};

export default withRouter(ReportDownloadActivityTable);
