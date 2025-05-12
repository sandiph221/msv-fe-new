import { useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  makeStyles,
  InputAdornment,
  Card,
  CardMedia,
  Avatar,
  Typography,
  CardContent,
  CardActionArea,
  withStyles,
  useTheme,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { saveAs } from "file-saver";
import Layout from "../../Components/Layout";
import styles from "./Styles";
import FilterDays from "../../Components/FilterDays";
import SocialButton from "../../Components/SocialButton";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { Link } from "react-router-dom";
import BarChart from "../../Components/BarChart";
import PieChart from "../../Components/PieChart";
import {
  getInteractions,
  getSocialProfileFanGrowth,
  getInteractionDistrbutions,
  getPostTypeDistributionsMultiple,
  deleteSelectProfilesToCompare,
  getAddedProfileList,
  selectProfilesToComapre,
  getContentNewsFeed,
  loadMoreContentNewsFeed,
} from "../../store/actions/SocialMediaProfileAction";
import Spinner from "../../Components/Spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MessageIcon from "@mui/icons-material/Message";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddProfileComaprisonModal from "../../Components/AddProfileComparisonModal/AddProfileComparisonModal";
import {
  Document,
  Font,
  Image,
  Page,
  pdf,
  PDFDownloadLink,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import GetAppIcon from "@mui/icons-material/GetApp";
import defaultLogo from "../../assets/images/msvfooterLogo.png";
import likeReaction from "../../assets/images/likeReaction.png";
import commentReaction from "../../assets/images/commentReaction.png";
import shareReaction from "../../assets/images/shareReaction.png";
import {
  formatImage,
  formatNumber,
  numbersFormat,
} from "../../utils/functions";
import PoppinsFont from "../../assets/fonts/Poppins-Medium.ttf";
import domtoimage from "dom-to-image";
import ComparisonDataExport from "./ComparisonDataExport";
import SocialMediaPostsCard from "../../Components/SocialMediaPostsCard/SocialMediaPostsCard";
import { MenuItem } from "@mui/material";
import DownloadButton from "../../Components/DownloadButton/DownloadButton";
import { SnackBarDownload } from "../../Components/SnackBar/DownloadSnackBar";
import { PDFlogo, PNGlogo, XLSXlogo } from "../../Components/logosandicons";
import AbsoluteGrowthCard from "../../Components/AbsoluteGrowthCard/AbsoluteGrowthCard";
import { withRouter } from "react-router-dom";
import { NO_DATA_AVAILABLE } from "../../utils/constant";
import { CustomButton } from "../../Components/CustomButton/CustomButton";
import { createUserReportDownloadActivity } from "../../store/actions/UserActivityAction";
import { PdfTopPostComponent } from "../DashboardPage/PdfComponent/PdfTopPostComponent";
import FacebookRoundLogo from "../../assets/images/facebook.png";
import InstagramLogo from "../../assets/images/instagram.png";

const useStyles = makeStyles((theme) => styles(theme));

const StyleCard = withStyles({
  root: {
    boxShadow: "none",
    "& .cardRemovebtn": {
      display: "none",
      cursor: "pointer",
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#ffff",
      borderRadius: "50%",
    },
    "&:hover": {
      backgroundColor: "#FFF2F2",
      border: "1px solid #FF3434 !important",
    },
    "&:hover .cardRemovebtn": {
      display: "flex",
    },
  },
})(Card); //card  custom style

const StyleCardAddprofile = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#FFF8DE !important",
    },
  },
})(Card); //card add profile button  custom style

const StyledSelect = withStyles({
  root: {
    padding: 8,
    border: "1px solid #BDBDBD",
    height: "24px",
  },
})(Select);

//Registering font for PDF

Font.register({ family: "Poppins", src: PoppinsFont });

const StyledMenuItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#FFF8DE",
    },
  },
})(MenuItem);

