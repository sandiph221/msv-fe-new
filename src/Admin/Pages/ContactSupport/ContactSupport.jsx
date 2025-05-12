import { Container, Grid, makeStyles, Typography } from "@mui/material";

import { CustomerSupportCard } from "../../../Components/CustomerSupportCard/CustomerSupportCard";
import Layout from "../../../Components/Layout";
import Styles from "./Styles";
import FilterDays from "../../../Components/FilterDays";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactSupportList } from "../../../store/actions/HelpPageAction";
import Spinner from "../../../Components/Spinner";

const useStyles = makeStyles((theme) => Styles(theme));
export const ContactSupport = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { contactSupportListLoader, contactSupportList } = useSelector(
    (state) => state.helpReducer
  );
  const { customDateRangeRed } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  useEffect(() => {
    if (customDateRangeRed) {
      dispatch(getContactSupportList(customDateRangeRed));
    }
  }, [customDateRangeRed]);

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div
          style={{
            marginTop: "16px",
          }}
        ></div>
        {/* <HelpPageBannerSection /> */}
        <Container style={{ marginTop: 55, marginBottom: 55 }}>
          <div
            id="contact-support-header"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 60,
              justifyContent: "space-between",
            }}
          >
            <Typography style={{ fontSize: 24, fontWeight: 600 }}>
              Customer Support
            </Typography>
            <FilterDays />
          </div>
          <Container disableGutters>
            <Grid container alignItems="center" style={{ marginBottom: 10 }}>
              <Typography
                style={{ fontSize: 14, marginRight: 5, fontWeight: 600 }}
              >
                Date-Range:
              </Typography>
              <Typography style={{ fontSize: 12 }}>
                {" "}
                {`${new Date(
                  customDateRangeRed[0].startDate
                ).toDateString()} to ${new Date(
                  customDateRangeRed[0].endDate
                ).toDateString()}  `}{" "}
              </Typography>
            </Grid>
            <Grid container spacing={3}>
              {contactSupportListLoader ? (
                <Spinner />
              ) : contactSupportList && contactSupportList.length === 0 ? (
                <Grid item xs={12}>
                  {" "}
                  <Typography style={{ textAlign: "center" }}>
                    No result found
                  </Typography>
                </Grid>
              ) : (
                contactSupportList &&
                contactSupportList.map((data) => (
                  <Grid item xs={12}>
                    <CustomerSupportCard data={data} key={data.id} />
                  </Grid>
                ))
              )}
            </Grid>
          </Container>
        </Container>
      </Grid>
    </Layout>
  );
};
