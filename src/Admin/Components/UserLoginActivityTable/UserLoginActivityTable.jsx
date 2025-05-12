import { makeStyles, Typography } from '@mui/material';
import Moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fbIcon from '../../../assets/images/facebook.png';
import { CustomButton } from '../../../Components/CustomButton/CustomButton';
import Spinner from '../../../Components/Spinner';

import {
  getMoreUserLoginActivity,
  getUserLoginActivity,
} from '../../../store/actions/UserActivityAction';

const useStyles = makeStyles((theme) => ({
  divTabelContent: {
    display: 'flex',
    width: '100%',
    position: 'relative',
  },
  table1: {
    flexGrow: 1,
    position: 'relative',
    minWidth: 500,
    overflow: 'auto',
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
    '& .table-1-table-data': {
      minHeight: 65,
      display: 'flex',
      alignItems: 'center',
    },
  },
  table2: {
    flexGrow: 2,
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
    '& .table-2-table-header-data': {
      display: 'flex',
      justifyContent: 'center',
    },

    '& .table-2-table-data': {
      padding: 24,
      fontSize: 14,
      paddingLeft: 14,
      display: 'flex',
      justifyContent: 'center',
      // minHeight: 65.5
    },
  },
  table3: {
    flexGrow: 3,
    borderLeft: '1px solid #bdbdbd',
    position: 'relative',
    border: '1px solid #e0e0e0',
    boxShadow: 'none',
    borderRadius: 8,
    '& .table-3-table-data': {
      padding: 22,
      justifyContent: 'center',
      // minHeight: 66.5
    },
    '& .MuiButtonBase-root': {
      padding: 0,
    },
  },
  tableHeader: {
    '& div': {
      backgroundColor: '#F5F5F5',
      fontWeight: 600,
      fontSize: 14,
      textTransform: 'capitalize',
      cursor: 'pointer',
      '& :hover': {
        '& .arrowComponent': {
          display: 'block',
        },
      },

      '& .arrowComponent': {
        display: 'none',
      },
      '& .table-3-table-data': {
        alignItems: 'center',
      },
    },
  },
  tableBody: {},
  tableRow: {
    display: 'flex',
    minHeight: 70,
  },
  tableData: {
    minWidth: 250,
    padding: 12,
    width: '100%',
    borderBottom: '1px solid #bdbdbd',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  tableCheckbox: {
    borderBottom: '1px solid #bdbdbd',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,

    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#0B6670',
    },
  },
  arrow: {
    fontSize: 22,
    color: '#bdbdbd',
  },
  headerTextStyle: {
    margin: 0,
    whiteSpace: 'break-spaces',
    textAlign: 'center',
  },
  link: {
    color: 'initial',
    textDecoration: 'none',
  },
}));

const UserLoginActivityTable = ({ selectedSubdomain }) => {
  const dispatch = useDispatch();

  const { customDateRangeRed } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const { userLoginActivity } = useSelector(
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

    dispatch(getUserLoginActivity(filter), page);
  }, [customDateRangeRed, selectedSubdomain]);

  useEffect(() => {
    if (page > 1) {
      let filter = getDateFilter();
      if (selectedSubdomain.length > 0) {
        filter = `${filter}&subdomain_id=${selectedSubdomain[0]}`;
      }

      dispatch(getMoreUserLoginActivity(filter, page));
    }
  }, [page]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.divTabelContent}>
        {userLoginActivity.loading ? (
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
                    Role
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Domain
                  </div>
                  <div className={`${classes.tableData} table-1-table-data`}>
                    Last Login At
                  </div>
                </div>
              </div>
              <div className={classes.tableBody}>
                {!userLoginActivity.loading && userLoginActivity.success
                  ? userLoginActivity.data.map((d, i) => (
                      <div
                        key={i}
                        className={classes.tableRow}
                      >
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.first_name} {d.last_name}
                          </Typography>
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.email}
                          </Typography>
                          {d.last_login_with === 'facebook' ? (
                            <img
                              style={{ height: 20, width: 20, marginLeft: 10 }}
                              alt='social-media icon'
                              src={fbIcon}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        <div className={classes.tableData}>
                          <Typography style={{ fontSize: 14 }}>
                            {d.role}
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
                          <div style={{ display: 'block' }}>
                            <Typography style={{ fontSize: 14 }}>
                              {Moment(d.last_login_at)
                                .tz(
                                  d.timezone ? d.timezone : 'Australia/Sydney'
                                )
                                .format('YYYY-MM-DD hh:mm A')}
                            </Typography>
                            <Typography
                              style={{ fontSize: 13, color: '#757575' }}
                            >
                              {d.timezone}
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
      <div style={{ margin: '20px auto' }}>
        <CustomButton onClick={() => setPage(parseInt(page) + 1)}>
          Load more
        </CustomButton>
      </div>
    </>
  );
};

export default withRouter(UserLoginActivityTable);