const ComparisonPage = ({ history }) => {
  const [mobileView, setMobileView] = React.useState(false);

  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setMobileView((prevState) => ({ ...prevState, mobileView: true }))
        : setMobileView((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const [pdf1, setPdf1] = React.useState("");
  const [pdf2, setPdf2] = React.useState("");
  const [pdf3, setPdf3] = React.useState("");
  const [pdf4, setPdf4] = React.useState([]);
  const [pieData, setPieData] = React.useState([]);
  const [pieDataTotal, setPieDataTotal] = React.useState({});
  const [showDownloadToast, setShowDownloadToast] = React.useState(false);
  const classes = useStyles({ xs });
  const dispatch = useDispatch();
  const {
    selectedProfilesListToComapre,
    interactionData,
    interactionLoader,
    fansGrowth,
    fanGrowthLoader,
    interactionDistributions,
    interactionDistributionsLoader,
    postsDataMultiple,
    multiplePostBreakDownLoader,
    activeSocialMediaType,
    customDateRangeRed,
    contentNewsFeedLoading,
    contentNewsFeed,
    addedProfileList,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const { user } = useSelector((state) => state.auth);

  let subdomain = user.CustomerSubdomain.subdomain;
  const { feeds, pages } = contentNewsFeed ? contentNewsFeed : "";

  // Interactions Chart

  const [interactionsData, setinteractionsData] = React.useState({
    datasets: "",
    labels: "",
  });

  // Fan Growth Chart
  const [fanGrowthData, setFanGrowthData] = React.useState({
    datasets: "",
    labels: "",
  });
  const [fanGrowthSelectedProfiles, setFanGrowthSelectedProfiles] =
    React.useState();

  const [fanGrowthDateFilter, setfanGrowthDateFilter] = React.useState();
  // Fan Growth Chart
  const [interactionSelectedProfiles, setinteractionSelectedProfiles] =
    React.useState();
  const [interactionDateFilter, setinteractionDateFilter] = React.useState();
  const [interaction1kPerFans, setInteraction1KPerFans] = React.useState();
  //Interactions Chart

  // Posts BreakDown Chart
  const [postsBreakdownDataMultiple, setPostsBreakdownDataMultiple] =
    React.useState({
      datasets: "",
      labels: "",
    });
  const [
    postsBreakdownDataMultipleSelectedProfiles,
    setPostsBreakdownDataMultipleSelectedProfiles,
  ] = React.useState();

  // Posts BreakDown Chart

  const comparisonSelectedDataId = selectedProfilesListToComapre.map(
    (profiles) => profiles.id
  );

  let selectedData;

  selectedData = addedProfileList.filter((addedList) =>
    comparisonSelectedDataId.includes(addedList.id)
  );

  React.useEffect(() => {
    if (customDateRangeRed) {
      dispatch(getAddedProfileList());
      // dispatch(selectProfilesToComapre(selectedProfilesListToComapre))
    }
  }, [customDateRangeRed]);

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
    if (
      selectedProfilesListToComapre &&
      fanGrowthDateFilter &&
      customDateRangeRed
    ) {
      dispatch(
        getSocialProfileFanGrowth(comparisonSelectedDataId, fanGrowthDateFilter)
      );
    }
  }, [selectedProfilesListToComapre, fanGrowthDateFilter, customDateRangeRed]);
  // Fan Growth Chart

  React.useEffect(() => {
    if (
      selectedProfilesListToComapre &&
      interactionDateFilter &&
      customDateRangeRed
    ) {
      dispatch(
        getInteractions(
          comparisonSelectedDataId,
          interactionDateFilter,
          interaction1kPerFans
        )
      );
    }
  }, [
    selectedProfilesListToComapre,
    interactionDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
    interaction1kPerFans,
  ]);
  // Interaction Chart

  // Pie Chart

  React.useEffect(() => {
    if (selectedProfilesListToComapre && customDateRangeRed) {
      dispatch(getInteractionDistrbutions(comparisonSelectedDataId));
    }
  }, [
    selectedProfilesListToComapre,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

  // Pie Chart

  //post type distribution multiple profile //
  // Post Type Graph
  const postTypeChart = (selectedProfiles, postDateFilter) => {
    setPostsBreakdownDataMultipleSelectedProfiles(selectedProfiles);
  };

  React.useEffect(() => {
    if (selectedProfilesListToComapre && customDateRangeRed) {
      dispatch(getPostTypeDistributionsMultiple(comparisonSelectedDataId));
    }
  }, [
    selectedProfilesListToComapre,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

  React.useEffect(() => {
    setPostsBreakdownDataMultiple({
      datasets: postsDataMultiple && postsDataMultiple.datasets,
      labels: postsDataMultiple && postsDataMultiple.labels,
    });
  }, [postsDataMultiple]);

  // Post Type Graph

  //handle added profile list delete
  const profileListDelete = (profileId) => {
    dispatch(deleteSelectProfilesToCompare(profileId));
  };

  const getPieTotal = (total) => {
    setPieDataTotal(total);
  };

  //top-post content-newsfeed api pulled
  const [page_limit, setPageLimit] = React.useState(4);
  let postTypes = ["All Types", "Photo", "Video", "Album", "Link", "Status"];
  if (activeSocialMediaType === "instagram") {
    postTypes = ["All Types", "Image", "Video", "Sidecar"];
  }
  let sortOptions = [
    { name: "Most recent", value: "mostrecent" },
    { name: "Top reactions", value: "feed_reaction_count" },
    { name: "Top comments", value: "feed_comment_count" },
    { name: "Top shares", value: "feed_share_count" },
    { name: "Engagements", value: "total_engagement" },
    { name: "Engagements per 1k fans", value: "engagement_per_1k_fans" },
  ];
  if (activeSocialMediaType === "instagram") {
    sortOptions = [
      { name: "Most recent", value: "mostrecent" },
      { name: "Top likes", value: "feed_like_count" },
      { name: "Top comments", value: "feed_comment_count" },
      { name: "Engagements", value: "total_engagement" },
      { name: "Engagements per 1k fans", value: "engagement_per_1k_fans" },
    ];
  }

  const [topPostParams, setTopPostParams] = React.useState({
    searchData: [],
    searchKeyWord: "",
    postTypes: postTypes,
    selectedProfiles: comparisonSelectedDataId,
    currentPage: 1,
    page_limit: page_limit,
    sortType: sortOptions[0].value,
  });

  const selectSortHandleChange = (e) => {
    setTopPostParams({ ...topPostParams, sortType: e.target.value });
  };

  React.useEffect(() => {
    if (selectedProfilesListToComapre && customDateRangeRed && topPostParams) {
      dispatch(getContentNewsFeed(topPostParams));
    }
  }, [selectedProfilesListToComapre, customDateRangeRed, topPostParams]);

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

  React.useEffect(() => {
    if (page_limit && contentNewsFeed) {
      dispatch(loadMoreContentNewsFeed(topPostParams, page_limit));
    }
  }, [page_limit]);

  //For adding top post profile id into reducer

  function addTopPostProfileId() {
    history.push("/content-newsfeed");
  }
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
    autoFocus: false,
  };

  //fucntion to convert canvas to base64 dataUrl

  const itemEls = React.useRef(new Array());
  const selctedProfilesLength = selectedProfilesListToComapre.length;
  useEffect(() => {
    if (
      interactionDistributions &&
      interactionDistributions.length !== 0 &&
      selectedProfilesListToComapre &&
      selectedProfilesListToComapre.length !== 0
    ) {
      itemEls.current = itemEls.current.slice(0, selctedProfilesLength);
      const mapData = itemEls.current.map((item) => item.children[0]);

      const mapData2 = mapData ? mapData.map((item) => item.children[0]) : [];

      const mapData3 =
        mapData2.length !== 0
          ? mapData2.map((item) => item.children.pieChartDistributions)
          : [];
      setTimeout(() => {
        setPieData(mapData3);
      }, 3000);
    }
  }, [interactionDistributions, selectedProfilesListToComapre, itemEls]);

  // const pieReader = pieData[0]

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      if (file.length) {
        const mapData = file.map((data) => data.toDataURL("image/jpg", 1.0));
        resolve(mapData);
      } else {
        const mapData1 = file.toDataURL("image/jpg", 1.0);
        resolve(mapData1);
      }
    });

    // return new Promise((resolve, reject) => {
    //   if (file.length) {
    //     // alert("the file has array")
    //     const mapData = file.map((data) => data.toDataURL("image/jpg",  1.0));
    //     resolve(mapData);
    //   } else {
    //     const mapData1 = file.toDataURL("image/jpg", 1.0);
    //     resolve(mapData1);
    //   }
    // });
  }

  // function to handle canvas to image

  useEffect(async () => {
    var file = document.querySelector("#interaction");
    var file2 = document.querySelector("#totalFans");
    var file3 = document.querySelector("#post");
    var file4 = document.querySelector("#pieChartDistributions");

    // const pieFile = pieData[0]
    // if (pieData.length > 0) {
    //   await getBase64(pieData).then((data) => setPdf4(data));
    //  }
    setTimeout(() => {
      if (file) {
        getBase64(file).then((data) => setPdf1(data));
      }
    }, 4000);

    setTimeout(() => {
      if (file2) {
        getBase64(file2).then((data) => setPdf2(data));
      }
    }, 4000);

    setTimeout(() => {
      if (file3) {
        getBase64(file3).then((data) => setPdf3(data));
      }
    }, 4000);
  }, [
    selectedProfilesListToComapre,
    interactionDateFilter,
    fanGrowthDateFilter,
    customDateRangeRed,
    interactionData,
    fansGrowth,
    postsDataMultiple,
  ]);

  useEffect(async () => {
    if (pieData && pieData.length !== 0) {
      try {
        const filterPieData = pieData.filter((data) => data);
        const getPieData = await getBase64(filterPieData);

        const data = await getPieData;
        setPdf4(data);
      } catch (error) {
        console.log("error", error);
      }
      // getBase64(pieData)
      //   .then((data) => setPdf4(data))
      //   .catch((error) => console.log("error", error));
    }
  }, [pieData]);
  //Function to take screenshot of a webpage and download it.

  function screenshotPage() {
    //send download activity report function
    createUserDownloadActivity("screenshot");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);
    var wrapper = document.querySelector(".ComparisonPageScreenContainer");

    domtoimage.toBlob(wrapper, { bgcolor: "#ffffff" }).then(function (blob) {
      saveAs(blob, `${activeSocialMediaType}-overview.png`);
    });
  }

  // exportables or downloadable component
  const Exportable = () => {
    const stylesPdf = StyleSheet.create({
      page: {
        flexDirection: "column",
        padding: 30,
        fontFamily: "Poppins",
      },
      section: {
        alignSelf: "center",
        marginTop: 20,
      },
      heading: {
        alignSelf: "center",
        marginTop: 130,
        width: "50%",
        textAlign: "center",
        // fontFamily: "Poppins"
      },
      logo: {
        marginTop: 90,
        width: "30%",
        alignSelf: "center",
      },
      date: {
        alignSelf: "center",
        marginTop: 10,
        fontSize: 12,
      },
      profileImg: {
        height: 50,
        width: 50,
        border: "1px solid #D5DDE0",
        borderRadius: 5,
      },
      graph: {
        height: 140,
        marginTop: 20,
      },
      graphSection: {
        marginTop: 10,
      },
      sectionTitle: {
        fontSize: 12,
        fontFamily: "Poppins",
        fontWeight: "bold",
        marginBottom: "5px",
        paddingBottom: 4,
      },
      sectionTopPost: {
        alignSelf: "center",
        marginTop: 20,
        alignItems: "center",
      },
      topPostsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      postsPage: {
        backgroundColor: "#f5f5f5",
        padding: 30,
      },
      tr: {
        display: "flex",
        flexDirection: "row",
      },
      td: {
        display: "flex",
        flexDirection: "row",
        padding: 8,
        // border: "1px solid EBECED",
        fontSize: 8,
        width: "20%",
      },
      socialMainLogo: {
        width: 25,
        height: 25,
        marginRight: 10,
      },
      overviewTitle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins",
        marginTop: 10,
      },
      distributionSec: {
        marginBottom: 15,
        border: `1px solid #D5DDE0`,
        padding: 20,
        paddingBottom: 30,
        "& :last-child": {
          marginBottom: 0,
        },
      },
      metricText: {
        fontSize: 10,
        fontWeight: 400,
        lineHeight: "1.5 px",
        marginBottom: 8,
      },
    });

    return (
      <Document title="My social view">
        <Page wrap={true} size="A4" style={stylesPdf.page}>
          <View wrap={true}>
            <View>
              {activeSocialMediaType === "instagram" ? (
                <View style={stylesPdf.overviewTitle}>
                  <Image style={stylesPdf.socialMainLogo} src={InstagramLogo} />
                  <Text>Comparison Overview</Text>
                </View>
              ) : (
                <View style={stylesPdf.overviewTitle}>
                  <Image
                    style={stylesPdf.socialMainLogo}
                    src={FacebookRoundLogo}
                  />
                  <Text>Comparison Overview</Text>
                </View>
              )}
              <Text style={stylesPdf.date}>
                {" "}
                {`${
                  new Date(customDateRangeRed[0].startDate)
                    .toDateString()
                    .split(" ")[1]
                } ${
                  new Date(customDateRangeRed[0].startDate)
                    .toDateString()
                    .split(" ")[2]
                } ${
                  new Date(customDateRangeRed[0].startDate)
                    .toDateString()
                    .split(" ")[3]
                } - ${
                  new Date(customDateRangeRed[0].endDate)
                    .toDateString()
                    .split(" ")[1]
                } ${
                  new Date(customDateRangeRed[0].endDate)
                    .toDateString()
                    .split(" ")[2]
                } ${
                  new Date(customDateRangeRed[0].endDate)
                    .toDateString()
                    .split(" ")[3]
                }`}
              </Text>
            </View>
            <View style={{ marginTop: 80 }}>
              {selectedProfilesListToComapre.map((profile) => (
                <View
                  key={profile.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 10,
                    borderLeft: `3px solid ${profile.color}`,
                    paddingLeft: 10,
                  }}
                >
                  <Image
                    style={stylesPdf.profileImg}
                    src={formatImage(
                      activeSocialMediaType,
                      subdomain,
                      profile.picture
                    )}
                  />
                  <View style={{ alignSelf: "center", marginLeft: 20 }}>
                    <Text style={{ fontSize: 12 }}>{profile.name} </Text>

                    <Text
                      style={{ fontSize: 8, marginTop: 10, color: "#323134" }}
                    >
                      {profile.username}{" "}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
        <Page wrap={true} size="A4" style={stylesPdf.page}>
          <View
            style={[
              stylesPdf.headerComp,
              {
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
                borderBottom: "1px solid #D5DDE0",
              },
            ]}
            fixed={true}
          >
            {selectedProfilesListToComapre.map((profile) => (
              <View
                key={profile.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  margin: "0 10  10 0",
                  borderLeft: `2px solid ${profile.color}`,
                  paddingLeft: 5,
                }}
              >
                <Image
                  style={[
                    stylesPdf.profileImg,
                    { height: 25, width: 25, marginRight: 3 },
                  ]}
                  src={formatImage(
                    activeSocialMediaType,
                    subdomain,
                    profile.picture
                  )}
                />

                {/* <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 7, fontWeight: "bold" }}>Vs</Text>
                </View> */}
              </View>
            ))}
          </View>
          <View>
            <View wrap={true} style={stylesPdf.graphSection}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={stylesPdf.sectionTitle}>
                  Average interactions overview
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    textTransform: "capitalize",
                    marginRight: 30,
                  }}
                >
                  {" "}
                  Aggregated by {interactionDateFilter}{" "}
                </Text>
              </View>
              <Image style={stylesPdf.graph} src={pdf1} />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {selectedProfilesListToComapre.map((data) => (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: `${data.color}`,
                    }}
                  ></View>
                ))}
                <Text style={{ fontSize: 8, marginLeft: 5 }}>
                  Average interactions overview
                </Text>
              </View>
            </View>
            <View
              wrap={true}
              style={[stylesPdf.graphSection, { marginTop: 40 }]}
            >
              <Text style={stylesPdf.sectionTitle}>
                Top post types overview
              </Text>

              <Image style={stylesPdf.graph} src={pdf3} />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {selectedProfilesListToComapre.map((data) => (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: `${data.color}`,
                    }}
                  ></View>
                ))}
                <Text style={{ fontSize: 8, marginLeft: 5 }}>
                  Top post types overview
                </Text>
              </View>
            </View>
            <View break wrap={true} style={stylesPdf.graphSection}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={stylesPdf.sectionTitle}>Growth of total fans</Text>
                <Text
                  style={{
                    fontSize: 8,
                    textTransform: "capitalize",
                    marginRight: 30,
                  }}
                >
                  {" "}
                  Aggregated by {fanGrowthDateFilter}{" "}
                </Text>
              </View>
              <Image style={stylesPdf.graph} src={pdf2} />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {selectedProfilesListToComapre.map((data) => (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: `${data.color}`,
                    }}
                  ></View>
                ))}
                <Text style={{ fontSize: 8, marginLeft: 5 }}>
                  Growth of total fans
                </Text>
              </View>
            </View>
            <View wrap={true} style={{ marginTop: 30 }}>
              <Text style={stylesPdf.sectionTitle}>
                Distribution of interactions
              </Text>
              <View
                wrap
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                {pdf4.map((data, index) => {
                  const intersection = interactionDistributions
                    ? interactionDistributions.filter((data, i) => i == index)
                    : [];
                  const pieProfileImg = selectedProfilesListToComapre
                    ? selectedProfilesListToComapre.map(
                        (data, i) => data.picture
                      )
                    : [];
                  const total = intersection.map(
                    (data) =>
                      parseInt(data.total_reactions) +
                      parseInt(data.total_comments) +
                      parseInt(data.total_shares ? data.total_shares : 0)
                  );
                  const totalFilter = total.find((data) => data === 0);
                  const pageName = intersection.map((data) => data.page_name);
                  const pagePic = intersection.map((data) => data.page_picture);

                  return (
                    <View wrap={false} style={stylesPdf.distributionSec}>
                      <View
                        wrap={false}
                        break
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Image
                          src={formatImage(
                            activeSocialMediaType,
                            subdomain,
                            pagePic
                          )}
                          style={{ height: 15, width: 15, marginRight: 5 }}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: "capitalize",
                          }}
                        >
                          {" "}
                          {pageName}{" "}
                        </Text>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                        }}
                      >
                        <View
                          style={{
                            position: "relative",
                            width: "40vw",
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              top: "55%",
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            {numbersFormat(total)}{" "}
                          </Text>
                          {totalFilter === 0 ? (
                            <View
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "auto",
                                marginTop: 20,
                                borderRadius: "50%",
                                border: "14px solid rgba(224, 224, 224, 1)",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            ></View>
                          ) : (
                            <Image
                              style={{
                                marginTop: 20,
                                marginLeft: "-85px",
                                width: 370,
                                height: 100,
                              }}
                              src={data}
                            />
                          )}
                        </View>
                        <View
                          style={{
                            width: "70%",
                            border: "1px solid #EBECED",
                            borderRadius: 5,
                            height: "70%",
                            marginTop: 30,
                          }}
                        >
                          <View
                            style={[
                              stylesPdf.tr,
                              { backgroundColor: "#EBECED" },
                            ]}
                          >
                            <Text
                              style={[
                                stylesPdf.td,
                                { flexGrow: 1, width: "60%" },
                              ]}
                            ></Text>
                            <Text style={stylesPdf.td}> Count </Text>
                            <Text style={stylesPdf.td}> % </Text>
                          </View>
                          {intersection.map((data) => (
                            <>
                              <View style={stylesPdf.tr}>
                                <Text
                                  style={[
                                    stylesPdf.td,
                                    { flexGrow: 1, width: "60%" },
                                  ]}
                                >
                                  {" "}
                                  <View
                                    style={{
                                      backgroundColor: "red",
                                      height: 10,
                                      width: 10,
                                      marginRight: 8,
                                    }}
                                  >
                                    {" "}
                                  </View>{" "}
                                  <Image
                                    src={likeReaction}
                                    style={{ width: 8, height: 8 }}
                                  />{" "}
                                  {`${
                                    activeSocialMediaType === "facebook"
                                      ? "Reaction"
                                      : "Likes"
                                  }`}
                                </Text>
                                <Text style={stylesPdf.td}>
                                  {" "}
                                  {formatNumber(data.total_reactions)}{" "}
                                </Text>

                                <Text style={stylesPdf.td}>
                                  {" "}
                                  {data.total_reactions !== 0 ? (
                                    <span>
                                      {" "}
                                      {Math.round(
                                        (parseInt(data.total_reactions) /
                                          (parseInt(data.total_reactions) +
                                            parseInt(
                                              data.total_shares
                                                ? data.total_shares
                                                : 0
                                            ) +
                                            parseInt(data.total_comments))) *
                                          100
                                      )}
                                      %
                                    </span>
                                  ) : (
                                    "0%"
                                  )}
                                </Text>
                              </View>
                              <View style={stylesPdf.tr}>
                                <Text
                                  style={[
                                    stylesPdf.td,
                                    { flexGrow: 1, width: "60%" },
                                  ]}
                                >
                                  {" "}
                                  <View
                                    style={{
                                      backgroundColor: "green",
                                      height: 10,
                                      width: 10,
                                      marginRight: 8,
                                    }}
                                  >
                                    {" "}
                                  </View>{" "}
                                  <Image
                                    src={commentReaction}
                                    style={{ width: 8, height: 8 }}
                                  />{" "}
                                  Comments
                                </Text>
                                <Text style={stylesPdf.td}>
                                  {" "}
                                  {formatNumber(data.total_comments)}{" "}
                                </Text>
                                <Text style={stylesPdf.td}>
                                  {" "}
                                  {data.total_comments !== 0 ? (
                                    <span>
                                      {" "}
                                      {Math.round(
                                        (parseInt(data.total_comments) /
                                          (parseInt(data.total_reactions) +
                                            parseInt(
                                              data.total_shares
                                                ? data.total_shares
                                                : 0
                                            ) +
                                            parseInt(data.total_comments))) *
                                          100
                                      )}
                                      %
                                    </span>
                                  ) : (
                                    "0%"
                                  )}{" "}
                                </Text>
                              </View>

                              <View style={stylesPdf.tr}>
                                {activeSocialMediaType === "facebook" ? (
                                  <>
                                    <Text
                                      style={[
                                        stylesPdf.td,
                                        { flexGrow: 1, width: "60%" },
                                      ]}
                                    >
                                      <View
                                        style={{
                                          backgroundColor: "yellow",
                                          height: 10,
                                          width: 10,
                                          marginRight: 8,
                                        }}
                                      >
                                        {" "}
                                      </View>{" "}
                                      <Image
                                        src={shareReaction}
                                        style={{ width: 8, height: 8 }}
                                      />{" "}
                                      Shares
                                    </Text>
                                    <Text style={stylesPdf.td}>
                                      {" "}
                                      {formatNumber(data.total_shares)}{" "}
                                    </Text>
                                    <Text style={stylesPdf.td}>
                                      {" "}
                                      {data.total_shares !== 0 ? (
                                        <span>
                                          {" "}
                                          {Math.round(
                                            (parseInt(data.total_shares) /
                                              (parseInt(data.total_reactions) +
                                                parseInt(data.total_shares) +
                                                parseInt(
                                                  data.total_comments
                                                ))) *
                                              100
                                          )}
                                          %
                                        </span>
                                      ) : (
                                        "0%"
                                      )}{" "}
                                    </Text>
                                  </>
                                ) : (
                                  <Text> </Text>
                                )}
                              </View>
                            </>
                          ))}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderTop: "1px solid #D5DDE0",
              paddingTop: 15,
              position: "absolute",
              bottom: 10,
              left: 30,
              width: "100%",
            }}
            fixed
          >
            <Text style={{ fontSize: 10, color: "#323132" }}>Overview</Text>
            <Text
              style={{
                fontSize: 10,
                color: "#D5DDE0",
              }}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
            <Image src={defaultLogo} style={{ height: 25, width: 120 }} />
          </View>
        </Page>
        {feeds.length > 0 && (
          <Page wrap={false} size="A4" style={stylesPdf.page}>
            <View>
              {feeds.length > 0 && (
                <View wrap={true} style={stylesPdf.sectionTopPost}>
                  <Text style={stylesPdf.sectionTitle}>Top Posts </Text>
                  <View style={stylesPdf.topPostsContainer}>
                    {feeds && feeds.length !== 0
                      ? feeds.map((topPost, index) => (
                          <PdfTopPostComponent
                            key={index}
                            topPost={topPost}
                            activeSocialMediaType={activeSocialMediaType}
                            subdomain={subdomain}
                            user={user}
                          />
                        ))
                      : ""}
                  </View>
                </View>
              )}
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderTop: "1px solid #D5DDE0",
                paddingTop: 15,
                position: "absolute",
                bottom: 10,
                left: 30,
                width: "100%",
              }}
              fixed
            >
              <Text style={{ fontSize: 10, color: "#323132" }}>Overview</Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#D5DDE0",
                }}
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
              />
              <Image src={defaultLogo} style={{ height: 20, width: 120 }} />
            </View>
          </Page>
        )}

        {/* Metrics Page */}
        <Page wrap={true} size="A4" style={stylesPdf.page}>
          <View wrap={true}>
            <Text style={{ fontSize: 14, marginBottom: 20 }}>
              <View>Metrics Overview</View>
            </Text>
            <View style={[stylesPdf.metricText]}>
              <Text>
                <View> 1. Average interactions overview </View>
              </Text>

              <Text>
                <View>
                  The sum of interactions (Reactions, Comments, and Shares)
                  divided by the number of posts published on the same page
                  during a specific time range.
                </View>
              </Text>
            </View>
            <View style={[stylesPdf.metricText]}>
              <Text>
                <View> 2. Growth Of Total Fans </View>
              </Text>

              <Text>
                <View>
                  This chart shows the information regarding the growth of
                  followers of your pages withing selected time period. The
                  negative value shows decrease in followers whereas positive
                  value shows increase in followers.
                </View>
              </Text>
            </View>
            <View style={[stylesPdf.metricText]}>
              <Text>
                <View> 3. Interactions Distribution </View>
              </Text>

              <Text>
                <View>
                  The colorful piechart displays the ratio how the interactions
                  (Reactions, Comments and Shares) are distributed in page.
                </View>
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  //send download activity report
  const createUserDownloadActivity = (type) => {
    let profilesForActivityReport = [];

    selectedProfilesListToComapre.forEach((f) => {
      if (!profilesForActivityReport.includes(f.name)) {
        profilesForActivityReport.push(f.name);
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
    const blob = await pdf(<Exportable />).toBlob();
    saveAs(blob, `${activeSocialMediaType}-Comparison.pdf`);
  };

  return (
    <Layout>
      <div className="ComparisonPageScreenContainer">
        <Grid className={classes.row} container>
          <div className={classes.tabHeaderComp}>
            {/* <SocialButtonGroup /> */}
            <div style={{ flexGrow: "1" }}>
              <SocialButton />
            </div>
            <div>
              <FilterDays />
            </div>
            <DownloadButton>
              <StyledMenuItem onClick={() => generatePdfDocument()}>
                <img
                  style={{ width: 20, height: 20, marginRight: 8 }}
                  alt="pdf logo"
                  src={PDFlogo}
                />{" "}
                Export pdf{" "}
              </StyledMenuItem>
              <StyledMenuItem onClick={() => screenshotPage()}>
                {" "}
                <img
                  style={{ width: 20, height: 20, marginRight: 8 }}
                  alt="png logo"
                  src={PNGlogo}
                />{" "}
                Export png{" "}
              </StyledMenuItem>
              <StyledMenuItem>
                {" "}
                <ComparisonDataExport
                  xlsxLogo={XLSXlogo}
                  showDownloadSnackBar={setShowDownloadToast}
                  interactionData={interactionsData}
                  timeRange={customDateRangeRed}
                  interaction1kPerFans={interaction1kPerFans}
                  interactionDateFilter={interactionDateFilter}
                  fanGrowthDateFilter={fanGrowthDateFilter}
                  onClick={() => {
                    //send download activity report function
                    createUserDownloadActivity("pdf");
                  }}
                />{" "}
              </StyledMenuItem>
            </DownloadButton>
          </div>

          <div
            style={{
              display: sm ? "block" : "flex",
              justifyContent: "center",
              marginRight: 40,
              marginLeft: 40,
              marginBottom: sm ? "30px" : "0px",
              position: "relative",
            }}
          >
            <div>
              <PageTitle subTitle="Comparison" />
            </div>
            {selectedProfilesListToComapre.length === 0 ? (
              ""
            ) : selectedProfilesListToComapre.length <= 2 ? (
              <div
                style={
                  sm
                    ? {
                        height: 40,
                        width: sm ? "40vw" : "initial",
                        marginLeft: sm ? "auto" : "0px",
                        margin: "0px auto",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : {
                        height: 40,
                        width: sm ? "40vw" : "initial",
                        marginLeft: sm ? "auto" : "0px",
                        position: "absolute",
                        top: 42,
                        right: 0,
                      }
                }
              >
                <AddProfileComaprisonModal
                  profile={selectedProfilesListToComapre}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {selectedProfilesListToComapre.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
              }}
            >
              <Typography variant="h4">No Records found</Typography>
              <Typography>
                Add profiles to gain insights to improve your strategy by
                comparing your performance against competitors
              </Typography>
              <Link to="/comparision">Go to Profile Adding Page</Link>
            </div>
          ) : (
            <Container disableGutters maxWidth="xl" id="profile-list">
              <Grid
                container
                style={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  padding: xs ? "0px 10px" : "0px 40px",
                }}
              >
                <Card
                  id="cardList"
                  className={classes.cardDetails}
                  style={{
                    margin: xs ? "10px auto" : md ? "10px auto" : "42px auto",
                    display: sm ? "block" : "flex",
                    width: "100%",
                    border: "none",
                    overflowX:
                      selectedProfilesListToComapre.length === 2
                        ? "hidden"
                        : "auto",
                    paddingLeft:
                      selectedProfilesListToComapre.length === 2
                        ? "0px"
                        : "0px",
                    paddingBottom: 30,
                    marginBottom: 0,
                    justifyContent:
                      selectedProfilesListToComapre.length === 2
                        ? "center"
                        : "normal",
                  }}
                  variant="outlined"
                >
                  {selectedProfilesListToComapre &&
                  selectedProfilesListToComapre.length === 2
                    ? selectedData.map((profileList) => (
                        <div id="profileId" style={{ overflowY: "auto" }}>
                          <div
                            id="card"
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: xs
                                ? "normal"
                                : md
                                ? "center"
                                : "normal",
                            }}
                          >
                            <CardMedia>
                              <Link
                                to={{ pathname: profileList.page_url }}
                                target="_blank"
                              >
                                <Avatar
                                  alt="profileImage"
                                  src={formatImage(
                                    activeSocialMediaType,
                                    subdomain,
                                    profileList.picture
                                  )}
                                  style={{
                                    width: xs ? "45px" : md ? "100px" : "140px",
                                    height: xs
                                      ? "45px"
                                      : md
                                      ? "100px"
                                      : "140px",
                                    border: "1px solid #E0E0E0",
                                  }}
                                />
                              </Link>
                            </CardMedia>
                            <CardContent
                              style={{
                                marginLeft: md ? 0 : 15,
                                padding: sm ? 16 : md ? 5 : 16,
                              }}
                            >
                              <div id="profile-list-card-title">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: 0,
                                  }}
                                >
                                  <div
                                    id="color-code"
                                    style={{
                                      backgroundColor: profileList.color,
                                      width: xs ? 10 : 15,
                                      height: xs ? 10 : 15,
                                      borderRadius: "50%",
                                      marginRight: 30,
                                    }}
                                  ></div>
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                      color: "#000",
                                    }}
                                    to={{ pathname: profileList.page_url }}
                                    target="_blank"
                                  >
                                    <Typography
                                      variant="h5"
                                      component="h2"
                                      style={{
                                        fontSize: xs ? 16 : 24,
                                        fontWeight: 600,
                                        marginBottom: 10,
                                        textTransform: "capitalize",
                                        marginRight: sm ? "30px" : "0px",
                                      }}
                                    >
                                      {profileList.name}
                                    </Typography>
                                  </Link>
                                </div>
                                <Typography style={{ fontSize: xs ? 11 : 15 }}>
                                  {profileList.username}
                                </Typography>
                              </div>
                              <div
                                id="profile-list-card-interaction"
                                style={{
                                  display: "flex",
                                  marginTop: 25,
                                  marginLeft: xs ? "-20%" : "0px",
                                  flexWrap: md ? "wrap" : "no-wrap",
                                }}
                              >
                                <div
                                  style={{ marginRight: xs ? 10 : "initial" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: md ? 50 : lg ? 75 : 100,
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
                                      {numbersFormat(profileList.posts_count)}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{
                                        fontSize: xs ? 12 : 13,
                                        marginLeft: 10,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      New Posts
                                    </Typography>
                                  </div>
                                  <AbsoluteGrowthCard
                                    growthRate={
                                      profileList.post_absolute_growth
                                    }
                                  />
                                </div>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: md ? 25 : lg ? 50 : 100,
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
                                      {numbersFormat(
                                        profileList.fan_count_for_date_range
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      style={{
                                        fontSize: xs ? 12 : 13,
                                        marginLeft: 10,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      New Followers
                                    </Typography>
                                  </div>
                                  <AbsoluteGrowthCard
                                    growthRate={
                                      profileList.followers_absolute_growth
                                    }
                                  />
                                </div>
                                <div>
                                  {activeSocialMediaType === "instagram" && (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginRight: md ? 25 : lg ? 50 : 100,
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
                                          {numbersFormat(
                                            profileList.following_count
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          component="p"
                                          style={{
                                            fontSize: xs ? 12 : 13,
                                            marginLeft: 10,
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          New Following
                                        </Typography>
                                      </div>
                                      <AbsoluteGrowthCard
                                        growthRate={
                                          profileList.following_absolute_growth
                                        }
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      ))
                    : ""}

                  {selectedProfilesListToComapre &&
                  selectedProfilesListToComapre.length > 2
                    ? selectedProfilesListToComapre.map((profileList) => (
                        <div
                          className="profileList"
                          key={profileList.id}
                          style={{
                            display: sm ? "block" : "flex",
                            position: "relative",
                          }}
                        >
                          <StyleCard
                            style={{
                              width: sm ? "100%" : 220,
                              display: "flex",
                              flexDirection: sm ? "row" : "column",
                              justifyContent: sm ? "flex-start" : "center",
                              padding: "10px 10px",
                              border: "1px solid #E0E0E0",
                              position: "relative",
                              alignItems: "center",
                              margin: sm ? "20px 0px" : "0px",
                            }}
                          >
                            <div className="cardRemovebtn">
                              {" "}
                              <RemoveCircleOutlineOutlinedIcon
                                color="error"
                                onClick={() =>
                                  profileListDelete(profileList.id)
                                }
                              />{" "}
                            </div>
                            <Link
                              to={{ pathname: profileList.page_url }}
                              target="_blank"
                            >
                              <Avatar
                                style={{
                                  height: xs ? 40 : 80,
                                  width: xs ? 40 : 80,
                                  border: "1px solid #E0E0E0",
                                  alignSelf: "center",
                                  marginBottom: 10,
                                  marginRight: sm ? 10 : 0,
                                }}
                                src={formatImage(
                                  activeSocialMediaType,
                                  subdomain,
                                  profileList.picture
                                )}
                              />
                            </Link>
                            <div>
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: "#000",
                                }}
                                to={{ pathname: profileList.page_url }}
                                target="_blank"
                              >
                                <Typography
                                  style={{
                                    fontSize: xs ? 12 : 15,
                                    fontWeight: 600,
                                    textAlign: "center",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {" "}
                                  {profileList.name}{" "}
                                </Typography>
                              </Link>
                              <Typography
                                style={{
                                  fontSize: xs ? 10 : 14,
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {profileList.username}{" "}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: profileList.color,
                                height: 14,
                                width: 14,
                                borderRadius: "50%",
                                alignSelf: "center",
                                marginTop: 8,
                                marginLeft: sm ? "auto" : "unset",
                              }}
                            ></div>
                          </StyleCard>
                        </div>
                      ))
                    : ""}
                  {selectedProfilesListToComapre &&
                    selectedProfilesListToComapre.length > 2 && (
                      <StyleCardAddprofile
                        component="span"
                        id="add-profile-card"
                        className="addProfileCard"
                        style={{
                          backgroundColor: "#FAFAFA ",
                          minWidth: sm ? "100%" : 180,
                          border: "2px dashed #BDBDBD",
                          display: "flex",
                          justifyContent: "center",
                          overflow: "unset",
                          padding: sm ? "30px" : "0px",
                          marginTop: sm ? "20px" : "0px",
                        }}
                      >
                        <AddProfileComaprisonModal />
                      </StyleCardAddprofile>
                    )}
                </Card>
              </Grid>
              <div
                style={{ flexGrow: 1, padding: xs ? "15px 10px" : "15px 40px" }}
              >
                <Grid className={classes.charts} container>
                  <Grid className={classes.growthChart} item xs={12}>
                    {interactionLoader && (
                      <Spinner className={classes.loader} />
                    )}
                    {selectedProfilesListToComapre.length != 0 ? (
                      <BarChart
                        chartId="interaction"
                        chartTitle="Average interactions overview"
                        graphTitle="Interactions"
                        showLabel="false"
                        showPeriod={true}
                        adddeSocialMedaiProfile={selectedProfilesListToComapre}
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
                        height={80}
                        switchShow={true}
                      />
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
                  <Grid
                    className={classes.growthChart}
                    item
                    xs={12}
                    style={{ marginTop: 65 }}
                  >
                    {multiplePostBreakDownLoader && (
                      <Spinner className={classes.loader} />
                    )}
                    {selectedProfilesListToComapre.length != 0 ? (
                      <BarChart
                        chartId="post"
                        chartTitle="Top post types overview"
                        graphTitle="Posts"
                        showLabel="false"
                        showPeriod={false}
                        adddeSocialMedaiProfile={selectedProfilesListToComapre}
                        chartData={postsBreakdownDataMultiple}
                        getSelectedProfile={(selectProfiles) => {
                          postTypeChart(selectProfiles);
                        }}
                        height={80}
                      />
                    ) : (
                      <div className={classes.chartFallBackContainer}>
                        <div className={classes.graphTitleSection}>
                          <Typography
                            className={classes.graphTitle}
                            variant="h5"
                          >
                            Post Types Overview
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

                  <Grid className={classes.pieChart} item xs={12}>
                    {interactionDistributions.length != 0 ? (
                      <div>
                        <div className={classes.graphTitleSection}>
                          <Typography
                            style={{
                              fontSize: xs ? 16 : 24,
                              fontWeight: 600,
                              letterSpacing: 0,
                            }}
                            variant="h6"
                          >
                            Distribution of interactions
                          </Typography>
                        </div>

                        <Grid
                          className={classes.pieChartDistribution}
                          container
                        >
                          {interactionDistributions.map((pieProfiles, i) => (
                            <Grid
                              className={classes.pieChartProfile}
                              item
                              xs={12}
                              lg={6}
                              spacing={3}
                            >
                              {interactionDistributionsLoader && (
                                <Spinner className={classes.loader} />
                              )}

                              <div className={classes.pieProfileDetails}>
                                <img
                                  alt="profile-logo"
                                  className={classes.pieProfileImg}
                                  src={formatImage(
                                    activeSocialMediaType,
                                    subdomain,
                                    pieProfiles.page_picture
                                  )}
                                />
                                <Typography className={classes.pieProfileName}>
                                  {pieProfiles.page_name}
                                </Typography>
                              </div>

                              <div
                                ref={(element) =>
                                  (itemEls.current[i] = element)
                                }
                              >
                                <PieChart
                                  activeSocialMediaType={activeSocialMediaType}
                                  total={
                                    parseInt(pieProfiles.total_reactions) +
                                    parseInt(pieProfiles.total_comments) +
                                    parseInt(
                                      pieProfiles.total_shares
                                        ? pieProfiles.total_shares
                                        : 0
                                    )
                                  }
                                  getTotal={(total) => getPieTotal(total)}
                                  chartData={pieProfiles}
                                />
                              </div>
                              <TableContainer className={classes.chartDetails}>
                                <Table
                                  className={classes.table}
                                  aria-label="simple table"
                                >
                                  <TableBody>
                                    <TableRow>
                                      <TableCell
                                        className={classes.pieChartDetailHeader}
                                        component="th"
                                        scope="row"
                                      >
                                        <FavoriteIcon
                                          className={
                                            classes.pieDistributionIcon
                                          }
                                          style={{
                                            background:
                                              "rgba(255, 52, 52, 0.1)",
                                            color: "#ff3434",
                                          }}
                                        />
                                        <Typography
                                          className={
                                            classes.pieDistributionTitle
                                          }
                                        >
                                          {activeSocialMediaType == "instagram"
                                            ? "Like"
                                            : "Reactions"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        {formatNumber(
                                          pieProfiles.total_reactions
                                        ) || 0}
                                      </TableCell>
                                      <TableCell>
                                        {pieProfiles.total_reactions || 0
                                          ? Math.round(
                                              (parseInt(
                                                pieProfiles.total_reactions
                                              ) /
                                                (parseInt(
                                                  pieProfiles.total_reactions
                                                ) +
                                                  parseInt(
                                                    pieProfiles.total_comments
                                                  ) +
                                                  parseInt(
                                                    pieProfiles.total_shares
                                                      ? pieProfiles.total_shares
                                                      : 0
                                                  ))) *
                                                100
                                            ) + "%"
                                          : "0%"}
                                      </TableCell>
                                    </TableRow>

                                    <TableRow>
                                      <TableCell
                                        className={classes.pieChartDetailHeader}
                                        component="th"
                                        scope="row"
                                      >
                                        <MessageIcon
                                          className={
                                            classes.pieDistributionIcon
                                          }
                                          style={{
                                            background:
                                              "rgba(11, 102, 112, 0.1)",
                                            color: "#0b6670",
                                          }}
                                        />
                                        <Typography
                                          className={
                                            classes.pieDistributionTitle
                                          }
                                        >
                                          Comments
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        {formatNumber(
                                          pieProfiles.total_comments
                                        ) || 0}
                                      </TableCell>
                                      <TableCell>
                                        {pieProfiles.total_comments || 0
                                          ? Math.round(
                                              (parseInt(
                                                pieProfiles.total_comments
                                              ) /
                                                (parseInt(
                                                  pieProfiles.total_reactions
                                                ) +
                                                  parseInt(
                                                    pieProfiles.total_comments
                                                  ) +
                                                  parseInt(
                                                    pieProfiles.total_shares
                                                      ? pieProfiles.total_shares
                                                      : 0
                                                  ))) *
                                                100
                                            ) + "%"
                                          : "0%"}
                                      </TableCell>
                                    </TableRow>

                                    {activeSocialMediaType !== "instagram" ? (
                                      <TableRow>
                                        <TableCell
                                          className={
                                            classes.pieChartDetailHeader
                                          }
                                          component="th"
                                          scope="row"
                                        >
                                          <ReplySharpIcon
                                            className={
                                              classes.pieDistributionIcon
                                            }
                                            style={{
                                              background:
                                                "rgba(248, 193, 68, 0.2)",
                                              color: "#f8c144",
                                            }}
                                          />
                                          <Typography
                                            className={
                                              classes.pieDistributionTitle
                                            }
                                          >
                                            Share
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          {formatNumber(
                                            pieProfiles.total_shares
                                          ) || 0}
                                        </TableCell>
                                        <TableCell>
                                          {pieProfiles.total_shares || 0
                                            ? Math.round(
                                                (parseInt(
                                                  pieProfiles.total_shares
                                                ) /
                                                  (parseInt(
                                                    pieProfiles.total_reactions
                                                  ) +
                                                    parseInt(
                                                      pieProfiles.total_comments
                                                    ) +
                                                    parseInt(
                                                      pieProfiles.total_shares
                                                    ))) *
                                                  100
                                              ) + "%"
                                            : "0%"}
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      ""
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    ) : (
                      <div className={classes.chartFallBackContainer}>
                        <div className={classes.graphTitleSection}>
                          <Typography
                            className={classes.graphTitle}
                            variant="h5"
                          >
                            Distribution of interactions
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

                  <Grid
                    className={classes.growthChart}
                    item
                    xs={12}
                    style={{ marginTop: 65 }}
                  >
                    {fanGrowthLoader && <Spinner className={classes.loader} />}
                    {selectedProfilesListToComapre.length != 0 ? (
                      <BarChart
                        chartId="totalFans"
                        chartTitle="Growth of total fans"
                        graphTitle="Fan growth"
                        showLabel="false"
                        showPeriod={true}
                        adddeSocialMedaiProfile={selectedProfilesListToComapre}
                        chartData={fanGrowthData}
                        getSelectedProfile={(selectProfiles, dateFilter) => {
                          fanGrowthChart(selectProfiles, dateFilter);
                        }}
                        height={80}
                      />
                    ) : (
                      <div className={classes.chartFallBackContainer}>
                        <div className={classes.graphTitleSection}>
                          <Typography
                            className={classes.graphTitle}
                            variant="h5"
                          >
                            Fan's Gowth
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
                <Grid container>
                  {postTypes.length !== 0 ? (
                    <div className={classes.ContentNewsFeedPostsContainer}>
                      <div className="top_post_title">
                        <Typography
                          className={classes.graphTitle}
                          variant="h5"
                          style={{
                            marginBottom: xs ? 10 : "initial",
                            fontSize: xs ? 16 : 22,
                          }}
                        >
                          Top posts
                        </Typography>
                        <div>
                          <FormControl style={{ minWidth: 230 }}>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <StyledSelect
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              variant="outlined"
                              displayEmpty={false}
                              MenuProps={menuProps}
                              value={topPostParams.sortType}
                              onChange={selectSortHandleChange}
                              style={{ fontSize: 15, fontWeight: 600 }}
                            >
                              {sortOptions.map((option) => {
                                return (
                                  <StyledMenuItem
                                    value={option.value}
                                    selected={true}
                                    key={option.value}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {" "}
                                        {option.name}{" "}
                                      </Typography>{" "}
                                    </div>
                                  </StyledMenuItem>
                                );
                              })}
                            </StyledSelect>
                          </FormControl>
                        </div>
                      </div>
                      {topPostParams.selectedProfiles.length > 0 ? (
                        <Grid container spacing={3}>
                          {contentNewsFeedLoading ? (
                            <div
                              style={{
                                width: "100%",
                                position: "relative",
                                margin: 10,
                              }}
                            >
                              <div className={classes.chartFallBack}>
                                <Spinner />
                              </div>
                            </div>
                          ) : !contentNewsFeedLoading &&
                            feeds &&
                            feeds.length > 0 ? (
                            feeds.map((feed) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={3}
                                xl={3}
                                key={feed._id}
                              >
                                <div>
                                  <SocialMediaPostsCard
                                    pageId={feed.profile_info.social_page_id}
                                    pageName={feed.profile_info.page_name}
                                    pagePicture={feed.profile_info.page_picture}
                                    topPostData={feed}
                                    totalPageLikes={
                                      feed.profile_info.page_fan_count
                                    }
                                  />
                                </div>
                              </Grid>
                            ))
                          ) : (
                            feeds &&
                            feeds.length === 0 && (
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
                            )
                          )}
                        </Grid>
                      ) : (
                        <div style={{ width: "100%", margin: 10 }}>
                          <div className={classes.chartFallBack}>
                            <Typography className={classes.noData} variant="h6">
                              Select at least one profile to show posts.
                            </Typography>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={classes.ContentNewsFeedPostsContainer}>
                      <div style={{ width: "100%", margin: 10 }}>
                        <div className={classes.chartFallBack}>
                          <Typography className={classes.noData} variant="h6">
                            Select at least one post type to show posts.
                          </Typography>
                        </div>
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
            </Container>
          )}
        </Grid>
      </div>
      {showDownloadToast && (
        <SnackBarDownload message={"Your download should begin in a moment"} />
      )}
    </Layout>
  );
};

export default withRouter(ComparisonPage);
