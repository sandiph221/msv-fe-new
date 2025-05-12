import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import Layout from "../../Components/Layout";
import PageTitle from "../../Components/PageTitle/PageTitle";
import SocialButton from "../../Components/SocialButton";
import FilterDays from "../../Components/FilterDays";
import styles from "./Styles";
import { BubbleChart } from "../../Components/BubbleChart/BubbleChart";
import { SocialMediaCardLabels } from "../../Components/SocialMediaLabelsCard/SocialMediaLabelsCard";
import PeopleIcon from "@mui/icons-material/People";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import LineCharts from "../../Components/LineChart";
import { useDispatch, useSelector } from "react-redux";
import {
  getNoOfpeople,
  getSentimentData,
  resetSearchQuery,
  setSearchQuery,
} from "../../store/actions/SocialMediaProfileAction";
import TextInput from "../../Components/TextInput/TextInput";
import Spinner from "../../Components/Spinner";
import SocialListeningChipData from "./SocialListeningChipData";
import { SnackBarDownload } from "../../Components/SnackBar/DownloadSnackBar";

import { NO_DATA_AVAILABLE } from "../../utils/constant";
import axios from "axios";
import Feed from "./Feed";

const useStyles = makeStyles((theme) => styles(theme));

const SocialListeningPage = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles({ xs });
  const dispatch = useDispatch();
  const [searchKeyWord, setSearchKeyWord] = React.useState("");
  const [sentimentsChartData, setSentimentsChartData] = React.useState();
  const [sentimentsDateFilter, setSentimentsDateFilter] = React.useState("day");
  const [loader, setLoader] = React.useState(false);
  const [stateSearchData, setStateSearchData] = React.useState([]);
  const [loadingAlert, setLoadingAlert] = React.useState(false);
  const [displayPostList, setDisplayPostList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const {
    socialListeningDataLoading,
    customDateRangeRed,
    noOfPeople,
    noOfPeopleLoading,

    noOfSocialInteraction,

    emojiChartData,
    sentimentInTimeData,
    sentimentInTimeDataLoading,
    searchQueryData,
    socialListeningError,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const { startDate, endDate } = customDateRangeRed
    ? customDateRangeRed[0]
    : "";

  const getPosts = async (page) => {
    const posts = await axios.get(
      `/social-listening/instagram/feed/?start_date=${startDate}&end_date=${endDate}&keyword_query=${searchQueryData}&page=${page}&limit=16`
    );
    if (page > 1) {
      setDisplayPostList([...displayPostList, ...posts?.data?.data?.feed]);
    } else {
      setDisplayPostList([...posts?.data?.data?.feed]);
    }
    setPage(posts?.data?.data?.page);
  };

  useEffect(() => {
    if (searchQueryData && searchQueryData.length !== 0) {
      setStateSearchData(searchQueryData);
      getPosts(1);
    }
  }, []);

  //Handle search function

  const handleSearchFunction = async (event) => {
    await dispatch(setSearchQuery(searchKeyWord));
    setSearchKeyWord("");
  };

  const getNumberOfPeople = async () => {
    await dispatch(getNoOfpeople(sentimentsDateFilter));
  };

  const clearDisplayData = () => {
    setDisplayPostList([]);
  };
  useEffect(() => {
    if (
      !noOfPeopleLoading &&
      searchQueryData &&
      searchQueryData.length !== 0 &&
      customDateRangeRed &&
      Object.keys(noOfPeople).length === 0
    ) {
      getNumberOfPeople();
      getPosts(1);
    }
  }, [searchQueryData, customDateRangeRed]);

  useEffect(() => {
    setTimeout(() => {
      if (socialListeningError) {
        dispatch(getNoOfpeople(sentimentsDateFilter));
      }
    }, 600000);
  }, [socialListeningError]);

  const getSentiment = async () => {
    await dispatch(getSentimentData(searchQueryData, sentimentsDateFilter));
  };
  useEffect(() => {
    if (
      !noOfPeopleLoading &&
      sentimentsDateFilter &&
      searchKeyWord === "" &&
      searchQueryData &&
      searchQueryData.length !== 0
    ) {
      getSentiment();
    }
  }, [sentimentsDateFilter]);

  React.useEffect(() => {
    if (sentimentInTimeData) {
      setSentimentsChartData({
        datasets: sentimentInTimeData && sentimentInTimeData.datasets,
        labels:
          sentimentInTimeData && sentimentInTimeData.timeline
            ? sentimentInTimeData.timeline.map(
                (date) =>
                  `${new Date(date.end).toDateString().split(" ")[1]} ${
                    new Date(date.end).toDateString().split(" ")[2]
                  }`
              )
            : [],
        timeline: sentimentInTimeData && sentimentInTimeData.timeline,
      });
    }
  }, [sentimentInTimeData]);

  const sentimentChart = (selectProfiles, dateFilter) => {
    setSentimentsDateFilter(dateFilter);
  };

  useEffect(() => {
    setTimeout(() => setLoadingAlert(noOfPeopleLoading), 6000);
  }, [noOfPeopleLoading]);

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div className={classes.tabHeaderComp}>
          <SocialButton socialListening={true} />
          <FilterDays />
        </div>
        <PageTitle title="Social Listening" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 50,
          }}
        >
          <div
            style={{
              width: xs ? "100%" : "50%",
              padding: xs ? "0px 20px 10px" : "0px 40px 10px",
              margin: "0 auto",
            }}
          >
            {" "}
            <TextInput
              suggestions={false}
              placeholder="Search by keywords"
              value={searchKeyWord}
              onChange={(e) => setSearchKeyWord(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter" && event.target.value !== "") {
                  handleSearchFunction(event);
                }
              }}
              backgroundColor
              disable={noOfPeopleLoading || socialListeningError ? true : false}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SocialListeningChipData
              clearDisplayData={clearDisplayData}
              chipData={searchQueryData}
              loader={noOfPeopleLoading || socialListeningError ? true : false}
            />
            {searchQueryData && searchQueryData.length > 0 && (
              <Button
                disabled={noOfPeopleLoading || socialListeningError}
                className={classes.clearBtn}
                onClick={() => {
                  clearDisplayData();
                  dispatch(resetSearchQuery());
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          {searchQueryData.length > 0 && socialListeningDataLoading ? (
            <Spinner />
          ) : (
            searchQueryData.length > 0 && (
              <>
                <div
                  id="card-labels"
                  style={{
                    flexGrow: 1,
                    padding: xs ? "0px 20px 35px" : "0px 40px 35px",
                    width: "100%",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item style={{ width: xs ? "100%" : "450px" }}>
                      <div id="social-listening-card">
                        <SocialMediaCardLabels
                          cardTitle="No. of people"
                          cardFigures={noOfPeople.total_people_count}
                          colorCode="rgba(164,39,255, 0.1)"
                          cardIcon={
                            <PeopleIcon
                              style={{ fontSize: 24, color: "#A427FF" }}
                            />
                          }
                          loading={noOfPeopleLoading || socialListeningError}
                          socialListening={true}
                        />
                      </div>
                    </Grid>

                    <Grid item style={{ width: xs ? "100%" : "450px" }}>
                      <div id="social-listening-card">
                        <SocialMediaCardLabels
                          cardTitle="Social interactions"
                          cardFigures={
                            noOfSocialInteraction.total_interactions_count
                          }
                          colorCode="rgba(11, 102, 112, 0.1)"
                          cardIcon={
                            <CommentOutlinedIcon
                              style={{ fontSize: 24, color: "#0B6670" }}
                            />
                          }
                          loading={noOfPeopleLoading || socialListeningError}
                          socialListening={true}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <Container
                  maxWidth="xl"
                  style={{
                    marginBottom: "5%",
                    padding: xs ? "0px 20px" : "0px 42px",
                  }}
                  disableGutters={true}
                >
                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: sm ? "block" : "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid
                      id="bubble-chart"
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      // style={{
                      //   minHeight: 430,
                      //   maxWidth: sm
                      //     ? "calc(100vw - 18px)"
                      //     : md
                      //     ? "calc(50vw - 50px)"
                      //     : "100%",
                      // }}
                    >
                      {" "}
                      <Typography
                        style={{
                          fontSize: 22,
                          letterSpacing: 0,
                          fontWeight: 600,
                          marginBottom: 17,
                        }}
                      >
                        Top Emojis
                      </Typography>
                      <div style={{ position: "relative", minHeight: 430 }}>
                        {noOfPeopleLoading || socialListeningError ? (
                          <Spinner className={classes.loader} />
                        ) : emojiChartData && emojiChartData.length > 0 ? (
                          <div
                            style={{
                              border: "1px solid #bdbdbd",
                              borderRadius: 4,
                              backgroundColor: "#fff",
                              minHeight: 430,
                            }}
                          >
                            <BubbleChart chartData={emojiChartData} />
                          </div>
                        ) : (
                          <div
                            style={{
                              minHeight: 430,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #bdbdbd",
                              borderRadius: 4,
                              backgroundColor: "#fff",
                            }}
                          >
                            <Typography variant="h6">
                              {NO_DATA_AVAILABLE}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      id="sentiments-graph"
                    >
                      <Typography
                        style={{
                          fontSize: 22,
                          letterSpacing: 0,
                          fontWeight: 600,
                          marginBottom: 17,
                          position: loader
                            ? "relative"
                            : !loader && sentimentInTimeData.length === 0
                            ? "relative"
                            : "absolute",
                        }}
                      >
                        Sentiment in Time
                      </Typography>

                      <div style={{ position: "relative", minHeight: 430 }}>
                        {(noOfPeopleLoading ||
                          socialListeningError ||
                          sentimentInTimeDataLoading) && (
                          <Spinner className={classes.loader} />
                        )}{" "}
                        {sentimentInTimeData &&
                        sentimentInTimeData.length !== 0 ? (
                          <LineCharts
                            graphTitle="Posts "
                            adddeSocialMedaiProfile={null}
                            chartData={
                              sentimentInTimeDataLoading
                                ? []
                                : sentimentsChartData
                            }
                            getPostsData={(
                              selectProfiles,
                              sentimentDateFilter
                            ) => {
                              sentimentChart(
                                selectProfiles,
                                sentimentDateFilter
                              );
                            }}
                            sentimentChart={true}
                          />
                        ) : (
                          // (!noOfPeopleLoading || !socialListeningError || !sentimentInTimeDataLoading) &&
                          // sentimentInTimeData.length === 0 && (
                          //   <div
                          //     className={classes.chartFallBackContainer}
                          //     style={{ height: 430 }}
                          //   >
                          //     <div className={classes.chartFallBack}>
                          //       <Typography
                          //         className={classes.noData}
                          //         variant="h6"
                          //       >
                          //         {NO_DATA_AVAILABLE}
                          //       </Typography>
                          //     </div>
                          //   </div>
                          // )
                          ("")
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </Container>
              </>
            )
          )}
        </div>
      </Grid>
      {displayPostList.length ? (
        <Feed data={displayPostList} getFeed={getPosts} page={page} />
      ) : null}
      {noOfPeopleLoading || socialListeningError ? (
        <SnackBarDownload
          sociallistening="true"
          message={"Fetching data....."}
        />
      ) : null}
    </Layout>
  );
};

export default SocialListeningPage;
