import { useEffect } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { SnackBar } from "../../Components/SnackBar/SnackBar";
import { SnackBarDownload } from "../../Components/SnackBar/DownloadSnackBar";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
  Checkbox,
  Container,
} from "@mui/material";
import Layout from "../../Components/Layout";
import { useSelector, useDispatch } from "react-redux";
import SocialButton from "../../Components/SocialButton";
import { SocialMediaCardLabels } from "../../Components/SocialMediaLabelsCard/SocialMediaLabelsCard";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PeopleIcon from "@mui/icons-material/People";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import SocialMediaPostsCard from "../../Components/SocialMediaPostsCard/SocialMediaPostsCard";
import {
  getAddedProfileList,
  getSocialProfileFanGrowth,
  getInteractions,
  getPostTypeDistributions,
  getSocialProfileBasic,
  getSocialProfileComments,
  getSocialProfileShares,
  getSocialProfileTopPost,
  getSocialProfilelikes,
  getSocialProfileGrowthFollowers,
  getMoreSocialProfileTopPost,
  getSocialProfileInteractionAbsoluteGrowth,
} from "../../store/actions/SocialMediaProfileAction";
import FilterDays from "../../Components/FilterDays";
import { CustomButton } from "../../Components/CustomButton/CustomButton";

import BarChart from "../../Components/BarChart";
import LineChart from "../../Components/LineChart";
import Spinner from "../../Components/Spinner";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import { formatImage, numbersFormat } from "utils/functions.js";
import domtoimage from "dom-to-image";
import DownloadButton from "../../Components/DownloadButton/DownloadButton";
import { ProfileOverviewDataExport } from "./ProfileOverviewDataExport";
import { PDFlogo, PNGlogo, XLSXlogo } from "../../Components/logosandicons";
import { withRouter } from "react-router-dom";
import ProfileOverViewPDF from "./ProfileOverViewPDF";
import { ColorPicker } from "../../Components/ColorPicker/ColorPicker";
import { CustomSelectDropdown } from "../../Components/CustomSelectDropdown/CustomSelectDropdown";
import { CustomCheckSelectDropdown } from "../../Components/CustomCheckSelectDropdown/CustomCheckSelectDropdown";
import { Styles } from "./Styles";
import { NO_DATA_AVAILABLE } from "../../utils/constant";
import { createUserReportDownloadActivity } from "../../store/actions/UserActivityAction";

const useStyles = makeStyles((theme) => Styles(theme));

