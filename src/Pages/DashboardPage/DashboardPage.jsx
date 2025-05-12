import {
  Box,
  Container,
  Grid,
  MenuItem,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@mui/material";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import BarChart from "../../Components/BarChart";
import { CustomButton } from "../../Components/CustomButton/CustomButton";
import DownloadButton from "../../Components/DownloadButton/DownloadButton";
import FilterDays from "../../Components/FilterDays";
import Layout from "../../Components/Layout";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { SnackBarDownload } from "../../Components/SnackBar/DownloadSnackBar";
import SocialButton from "../../Components/SocialButton";
import SocialMediaPostsCard from "../../Components/SocialMediaPostsCard/SocialMediaPostsCard";
import Spinner from "../../Components/Spinner";
import { PDFlogo, PNGlogo, XLSXlogo } from "../../Components/logosandicons";
import {
  getAddedProfileList,
  getInteractions,
  getMoreSocialProfileTopPost,
  getSocialProfileFanGrowth,
  getSocialProfileTopPost,
} from "../../store/actions/SocialMediaProfileAction";
import { DashboardExport } from "./DashboardExport";
import DashboardPDF from "./DashboardPDF";

import { pdf } from "@react-pdf/renderer";
import { CustomSelectDropdown } from "../../Components/CustomSelectDropdown/CustomSelectDropdown";
import { createUserReportDownloadActivity } from "../../store/actions/UserActivityAction";
import { NO_DATA_AVAILABLE } from "../../utils/constant";
import { Styles } from "./Style";
import ConnectToSocial from "Customer/Components/ConnectToSocial";

const useStyles = makeStyles((theme) => Styles(theme));

const StyledMenuItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#FFF8DE",
    },
  },
})(MenuItem);

