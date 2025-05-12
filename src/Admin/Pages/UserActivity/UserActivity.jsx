import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../Components/Layout";
import {
  Grid,
  makeStyles,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  withStyles,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Checkbox,
  Typography,
} from "@mui/material";
import { Styles } from "./Styles";
import FilterDays from "../../../Components/FilterDays";
import { CustomButton } from "../../../Components/CustomButton/CustomButton";

import UserLoginActivityTable from "../../Components/UserLoginActivityTable/UserLoginActivityTable";
import ReportDownloadActivityTable from "../../Components/ReportDownloadActivityTable/ReportDownloadActivityTable";

import { getSubdomainList } from "../../../store/actions/UserActivityAction";

const useStyles = makeStyles((theme) => Styles(theme));

//Styled menu
const StyledSelect = withStyles({
  root: {
    padding: 12,
    border: "1px solid #BDBDBD",
    height: "24px",
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
  root: {
    fontSize: 20,
    fontWeight: 400,
    color: "#000000 !important",
  },
  outlined: {
    transform: "translate(10px, 12px) scale(0.8) !important",
  },
  focused: {
    color: "#000000 !important",
    opacity: "1 !important",
  },
})(InputLabel);

const menuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
};

const TABLE_LIST = {
  LOGIN_ACTIVITY: "LOGIN_ACTIVITY",
  REPORT_ACTIVITY: "REPORT_ACTIVITY",
};

const UserActivity = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const dispatch = useDispatch();

  const { subdomainList } = useSelector((state) => state.userActivityReducer);

  useEffect(() => {
    dispatch(getSubdomainList());
  }, []);

  const [selectedTable, setSelectedTable] = useState(TABLE_LIST.LOGIN_ACTIVITY);
  const [subdomainListOpen, setSubdomainListOpen] = useState(false);
  const [selectedSubdomain, setSelectedSubdomain] = useState([]);

  // const updateSelectedSubdomain = (value, checked) => {
  //   setSubdomainListOpen(true)
  //   let newSelectedSubdomain = [];
  //   if (checked) {
  //     newSelectedSubdomain = [...selectedSubdomain, value];
  //   } else {
  //     newSelectedSubdomain = selectedSubdomain.filter((s) => s !== value);
  //   }

  //   setSelectedSubdomain(newSelectedSubdomain);
  // };

  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.main}>
        <div style={{ padding: 10 }} className="dashboardPageContainer">
          <Container disableGutters maxWidth="xl">
            <Box className={classes.topFilter}>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                  <CustomButton
                    border
                    defaultBackgroundColor={
                      selectedTable === TABLE_LIST.LOGIN_ACTIVITY ? true : false
                    }
                    onClick={() => setSelectedTable(TABLE_LIST.LOGIN_ACTIVITY)}
                    style={{ marginRight: 20 }}
                  >
                    Login Activity
                  </CustomButton>
                  <CustomButton
                    border
                    defaultBackgroundColor={
                      selectedTable === TABLE_LIST.REPORT_ACTIVITY
                        ? true
                        : false
                    }
                    onClick={() => setSelectedTable(TABLE_LIST.REPORT_ACTIVITY)}
                  >
                    Report Activity
                  </CustomButton>
                </Grid>
                <Grid item style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginRight: 10,
                    }}
                  >
                    <FormControl
                      style={{
                        margin: xs ? "10px auto" : "0px 10px 0px 0px",
                        width: 200,
                      }}
                      className={classes.FormControl}
                    >
                      <StyledInputLabel
                        variant="outlined"
                        id="profiles-data-label"
                        shrink={true}
                        style={{ top: 4 }}
                      >
                        {" "}
                        Select Domain
                      </StyledInputLabel>

                      <StyledSelect
                        labelId="demo-simple-select-label"
                        variant="outlined"
                        displayEmpty={false}
                        value=""
                        open={subdomainListOpen}
                        onClose={() => setSubdomainListOpen(false)}
                        onOpen={() => setSubdomainListOpen(true)}
                        MenuProps={menuProps}
                      >
                        {!subdomainList.loading && subdomainList.success ? (
                          subdomainList.data.map((subdomain) => (
                            <StyledMenuItem
                              key={subdomain.id}
                              value={subdomain.id}
                              selected={true}
                              style={{
                                background: selectedSubdomain.includes(
                                  subdomain.id
                                )
                                  ? "#FFF8DE"
                                  : "transparent",
                                borderBottom: "1px solid #e0e0e0",
                                padding: 8,
                              }}
                              onClick={() =>
                                setSelectedSubdomain([subdomain.id])
                              }
                            >
                              <div
                                id="styled-menu-item"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {/* <Checkbox
                                  type="checkbox"
                                  onChange={(e) => updateSelectedSubdomain(subdomain.id, e.target.checked)}
                                  checked={selectedSubdomain.includes(subdomain.id)}
                                /> */}
                                <Typography
                                  style={{ fontSize: 15, fontWeight: 600 }}
                                >
                                  {" "}
                                  {subdomain.subdomain}{" "}
                                </Typography>{" "}
                              </div>
                            </StyledMenuItem>
                          ))
                        ) : (
                          <StyledMenuItem value="" selected={true}>
                            <Typography
                              style={{ fontSize: 15, fontWeight: 600 }}
                            >
                              No Data Avialable
                            </Typography>{" "}
                          </StyledMenuItem>
                        )}
                      </StyledSelect>
                    </FormControl>
                  </div>
                  <FilterDays />
                </Grid>
              </Grid>
            </Box>
            <Grid container style={{ paddingTop: 20 }}>
              {selectedTable === TABLE_LIST.LOGIN_ACTIVITY && (
                <UserLoginActivityTable selectedSubdomain={selectedSubdomain} />
              )}

              {selectedTable === TABLE_LIST.REPORT_ACTIVITY && (
                <ReportDownloadActivityTable
                  selectedSubdomain={selectedSubdomain}
                />
              )}
            </Grid>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default UserActivity;