const StyledSelect = withStyles({
  root: {
    padding: 8,
    border: "1px solid #BDBDBD",
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
    fontWeight: 600,
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

const ProfileOverview = ({ history }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const [selectProfile, setSelectProfile] = React.useState([]);
  const [pdf1, setPdf1] = React.useState("");
  const [pdf2, setPdf2] = React.useState("");
  const [pdf3, setPdf3] = React.useState("");
  const [pdf4, setpdf4] = React.useState("");
  const [topPostData, setTopPostData] = React.useState([]);
  const [showDownloadToast, setShowDownloadToast] = React.useState(false);
  const [page_limit, setPageLimit] = React.useState(4);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openPost, setOpenPosts] = React.useState(false);
  const [color, setColor] = React.useState("");

  // Fan Growth Chart
  const [fanGrowthData, setFanGrowthData] = React.useState({
    datasets: "",
    labels: "",
  });
  const [fanGrowthSelectedProfiles, setFanGrowthSelectedProfiles] =
    React.useState([]);
  const [fanGrowthDateFilter, setfanGrowthDateFilter] = React.useState("");
  // Fan Growth Chart

  // Interactions Chart
  const [interactionsData, setinteractionsData] = React.useState({
    datasets: "",
    labels: "",
  });
  const [interactionSelectedProfiles, setinteractionSelectedProfiles] =
    React.useState([]);
  const [interactionDateFilter, setinteractionDateFilter] = React.useState("");
  const [interaction1kPerFans, setInteraction1KPerFans] = React.useState(false);
  //Interactions Chart

  // Posts BreakDown Chart
  const [postsBreakdownData, setPostsBreakdownData] = React.useState({
    datasets: "",
    labels: "",
  });
  const [postTypeDateFilter, setPostTypeDateFilter] = React.useState("");
  // Posts BreakDown Chart

  const {
    activeSocialMediaType,
    addedProfileList,
    addedProfileListLoading,
    profileBasic,
    profileBasicLoading,
    profileLikes,
    profileLikesLoading,
    profileComments,
    profileCommentsLoading,
    profileShares,
    profileSharesLoading,
    profileGrowthFollowers,
    profileGrowthFollowersLoading,
    profileTopPost,
    profileTopPostLoading,
    profileAbsInteractionLoading,
    profileAbsInteraction,
    fansGrowth,
    fanGrowthLoader,
    postsData,
    interactionData,
    interactionLoader,
    postBreakDownLoader,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const { user } = useSelector((state) => state.auth);

  let subdomain = user.CustomerSubdomain.subdomain;

  //Multiple post types select

  let postTypes = ["All Types", "Photo", "Video", "Album", "Link", "Status"];
  if (activeSocialMediaType === "instagram") {
    postTypes = ["All Types", "Image", "Video", "Sidecar"];
  }

  const [selectedPostTypes, setSelectedPostTypes] = React.useState(postTypes);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* getting added profile list on component did mount */
  React.useEffect(() => {
    setSelectedPostTypes(postTypes);
    setSelectProfile([]);
    dispatch(getAddedProfileList());
  }, [activeSocialMediaType]);

  /* setting initial value for selecting profiles */
  React.useEffect(() => {
    if (addedProfileList && addedProfileList.length !== 0) {
      if (history.location.state) {
        setSelectProfile(history.location.state);
      } else {
        setSelectProfile(addedProfileList[0].id);
      }
    }
  }, [addedProfileList, history]);

  const getPostTypeQuery = (postTypes) => {
    let postTypeQuery = "";
    if (postTypes.length > 0) {
      postTypeQuery = postTypes
        .filter((selectedPost) => selectedPost !== "All Types")
        .map((sp) =>
          activeSocialMediaType === "facebook" ? sp.toLowerCase() : sp
        )
        .join(",");
    }

    return postTypeQuery;
  };

  //For updating array of selected Posts

  const updateSelectedPosts = (value, checked) => {
    setOpenPosts(true);

    let updatedPostTypes;
    if (value === "All Types") {
      updatedPostTypes = checked ? postTypes : [];
    } else {
      const postTypesWithoutAll = postTypes.filter(
        (selectedPost) => selectedPost !== "All Types"
      );
      const selectedPostTypesWithoutAll = selectedPostTypes.filter(
        (selectedPost) => selectedPost !== "All Types"
      );

      updatedPostTypes = checked
        ? [...selectedPostTypesWithoutAll, value]
        : selectedPostTypesWithoutAll.filter(
            (selectedPost) => selectedPost !== value
          );

      if (postTypesWithoutAll.length === updatedPostTypes.length) {
        updatedPostTypes = [...updatedPostTypes, "All Types"];
      }
    }

    setSelectedPostTypes(updatedPostTypes);
    dispatch(
      getSocialProfileTopPost(
        selectProfile,
        page_limit,
        currentPage,
        getPostTypeQuery(updatedPostTypes)
      )
    );
  };

  // -------------------------------------------

  const { feeds, pages } = profileTopPost ? profileTopPost : "";
  // check connection

  useEffect(() => {
    var condition = navigator.onLine ? "online" : "offline";

    if (condition === "offline") {
      toast.error("No internet connection");
    }
  }, [customDateRangeRed, selectProfile, activeSocialMediaType]);

  //Top Posts limit and page

  //Resetting page limit to 4 after profile change

  React.useEffect(() => {
    setPageLimit(4);
  }, [selectProfile]);

  useEffect(() => {
    /* dispatching actions */
    // dispatch(getProfileOverView(selectProfile, topFilterData, fanGrowthDateFilter, postTypeDateFilter, interactionDateFilter))
    if (
      selectProfile &&
      selectProfile.length !== 0 &&
      activeSocialMediaType &&
      customDateRangeRed
    ) {
      dispatch(getSocialProfileBasic(selectProfile));
      dispatch(getSocialProfilelikes(selectProfile));
      dispatch(getSocialProfileComments(selectProfile));
      dispatch(getSocialProfileShares(selectProfile));
      dispatch(
        getSocialProfileTopPost(
          selectProfile,
          page_limit,
          currentPage,
          getPostTypeQuery(selectedPostTypes)
        )
      );
      dispatch(getSocialProfileGrowthFollowers(selectProfile));
      dispatch(getSocialProfileInteractionAbsoluteGrowth(selectProfile));
    }
  }, [selectProfile, customDateRangeRed]);

  const selectProfileHandleChange = (e) => {
    setSelectProfile(e.target.value);
  };

  // Fan Growth Chart
  const fanGrowthChart = (selectedProfiles, dateFilter) => {
    setFanGrowthSelectedProfiles(selectedProfiles);
    setfanGrowthDateFilter(dateFilter);
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (selectProfile && fanGrowthDateFilter && customDateRangeRed) {
      dispatch(getSocialProfileFanGrowth(selectProfile, fanGrowthDateFilter));
    }
  }, [selectProfile, fanGrowthDateFilter, customDateRangeRed, color]);
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
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (
      selectProfile &&
      interactionDateFilter &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      dispatch(
        getInteractions(
          selectProfile,
          interactionDateFilter,
          interaction1kPerFans
        )
      );
    }
  }, [
    selectProfile,
    interactionDateFilter,
    customDateRangeRed,
    interaction1kPerFans,
    color,
  ]);
  // Interaction Chart

  // Post Type Graph
  const postTypeChart = (selectedProfiles, postDateFilter) => {
    setPostTypeDateFilter(postDateFilter);
  };

  React.useEffect(() => {
    if (postsData) {
      const postDataOrdering = postsData.datasets ? postsData.datasets : [];

      // for (var i = 0; i < postDataOrdering.length; i++) {
      //   var sum = postDataOrdering[i].data.reduce(function (a, b) {
      //     return a + b;
      //   }, 0);

      //   postDataOrdering[i]["sum"] = sum;
      // }

      // function compare(a, b) {
      //   const bandA = a.sum;
      //   const bandB = b.sum;

      //   let comparison = 0;
      //   if (bandA > bandB) {
      //     comparison = 1;
      //   } else if (bandA < bandB) {
      //     comparison = -1;
      //   }
      //   return comparison;
      // }

      // postDataOrdering.sort(compare);

      // Background Opacity Function
      // var opacity = 1;

      // for (var x = 0; x < postDataOrdering.length; x++) {
      //   const newData = postDataOrdering[x].backgroundColor.replace(
      //     /[\d\.]+\)$/g,
      //     `${opacity})`
      //   );
      //   postDataOrdering[x].backgroundColor = newData;

      //   if (opacity > 0.2) {
      //     var opacity = opacity - 0.2;
      //     var opacity = Math.round(opacity * 10) / 10;
      //   }
      // }
      // Background Opacity Function

      setPostsBreakdownData({
        datasets: postDataOrdering,
        labels:
          postsData && postsData.timeline
            ? postsData.timeline.map(
                (date) =>
                  `${new Date(date.end).toDateString().split(" ")[1]} ${
                    new Date(date.end).toDateString().split(" ")[2]
                  }`
              )
            : [],
        timeline: postsData && postsData.timeline,
      });
    }
  }, [postsData]);

  React.useEffect(() => {
    if (
      selectProfile &&
      postTypeDateFilter &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      dispatch(getPostTypeDistributions(selectProfile, postTypeDateFilter));
    }
  }, [selectProfile, postTypeDateFilter, customDateRangeRed]);
  // Post Type Graph

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

  // displaying weather the profiles data are being downloaded
  const addedPageList = addedProfileList.filter(
    (data) => data.is_data_downloading === true
  );
  const downloadingPageList = addedPageList.find(
    (data) => data.id === selectProfile
  );

  //fucntion to convert canvas to base64 dataUrl
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      if (file.length) {
        // alert("the file has array")
        const mapData = file.map((data) => data.toDataURL("image/jpg", 1.0));
        resolve(mapData);
      } else {
        const mapData1 = file.toDataURL("image/jpg", 1.0);
        resolve(mapData1);
      }
    });
  }

  //Function to take screenshot of a webpage and download it.
  function screenshotPage() {
    //send download activity report function
    createUserDownloadActivity("screenshot");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);
    var wrapper = document.querySelector(".profileOverViewPage");

    domtoimage.toBlob(wrapper, { bgcolor: "#ffffff" }).then(function (blob) {
      saveAs(
        blob,
        `${profileBasic.page_name} ${activeSocialMediaType}-overview.png`
      );
    });
  }

  //--------------------------------------------------------------------------

  //function to handle div into canvas and  image

  // function htmlToCanvasMultiple(files){
  //   var cardArr = Array.prototype.slice.call(files)
  //   return new Promise((resolve, reject) => {
  //     if (cardArr.length > 0) {
  //       // alert("the file has array")
  //       const mapData = cardArr.map((data) => html2canvas(data).then(canvas => canvas.toDataURL("image/jpg",  1.0) ) );
  //       resolve(mapData);
  //     } else {
  //       console.log('No top')
  //     }
  //   });
  // }

  useEffect(() => {
    setpdf4("");
    var file = document.querySelector("#interaction");
    var file2 = document.querySelector("#totalFollowers");
    var file3 = document.querySelector("#contentBreakdown");
    setTimeout(() => {
      var socialPostCard = document.getElementsByClassName("post-card");
      var cardArr = Array.prototype.slice.call(socialPostCard);
      const mapData = cardArr.map((data) =>
        html2canvas(data, {
          allowTaint: false,
          useCORS: true,
          scrollY: -window.scrollY,
        }).then((canvas) => canvas.toDataURL("image/png", 1.0))
      );
      setTopPostData(mapData);
    }, 1000);

    setTimeout(() => {
      if (file) {
        getBase64(file).then((data) => setPdf1(data));
      }
    }, 3000);

    setTimeout(() => {
      if (file2) {
        getBase64(file2).then((data) => setPdf2(data));
      }
    }, 3000);

    setTimeout(() => {
      if (file3) {
        getBase64(file3).then((data) => setPdf3(data));
      }
    }, 3000);
  }, [
    selectProfile,
    interactionDateFilter,
    fanGrowthDateFilter,
    postTypeDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
    postsData,
  ]);

  //Resetting page limit to 4 after profile change

  React.useEffect(() => {
    setPageLimit(4);
  }, [selectProfile]);

  //For top posts

  useEffect(async () => {
    const data = await Promise.all(topPostData);
    if (data.length > 0) {
      setpdf4(data);
    }
  }, [topPostData]);

  // Top Posts Load More
  React.useEffect(() => {
    if (selectProfile && customDateRangeRed && activeSocialMediaType) {
      dispatch(
        getMoreSocialProfileTopPost(
          selectProfile,
          page_limit,
          currentPage,
          getPostTypeQuery(selectedPostTypes)
        )
      );
    }
  }, [page_limit]);

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

  //send download activity report
  const createUserDownloadActivity = (type) => {
    let profilesForActivityReport = [];
    if (selectProfile) {
      profilesForActivityReport = addedProfileList
        .filter((d) => d.id === selectProfile)
        .map((d) => d.name);
    }
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
      <ProfileOverViewPDF
        profileBasic={profileBasic}
        profileLikes={profileLikes}
        profileComments={profileComments}
        profileShares={profileShares}
        profileGrowthFollowers={profileGrowthFollowers}
        pdf1={pdf1}
        pdf2={pdf2}
        pdf3={pdf3}
        feeds={feeds}
        activeSocialMediaType={activeSocialMediaType}
        interactionDateFilter={interactionDateFilter}
        fanGrowthDateFilter={fanGrowthDateFilter}
        postTypeDateFilter={postTypeDateFilter}
        user={user}
        profileAbsInteraction={profileAbsInteraction}
        customDateRangeRed={customDateRangeRed}
      />
    ).toBlob();
    saveAs(
      blob,
      `${profileBasic.page_name}-${activeSocialMediaType}-overview.pdf`
    );
  };

  const handlePostsOpen = () => {
    setOpenPosts(true);
  };

  const handlePostsClose = () => {
    setOpenPosts(false);
  };

  const classes = useStyles({ xs, profileOverview: true, md });

  return (
    <Layout>
      <div className={classes.profileOverview}>
        <Container disableGutters maxWidth="xl">
          <Grid container className={classes.row}>
            <div className={classes.tabHeaderComp}>
              <div
                style={{
                  display: "flex",
                  flexDirection: xs ? "row-reverse" : "row",
                  justifyContent: xs ? "space-between" : "flex-end",
                }}
              >
                <CustomSelectDropdown
                  addedProfileList={addedProfileList}
                  selectProfileHandleChange={selectProfileHandleChange}
                  activeSocialMediaType={activeSocialMediaType}
                  selectProfile={selectProfile}
                  subdomain={subdomain}
                />

                {!md ? <hr className={classes.lineStyle}></hr> : ""}
                <SocialButton />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: xs ? 10 : 0,
                  justifyContent: xs ? "space-between" : "start",
                  flexDirection: xs ? "row-reverse" : "row",
                }}
              >
                <FilterDays xs={xs} />

                <DownloadButton>
                  <StyledMenuItem onClick={() => generatePdfDocument()}>
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
                    <ProfileOverviewDataExport
                      xlsxLogo={XLSXlogo}
                      showDownloadSnackBar={setShowDownloadToast}
                      timeRange={customDateRangeRed}
                      profileBasic={profileBasic}
                      interaction1kPerFans={interaction1kPerFans}
                      interactionDateFilter={interactionDateFilter}
                      fanGrowthDateFilter={fanGrowthDateFilter}
                      postTypeDateFilter={postTypeDateFilter}
                      onClick={() => {
                        //send download activity report function
                        createUserDownloadActivity("excel");
                      }}
                    />{" "}
                  </StyledMenuItem>
                </DownloadButton>
              </div>
            </div>
            <div className="profileOverViewPage">
              <Grid container>
                <PageTitle />
                {addedProfileListLoading ? (
                  <Spinner />
                ) : selectProfile && selectProfile.length !== 0 ? (
                  <div>
                    <Card
                      className={classes.profileOverviewCard}
                      variant="outlined"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: profileBasicLoading
                            ? "center"
                            : "flex-start",
                        }}
                      >
                        {profileBasicLoading && <Spinner />}
                        {selectProfile &&
                          selectProfile.length !== 0 &&
                          !profileBasicLoading &&
                          profileBasic && (
                            <>
                              <CardMedia>
                                <Link
                                  to={{ pathname: profileBasic.page_url }}
                                  target="_blank"
                                >
                                  <Avatar
                                    alt="profileImage"
                                    src={
                                      profileBasic && !profileBasicLoading
                                        ? formatImage(
                                            activeSocialMediaType,
                                            subdomain,
                                            profileBasic.page_picture
                                          )
                                        : null
                                    }
                                    style={{
                                      width: xs ? "70px" : "140px",
                                      height: xs ? "70px" : "140px",
                                      border: "1px solid #E0E0E0",
                                    }}
                                  />
                                </Link>
                              </CardMedia>
                              <CardContent
                                id="profile-basic-overview-content"
                                className={classes.profileOverviewCardContent}
                              >
                                <div>
                                  <div className={classes.profileOverviewBasic}>
                                    <Link
                                      style={{
                                        textDecoration: "none",
                                        color: "#000",
                                      }}
                                      to={{ pathname: profileBasic.page_url }}
                                      target="_blank"
                                    >
                                      <Typography
                                        variant="h5"
                                        component="h2"
                                        style={{
                                          fontSize: xs ? 18 : 24,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {!profileBasicLoading && profileBasic
                                          ? profileBasic.page_name
                                          : "Profile Name"}
                                      </Typography>
                                    </Link>
                                    <ColorPicker
                                      selectProfile={selectProfile}
                                      getColors={(color) => {
                                        setColor(color);
                                      }}
                                    />
                                  </div>
                                  <Typography style={{ fontSize: 15 }}>
                                    {profileBasic &&
                                      profileBasic.social_page_id}
                                  </Typography>
                                </div>
                                <div
                                  className="profileBasicContent"
                                  style={{
                                    display: "flex",
                                    marginTop: 25,
                                    position: "relative",
                                    left:
                                      activeSocialMediaType === "instagram" &&
                                      xs
                                        ? "-10%"
                                        : "0px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: xs ? 10 : 100,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{
                                        fontSize: xs ? 16 : 24,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {!profileBasicLoading && profileBasic
                                        ? numbersFormat(
                                            profileBasic.total_feeds_count
                                          )
                                        : 0}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{ fontSize: 15, marginLeft: 10 }}
                                    >
                                      Posts
                                    </Typography>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight:
                                        activeSocialMediaType === "instagram" &&
                                        xs
                                          ? "10px"
                                          : xs
                                          ? 10
                                          : 100,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{
                                        fontSize: xs ? 16 : 24,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {!profileBasicLoading && profileBasic
                                        ? numbersFormat(
                                            profileBasic.page_fan_count
                                          )
                                        : 0}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{ fontSize: 15, marginLeft: 10 }}
                                    >
                                      Followers
                                    </Typography>
                                  </div>
                                  {activeSocialMediaType == "instagram" && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginRight: 0,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        component="p"
                                        style={{
                                          fontSize: xs ? 16 : 24,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {!profileBasicLoading && profileBasic
                                          ? profileBasic.page_following
                                          : 0}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        component="p"
                                        style={{ fontSize: 15, marginLeft: 10 }}
                                      >
                                        Following
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </>
                          )}
                      </div>
                    </Card>
                    <div id="card-labels" className={classes.cardlabels}>
                      <Grid container spacing={3}>
                        <Grid className={classes.cardlabelsWrapper}>
                          <div className="likesCard">
                            <SocialMediaCardLabels
                              filterType={
                                profileLikes &&
                                !profileLikesLoading &&
                                profileLikes.filter_type
                              }
                              cardTitle="Likes"
                              cardFigures={
                                profileLikes &&
                                !profileLikesLoading &&
                                profileLikes.total_likes_count
                              }
                              cardGrowthRate={
                                profileLikes &&
                                !profileLikesLoading &&
                                profileLikes.growth
                              }
                              colorCode="rgba(255, 52, 52, 0.1)"
                              cardIcon={
                                <FavoriteOutlinedIcon
                                  style={{ fontSize: 24, color: "#FF3434" }}
                                />
                              }
                              loading={profileLikesLoading}
                            />
                          </div>
                        </Grid>
                        <Grid className={classes.cardlabelsWrapper}>
                          <div className="commentsCard">
                            <SocialMediaCardLabels
                              filterType={
                                profileComments &&
                                !profileCommentsLoading &&
                                profileComments.filter_type
                              }
                              cardTitle="Comments"
                              cardFigures={
                                profileComments &&
                                !profileCommentsLoading &&
                                profileComments.total_comments_count
                              }
                              cardGrowthRate={
                                profileComments &&
                                !profileCommentsLoading &&
                                profileComments.growth
                              }
                              colorCode="rgba(11, 102, 112, 0.1)"
                              cardIcon={
                                <CommentOutlinedIcon
                                  style={{ fontSize: 24, color: "#0B6670" }}
                                />
                              }
                              loading={profileCommentsLoading}
                            />
                          </div>
                        </Grid>
                        {activeSocialMediaType === "facebook" ? (
                          <Grid className={classes.cardlabelsWrapper}>
                            <div className="shareCard">
                              <SocialMediaCardLabels
                                filterType={
                                  profileShares &&
                                  !profileSharesLoading &&
                                  profileShares.filter_type
                                }
                                cardTitle="Share"
                                cardFigures={
                                  profileShares &&
                                  !profileSharesLoading &&
                                  profileShares.total_shares_count
                                }
                                cardGrowthRate={
                                  profileShares &&
                                  !profileSharesLoading &&
                                  profileShares.growth
                                }
                                colorCode="rgba(248, 193, 68, 0.2)"
                                cardIcon={
                                  <ReplySharpIcon
                                    style={{ fontSize: 24, color: "#F8C144" }}
                                  />
                                }
                                loading={profileSharesLoading}
                              />
                            </div>
                          </Grid>
                        ) : null}
                        {/* <Grid  className={classes.cardlabelsWrapper} >
              <SocialMediaCardLabels
                cardTitle="Reach"
                cardFigures="0"
                cardGrowthRate="0"
                colorCode="rgba(255, 52, 52, 0.1)"
                cardIcon={
                  <FlagIcon style={{ fontSize: 24, color: "#FF3434" }} />
                }
              />
            </Grid>
            <Grid  className={classes.cardlabelsWrapper}>
              <SocialMediaCardLabels
                cardTitle="Impression"
                cardFigures="0"
                cardGrowthRate="0"
                colorCode="rgba(248, 193, 68, 0.2)"
                cardIcon={
                  <VisibilityIcon style={{ fontSize: 24, color: "#F8C144" }} />
                }
              />
            </Grid> */}
                        <Grid className={classes.cardlabelsWrapper}>
                          <div className="followersCard">
                            <SocialMediaCardLabels
                              cardTitle="Followers"
                              filterType={
                                profileGrowthFollowers &&
                                !profileGrowthFollowersLoading &&
                                profileGrowthFollowers.filter_type
                              }
                              cardGrowthRate={
                                profileGrowthFollowers &&
                                !profileGrowthFollowersLoading &&
                                profileGrowthFollowers.absolute_growth
                              }
                              colorCode="rgba(164, 39, 255, 0.1)"
                              cardIcon={
                                <PeopleIcon
                                  style={{ fontSize: 24, color: "#A427FF" }}
                                />
                              }
                              cardFigures={
                                profileGrowthFollowers &&
                                !profileGrowthFollowersLoading &&
                                profileGrowthFollowers.followers_growth
                                  ? profileGrowthFollowers.followers_growth
                                  : "0"
                              }
                              loading={profileSharesLoading}
                            />
                          </div>
                        </Grid>
                        <Grid className={classes.cardlabelsWrapper}>
                          <div className="growthOfFollowersCard">
                            <SocialMediaCardLabels
                              filterType={
                                profileAbsInteraction &&
                                !profileAbsInteractionLoading &&
                                profileAbsInteraction.filter_type
                              }
                              cardTitle="Interactions"
                              cardFigures={
                                profileAbsInteraction &&
                                !profileAbsInteractionLoading &&
                                profileAbsInteraction.total_interaction_count
                                  ? profileAbsInteraction.total_interaction_count
                                  : "0"
                              }
                              cardGrowthRate={
                                profileAbsInteraction &&
                                !profileAbsInteractionLoading &&
                                profileAbsInteraction.growth
                              }
                              colorCode="rgba(11, 102, 112, 0.1)"
                              cardIcon={
                                <GroupAddIcon
                                  style={{ fontSize: 24, color: "#1877f2" }}
                                />
                              }
                              loading={profileAbsInteractionLoading}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    <div className={classes.chartWrapper}>
                      <Grid className={classes.charts} container spacing={3}>
                        <Grid
                          className={classes.growthChart}
                          item
                          xs={12}
                          lg={6}
                        >
                          {addedProfileList.length != 0 ? (
                            <div>
                              <BarChart
                                chartId="totalFollowers"
                                chartTitle="Follower growth"
                                graphTitle="Fan growth"
                                showLabel="false"
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
                                  Total Followers
                                </Typography>
                              </div>

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

                        <Grid
                          className={classes.growthChart}
                          item
                          xs={12}
                          lg={6}
                        >
                          {addedProfileList.length != 0 ? (
                            <div id="interactionChart">
                              <BarChart
                                chartId="interaction"
                                chartTitle="Interactions"
                                graphTitle="Interactions"
                                showLabel="false"
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

                        <Grid
                          className={classes.growthChart}
                          item
                          xs={12}
                          lg={12}
                        >
                          {postBreakDownLoader && (
                            <Spinner className={classes.loader} />
                          )}
                          {addedProfileList.length != 0 ? (
                            <div style={{ marginTop: 45 }}>
                              {/* <LineChart
                                chartId="contentBreakdown"
                                chartTitle="Published posts content breakdown"
                                graphTitle="Posts "
                                adddeSocialMedaiProfile={addedProfileList}
                                chartData={postsBreakdownData}
                                getPostsData={(
                                  selectProfiles,
                                  postDateFilter
                                ) => {
                                  postTypeChart(selectProfiles, postDateFilter);
                                }}
                              /> */}
                              <BarChart
                                chartId="contentBreakdown"
                                chartTitle="Published posts content breakdown"
                                graphTitle="Posts"
                                showLabel="false"
                                showPeriod={true}
                                adddeSocialMedaiProfile={addedProfileList}
                                chartData={postsBreakdownData}
                                getSelectedProfile={(
                                  selectProfiles,
                                  postDateFilter
                                ) => {
                                  postTypeChart(selectProfiles, postDateFilter);
                                }}
                                noDecimalPoint
                                height={"75px"}
                              />
                            </div>
                          ) : (
                            <div className={classes.chartFallBackContainer}>
                              <div className={classes.graphTitleSection}>
                                <Typography
                                  className={classes.graphTitle}
                                  variant="h5"
                                >
                                  Published Posts content breakdown
                                </Typography>
                              </div>

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
                      </Grid>
                    </div>

                    <div id="top-posts-div" className={classes.topPost}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 20,
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: xs ? 14 : 22,
                            fontWeight: 600,
                          }}
                        >
                          Top posts
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <CustomCheckSelectDropdown
                            selectedPostTypes={selectedPostTypes}
                            handlePostsClose={handlePostsClose}
                            handlePostsOpen={handlePostsOpen}
                            openPost={openPost}
                            postTypes={postTypes}
                            updateSelectedPosts={updateSelectedPosts}
                          />
                        </div>
                      </div>

                      <Grid container spacing={3}>
                        {profileTopPostLoading ? (
                          <div
                            className={classes.chartFallBackContainer}
                            style={{
                              width: "100%",
                              position: "relative",
                              margin: "10px 10px",
                            }}
                          >
                            <div className={classes.chartFallBack}>
                              <Spinner />
                            </div>
                          </div>
                        ) : selectedPostTypes.length === 0 ? (
                          <div
                            className={classes.chartFallBackContainer}
                            style={{ width: "100%", margin: "0px 10px" }}
                          >
                            <div className={classes.chartFallBack}>
                              <Typography
                                className={classes.noData}
                                variant="h6"
                              >
                                Select at least one post types to show posts.
                              </Typography>
                            </div>
                          </div>
                        ) : feeds && feeds.length !== 0 ? (
                          feeds.map((topPost, index) => (
                            <Grid item xs={12} md={6} lg={3} xl={3}>
                              <SocialMediaPostsCard
                                pageId={topPost.profile_info.social_page_id}
                                pageName={topPost.profile_info.page_name}
                                pagePicture={topPost.profile_info.page_picture}
                                topPostData={topPost}
                                totalPageLikes={
                                  topPost.profile_info.page_fan_count
                                }
                              />
                            </Grid>
                          ))
                        ) : (
                          <div
                            className={classes.chartFallBackContainer}
                            style={{ width: "100%", margin: "10px 10px" }}
                          >
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
                  </div>
                ) : (
                  !addedProfileListLoading &&
                  addedProfileList &&
                  addedProfileList.length === 0 && (
                    <Typography align="center" style={{ margin: "0 auto" }}>
                      {" "}
                      No records found{" "}
                    </Typography>
                  )
                )}
              </Grid>
            </div>
          </Grid>
        </Container>
      </div>
      {!profileBasicLoading &&
        !profileLikesLoading &&
        !profileCommentsLoading &&
        !profileSharesLoading &&
        !fanGrowthLoader &&
        !interactionLoader &&
        !postBreakDownLoader &&
        downloadingPageList && (
          <SnackBar
            data={addedProfileList}
            message={"Profile data is downloading"}
          />
        )}
      {showDownloadToast && (
        <SnackBarDownload message={"Your download should begin in a moment"} />
      )}
    </Layout>
  );
};

export default withRouter(ProfileOverview);