const DashboardPage = ({ history }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectProfile, setSelectProfile] = useState([]);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  //handle change of select profile
  const selectProfileHandleChange = (e) => {
    setSelectProfile(e.target.value);
  };

  // Fan Growth Chart
  const [fanGrowthData, setFanGrowthData] = useState({
    datasets: "",
    labels: "",
  });
  const [fanGrowthSelectedProfiles, setFanGrowthSelectedProfiles] = useState(
    []
  );
  const [fanGrowthDateFilter, setfanGrowthDateFilter] = useState("");
  // Fan Growth Chart

  // Interactions Chart
  const [interactionsData, setinteractionsData] = useState({
    datasets: "",
    labels: "",
  });
  const [interactionSelectedProfiles, setinteractionSelectedProfiles] =
    useState([]);
  const [interactionDateFilter, setinteractionDateFilter] = useState("");
  const [interaction1kPerFans, setInteraction1KPerFans] = useState(false);
  //Interactions Chart

  //For Chart Images
  const [Image1, setImage1] = useState("");
  const [Image2, setImage2] = useState("");

  //Top Posts limit and page

  let [page_limit, setPageLimit] = useState(4);
  let [currentPage, setCurrentPage] = useState(1);

  //Resetting page limit to 4 after profile change

  useEffect(() => {
    setPageLimit(4);
  }, [selectProfile]);

  const {
    addedProfileList,
    addedProfileListLoading,
    activeSocialMediaType,
    fansGrowth,
    fanGrowthLoader,
    interactionData,
    profileTopPost,
    profileTopPostLoading,
    interactionLoader,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const { user } = useSelector((state) => state.auth);

  let subdomain = user.CustomerSubdomain.subdomain;

  const { feeds, pages } = profileTopPost ? profileTopPost : "";

  React.useEffect(() => {
    //checking internet connection

    var condition = navigator.onLine ? "online" : "offline";

    if (condition === "offline") {
      toast.error("No internet connection");
    }
  }, [customDateRangeRed, activeSocialMediaType, selectProfile]);

  React.useEffect(() => {
    if (activeSocialMediaType) {
      setSelectProfile([]);
      dispatch(getAddedProfileList());
    }
  }, [activeSocialMediaType]);

  /* setting initial value for selecting profiles */
  useEffect(() => {
    if (addedProfileList && addedProfileList.length !== 0) {
      setSelectProfile(addedProfileList[0].id);
    }
  }, [addedProfileList]);

  // Fan Growth Chart
  const fanGrowthChart = (selectedProfiles, dateFilter) => {
    setFanGrowthSelectedProfiles(selectedProfiles);
    setfanGrowthDateFilter(dateFilter);
  };
  useEffect(() => {
    setFanGrowthData({
      datasets: fansGrowth && fansGrowth.datasets,
      labels:
        fansGrowth && fansGrowth.timeline
          ? fansGrowth.timeline.map(
              (date) =>
                `${new Date(date.end).toDateString().split(" ")[1]} ${
                  new Date(date.end).toDateString().split(" ")[2]
                }`
            )
          : [],
      timeline: fansGrowth && fansGrowth.timeline,
    });
  }, [fansGrowth]);

  useEffect(() => {
    if (
      fanGrowthSelectedProfiles &&
      fanGrowthSelectedProfiles.length !== 0 &&
      fanGrowthDateFilter &&
      customDateRangeRed
    ) {
      dispatch(
        getSocialProfileFanGrowth(
          fanGrowthSelectedProfiles,
          fanGrowthDateFilter
        )
      );
    }
  }, [fanGrowthSelectedProfiles, fanGrowthDateFilter, customDateRangeRed]);

  // Fan Growth Chart

  // Interaction Chart
  const interactionsChart = (
    selectedProfiles,
    interactionDateFilter,
    kPerFans
  ) => {
    setinteractionSelectedProfiles(selectedProfiles);
    setinteractionDateFilter(interactionDateFilter);
    setInteraction1KPerFans(kPerFans);
  };
  useEffect(() => {
    setinteractionsData({
      datasets: interactionData && interactionData.datasets,
      labels:
        interactionData && interactionData.timeline
          ? interactionData.timeline.map(
              (date) =>
                `${new Date(date.end).toDateString().split(" ")[1]} ${
                  new Date(date.end).toDateString().split(" ")[2]
                }`
            )
          : [],
      timeline: interactionData && interactionData.timeline,
    });
  }, [interactionData]);

  useEffect(() => {
    if (
      interactionSelectedProfiles &&
      interactionSelectedProfiles.length !== 0 &&
      interactionDateFilter &&
      customDateRangeRed
    ) {
      dispatch(
        getInteractions(
          interactionSelectedProfiles,
          interactionDateFilter,
          interaction1kPerFans
        )
      );
    }
  }, [
    interactionSelectedProfiles,
    interactionDateFilter,
    customDateRangeRed,
    interaction1kPerFans,
  ]);
  // Interaction Chart
  // Top Posts
  useEffect(() => {
    if (selectProfile && selectProfile.length !== 0 && customDateRangeRed) {
      dispatch(getSocialProfileTopPost(selectProfile, page_limit, currentPage));
    }
  }, [customDateRangeRed, selectProfile]);

  // Top Posts Load More
  React.useEffect(() => {
    if (selectProfile && selectProfile.length !== 0 && customDateRangeRed) {
      dispatch(
        getMoreSocialProfileTopPost(selectProfile, page_limit, currentPage)
      );
    }
  }, [page_limit]);

  // const props = {}
  const classes = useStyles({ sm, xs });

  //fucntion to convert canvas to base64 dataUrl
  function getBase64(file) {
    return domtoimage.toPng(file).then((dataURL) => dataURL);

    // return new Promise((resolve, reject) => {
    //     const mapData1 = file.toDataURL('image/jpg', 1.0);
    //     resolve(mapData1);

    // });
  }

  useEffect(() => {
    var Image1 = document.querySelector("#totalFollowers");
    var Image2 = document.querySelector("#interaction");

    setTimeout(() => {
      if (Image1) {
        getBase64(Image1).then((data) => setImage1(data));
      }
    }, 3000);

    setTimeout(() => {
      if (Image2) {
        getBase64(Image2).then((data) => setImage2(data));
      }
    }, 3000);
  }, [
    selectProfile,
    interactionDateFilter,
    fanGrowthDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
    addedProfileList,
    interactionSelectedProfiles,
  ]);

  //For Generating PDF

  let [selectedTopPostProfile] = addedProfileList.filter(
    (data) => data.id === selectProfile
  );

  //send download activity report
  const createUserDownloadActivity = (type) => {
    let profilesForActivityReport = [];

    if (selectedTopPostProfile) {
      profilesForActivityReport.push(selectedTopPostProfile.name);
    }

    fanGrowthSelectedProfiles.forEach((f) => {
      const [profilesDetails] = addedProfileList.filter((d) => d.id === f);

      if (
        profilesDetails &&
        !profilesForActivityReport.includes(profilesDetails.name)
      ) {
        profilesForActivityReport.push(profilesDetails.name);
      }
    });

    interactionSelectedProfiles.forEach((f) => {
      const [profilesDetails] = addedProfileList.filter((d) => d.id === f);
      if (
        profilesDetails &&
        !profilesForActivityReport.includes(profilesDetails.name)
      ) {
        profilesForActivityReport.push(profilesDetails.name);
      }
    });

    dispatch(createUserReportDownloadActivity(profilesForActivityReport, type));
  };

  const generatePdfDocument = async () => {
    //send download activity report function
    createUserDownloadActivity("pdf");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);

    const blob = await pdf(
      <DashboardPDF
        activeSocialMediaType={activeSocialMediaType}
        chart1={Image1}
        chart2={Image2}
        interactionDateFilter={interactionDateFilter}
        fanGrowthDateFilter={fanGrowthDateFilter}
        topPostPageName={selectedTopPostProfile.page_name}
        page_picture={selectedTopPostProfile.page_picture}
        addedProfileList={addedProfileList}
        feeds={feeds}
        feedLimit={page_limit}
        interactionAddedProfiles={interactionSelectedProfiles}
        user={user}
        customDateRangeRed={customDateRangeRed}
      />
    ).toBlob();
    saveAs(blob, `${activeSocialMediaType}-overview Dashboard.pdf`);
  };
  //For Generating PNG

  function screenshotPage() {
    //send download activity report function
    createUserDownloadActivity("screenshot");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);
    var wrapper = document.querySelector(".dashboardPageContainer");
    domtoimage.toBlob(wrapper, { bgcolor: "#ffffff" }).then(function (blob) {
      saveAs(
        blob,
        `${selectedTopPostProfile.name} ${activeSocialMediaType}-overview.png`
      );
    });
  }

  //For changing page limit for Top Posts

  function changePageLimit() {
    switch (page_limit) {
      case 4:
        setPageLimit(12);
        break;

      case 12:
        setPageLimit(20);
        break;

      default:
        setPageLimit(4);
    }
  }

  //For adding top post profile id into reducer

  function addTopPostProfileId() {
    dispatch({
      type: "REMOVE_PROFILES_FROM_COMPARE",
      payload: [],
    });
    dispatch({
      type: "TOP_POST_ID",
      payload: selectProfile,
    });
    history.push("/content-newsfeed");
  }

  return (
    <Layout>
      <div className={classes.main}>
        <div style={{ padding: 10 }} className="dashboardPageContainer">
          {addedProfileList.length === 0 ? (
            <ConnectToSocial />
          ) : (
            <Container disableGutters maxWidth="xl">
              <Box className={classes.topFilter}>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item>
                    <SocialButton />
                  </Grid>
                  <Grid item style={{ display: "flex" }}>
                    <FilterDays />
                    <DownloadButton>
                      <StyledMenuItem onClick={() => generatePdfDocument()}>
                        {" "}
                        <img
                          style={{ width: 20, height: 20, marginRight: 5 }}
                          alt="pdf logo"
                          src={PDFlogo}
                        />{" "}
                        Export pdf{" "}
                      </StyledMenuItem>
                      <StyledMenuItem onClick={() => screenshotPage()}>
                        <img
                          style={{ width: 20, height: 20, marginRight: 5 }}
                          alt="png logo"
                          src={PNGlogo}
                        />{" "}
                        Export png{" "}
                      </StyledMenuItem>
                      <StyledMenuItem>
                        {" "}
                        <DashboardExport
                          xlsxLogo={XLSXlogo}
                          showDownloadSnackBar={setShowDownloadToast}
                          timeRange={customDateRangeRed}
                          interaction1kPerFans={interaction1kPerFans}
                          interactionDateFilter={interactionDateFilter}
                          fanGrowthDateFilter={fanGrowthDateFilter}
                          onClick={() => {
                            //send download activity report function
                            createUserDownloadActivity("excel");
                          }}
                        />{" "}
                      </StyledMenuItem>
                    </DownloadButton>
                  </Grid>
                </Grid>
              </Box>
              <PageTitle />

              {addedProfileListLoading ? (
                <Spinner />
              ) : addedProfileList && addedProfileList.length !== 0 ? (
                <>
                  <Grid className={classes.charts} container spacing={3}>
                    <Grid className={classes.growthChart} item xs={12} lg={6}>
                      {addedProfileList.length !== 0 ? (
                        <div>
                          <BarChart
                            chartId="totalFollowers"
                            chartTitle="Follower growth"
                            graphTitle="Fan growth"
                            showLabel="true"
                            showPeriod={true}
                            adddeSocialMedaiProfile={addedProfileList}
                            chartData={fanGrowthData}
                            getSelectedProfile={(
                              selectProfiles,
                              dateFilter
                            ) => {
                              fanGrowthChart(selectProfiles, dateFilter);
                            }}
                          />
                          {fanGrowthLoader && (
                            <Spinner className={classes.loader} />
                          )}
                        </div>
                      ) : (
                        <div className={classes.chartFallBackContainer}>
                          <div className={classes.graphTitleSection}>
                            <Typography
                              className={classes.graphTitle}
                              variant="h5"
                            >
                              Top Followers
                            </Typography>
                          </div>

                          <div className={classes.chartFallBack}>
                            <Typography className={classes.noData} variant="h6">
                              {NO_DATA_AVAILABLE}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </Grid>
                    <Grid className={classes.growthChart} item xs={12} lg={6}>
                      {addedProfileList.length != 0 ? (
                        <div>
                          <BarChart
                            chartId="interaction"
                            chartTitle="Interactions"
                            graphTitle="Interactions"
                            showLabel="true"
                            showPeriod={true}
                            adddeSocialMedaiProfile={addedProfileList}
                            chartData={interactionsData}
                            getSelectedProfile={(
                              selectProfiles,
                              interactionDateFilter,
                              kPerFans
                            ) => {
                              interactionsChart(
                                selectProfiles,
                                interactionDateFilter,
                                kPerFans
                              );
                            }}
                            switchShow={true}
                          />

                          {interactionLoader && (
                            <Spinner className={classes.loader} />
                          )}
                        </div>
                      ) : (
                        <div className={classes.chartFallBackContainer}>
                          <div className={classes.graphTitleSection}>
                            <Typography
                              className={classes.graphTitle}
                              variant="h5"
                            >
                              Interactions
                            </Typography>
                          </div>

                          <div className={classes.chartFallBack}>
                            <Typography className={classes.noData} variant="h6">
                              {NO_DATA_AVAILABLE}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </Grid>
                  </Grid>

                  <Grid className={classes.charts} container spacing={3}>
                    <Grid className={classes.growthChart} item xs={12}>
                      <div>
                        <div className={classes.topPostHeadSection}>
                          <Typography className={classes.subTitle}>
                            Top posts
                          </Typography>
                          <CustomSelectDropdown
                            addedProfileList={addedProfileList}
                            selectProfileHandleChange={
                              selectProfileHandleChange
                            }
                            activeSocialMediaType={activeSocialMediaType}
                            selectProfile={selectProfile}
                            subdomain={subdomain}
                          />
                        </div>
                        <Grid container spacing={3}>
                          {profileTopPostLoading ? (
                            <div className={classes.topPost}>
                              <div className={classes.chartFallBack}>
                                <Spinner />
                              </div>
                            </div>
                          ) : feeds && feeds.length !== 0 ? (
                            feeds.map((topPost) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={3}
                                xl={3}
                                key={topPost._id}
                              >
                                <div>
                                  <SocialMediaPostsCard
                                    pageId={topPost.profile_info.social_page_id}
                                    pageName={topPost.profile_info.page_name}
                                    pagePicture={
                                      topPost.profile_info.page_picture
                                    }
                                    topPostData={topPost}
                                    totalPageLikes={
                                      topPost.profile_info.page_fan_count
                                    }
                                  />
                                </div>
                              </Grid>
                            ))
                          ) : (
                            <div style={{ width: "100%", margin: 10 }}>
                              <div className={classes.chartFallBack}>
                                <Typography
                                  className={classes.noData}
                                  variant="h6"
                                >
                                  {NO_DATA_AVAILABLE}
                                </Typography>
                              </div>
                            </div>
                          )}
                        </Grid>
                        {feeds && feeds.length !== 0 && (
                          <div className={classes.loadMoreButtonDivDashboard}>
                            {" "}
                            {page_limit === 20 || pages === 1 ? (
                              <CustomButton onClick={addTopPostProfileId}>
                                Show all
                              </CustomButton>
                            ) : (
                              <CustomButton onClick={changePageLimit}>
                                Load more posts
                              </CustomButton>
                            )}{" "}
                          </div>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Typography align="center">No records found</Typography>
              )}
            </Container>
          )}
        </div>
      </div>
      {showDownloadToast && (
        <SnackBarDownload message={"Your download should begin in a moment"} />
      )}
    </Layout>
  );
};

export default withRouter(DashboardPage);
