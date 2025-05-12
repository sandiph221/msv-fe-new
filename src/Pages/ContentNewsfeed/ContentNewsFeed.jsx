import {
  Grid,
  makeStyles,
  CardMedia,
  Typography,
  withStyles,
  MenuItem,
  Avatar,
  InputLabel,
  Select,
  useMediaQuery,
  FormControl,
  useTheme,
  Checkbox,
  Card,
  ClickAwayListener,
  Container,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import Layout from "../../Components/Layout";
import PageTitle from "../../Components/PageTitle/PageTitle";
import SocialButton from "../../Components/SocialButton";
import FilterDays from "../../Components/FilterDays";
import { Styles } from "./Styles";
import ChipComp from "../../Components/ChipComponent/ChipComp";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddedProfileList,
  getContentNewsFeed,
  clearContentNewsFeed,
} from "../../store/actions/SocialMediaProfileAction";
import TextInput from "../../Components/TextInput/TextInput";
import SocialMediaPostsCard from "../../Components/SocialMediaPostsCard/SocialMediaPostsCard";
import Spinner from "../../Components/Spinner";
import ReactPaginate from "react-paginate";
import { saveAs } from "file-saver";
import { SnackBarDownload } from "../../Components/SnackBar/DownloadSnackBar";
import { pdf } from "@react-pdf/renderer";
import "./paginationStyles.css";
import DownloadButton from "../../Components/DownloadButton/DownloadButton";
import ContentNewsFeedPDF from "./ContentNewsFeedPDF";
import { PDFlogo, PNGlogo, XLSXlogo } from "../../Components/logosandicons";
import domtoimage from "dom-to-image";
import { ContentNewsFeedDataExport } from "./ContentNewsFeedDataExport";
import { formatImage } from "utils/functions.js";

import { NO_DATA_AVAILABLE } from "../../utils/constant";
import { createUserReportDownloadActivity } from "../../store/actions/UserActivityAction";

const useStyles = makeStyles((theme) => Styles(theme));

const StyledSelect = withStyles({
  root: {
    padding: 8,
    border: "1px solid #BDBDBD",
    height: "24px",
  },
})(Select);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const StyleCardAddprofile = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#FFF8DE !important",
    },
  },
})(Card); //card add profile button  custom style

//Styled menu
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

//Multiple Select

const ContentNewsFeedPage = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const [selectProfile, setSelectProfile] = React.useState("");

  const {
    activeSocialMediaType,
    addedProfileList,
    addedProfileListLoading,
    contentNewsFeedLoading,
    contentNewsFeed,
    selectedProfilesListToComapre,
    topPostProfileID,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const { user } = useSelector((state) => state.auth);

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

  let subdomain = user.CustomerSubdomain.subdomain;

  const { feeds, pages, total, page } = contentNewsFeed ? contentNewsFeed : "";
  const comparisonSelectedDataId = selectedProfilesListToComapre.map(
    (profiles) => profiles.id
  );
  const addedProfilesDataId = addedProfileList.map((profiles) => profiles.id);

  const [open, setOpen] = React.useState(false);
  const [openPost, setOpenPosts] = React.useState(false);

  const [showDownloadToast, setShowDownloadToast] = React.useState(false);

  //For Selecting Multiple Profiles ---------------------------------------------

  const [selectProfiles, setSelectProfiles] = React.useState([]);

  const [selectedPostTypes, setSelectedPostTypes] = React.useState(postTypes);

  const [checkedValue, setCheckedValue] = React.useState([]);

  //Content News Feed Query Params

  let [contentQueryParams, setContentQueryParams] = React.useState({
    searchData: [],
    searchKeyWord: "",
    postTypes: selectedPostTypes,
    selectedProfiles: [],
    currentPage: 1,
    sortType: sortOptions[0].value,
  });

  let [searchKeyWord, setSearchKeyWord] = React.useState("");

  const [chipData, setChipData] = React.useState([]);

  //functions//

  const selectSortHandleChange = (e) => {
    setContentQueryParams({ ...contentQueryParams, sortType: e.target.value });
  };

  /* getting added profile list on component did mount */
  React.useEffect(() => {
    dispatch(clearContentNewsFeed());
    setSelectedPostTypes(postTypes);
    dispatch(getAddedProfileList());
  }, [activeSocialMediaType]);

  React.useEffect(() => {
    if (addedProfileList && addedProfileList.length !== 0) {
      if (
        selectedProfilesListToComapre &&
        selectedProfilesListToComapre.length === 0
      ) {
        setCheckedValue((prevState) => [
          ...prevState,
          [addedProfilesDataId[0]],
        ]);

        setSelectProfiles([addedProfilesDataId[0]]);
      }
      if (comparisonSelectedDataId && comparisonSelectedDataId.length !== 0) {
        setCheckedValue((prevState) => [
          ...prevState,
          comparisonSelectedDataId,
        ]);

        setSelectProfiles(comparisonSelectedDataId);
      }
      if (topPostProfileID && comparisonSelectedDataId.length === 0) {
        setCheckedValue((prevState) => [...prevState, [topPostProfileID]]);

        setSelectProfiles([topPostProfileID]);
      }
    }
  }, [addedProfileList, selectedProfilesListToComapre, topPostProfileID]);

  //setting values

  React.useEffect(() => {
    if (selectProfiles && selectProfiles.length !== 0) {
      setContentQueryParams({
        ...contentQueryParams,
        selectedProfiles: selectProfiles,
      });
    }
  }, [selectProfiles]);

  React.useEffect(() => {
    if (selectedPostTypes && selectedPostTypes.length !== 0) {
      setContentQueryParams({
        ...contentQueryParams,
        postTypes: selectedPostTypes,
      });
    }
  }, [selectedPostTypes]);

  React.useEffect(() => {
    if (chipData) {
      setContentQueryParams({
        ...contentQueryParams,
        searchData: chipData,
      });
    }
  }, [chipData]);

  React.useEffect(() => {
    if (
      addedProfileList &&
      addedProfileList.length !== 0 &&
      selectProfiles &&
      selectProfiles.length !== 0 &&
      !addedProfileListLoading
    ) {
      dispatch(getContentNewsFeed(contentQueryParams));
    }
  }, [contentQueryParams, customDateRangeRed]);

  //handle change of select profile

  //Content Feed ---------------------------------------------------------------

  //Handle search function

  const handleSearchFunction = (event) => {
    setChipData([
      { key: Math.floor(Math.random() * 100 + 1), label: event.target.value },
      ...chipData,
    ]);
    setSearchKeyWord("");
  };

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

  //For updating array of selected Posts

  const updateSelectedPosts = (value, checked) => {
    setOpenPosts(true);
    if (value === "All Types") {
      setSelectedPostTypes(checked ? postTypes : []);
    } else {
      const postTypesWithoutAll = postTypes.filter(
        (selectedPost) => selectedPost !== "All Types"
      );
      let newPostTypes = checked
        ? [...selectedPostTypes, value]
        : selectedPostTypes.filter((selectedPost) => selectedPost !== value);
      newPostTypes = newPostTypes.filter(
        (selectedPost) => selectedPost !== "All Types"
      );
      if (postTypesWithoutAll.length === newPostTypes.length) {
        newPostTypes = [...newPostTypes, "All Types"];
      }
      setSelectedPostTypes(newPostTypes);
    }
  };

  const updateSelectedProfiles = (id) => {
    /* data fetched through api call*/
    // if profile is selected, Unselect it and update state
    setOpen(true);
    if (selectProfiles.includes(id)) {
      const unselectProfile = selectProfiles.filter(
        (selectProfiles) => selectProfiles !== id
      );
      setSelectProfiles(unselectProfile);
    }
    // if profile is not selected add to state
    else {
      setSelectProfiles((prevState) => [...prevState, id]);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePostsOpen = () => {
    setOpenPosts(true);
  };

  const handlePostsClose = () => {
    setOpenPosts(false);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleClickAwayPost = () => {
    setOpenPosts(false);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //Pagination
  const handlePageChange = (e) => {
    window.scrollTo(0, 0);
    const param = {
      ...contentQueryParams,
      currentPage: e.selected + 1,
    };
    dispatch(getContentNewsFeed(param));
  };

  //Function to take screenshot of a webpage and download it.
  function screenshotPage() {
    //send download activity report function
    createUserDownloadActivity("screenshot");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);
    var wrapper = document.querySelector(".contentNewsfeedContainer");

    domtoimage.toBlob(wrapper, { bgcolor: "#ffffff" }).then(function (blob) {
      saveAs(blob, `${activeSocialMediaType}-Content Newsfeed.png`);
    });
  }

  //send download activity report
  const createUserDownloadActivity = (type) => {
    let profilesForActivityReport = [];

    selectProfiles.forEach((f) => {
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

  //For Generating PDF

  const generatePdfDocument = async () => {
    //send download activity report function
    createUserDownloadActivity("pdf");

    setShowDownloadToast(true);
    setTimeout(() => {
      setShowDownloadToast(false);
    }, 3000);
    const blob = await pdf(
      <ContentNewsFeedPDF
        postType={contentQueryParams.postType}
        pageNumber={page}
        keyWords={contentQueryParams.searchData}
        totalPages={pages}
        activeSocialMediaType={activeSocialMediaType}
        addedProfileList={addedProfileList}
        selectedProfilesList={contentQueryParams.selectedProfiles}
        topFilterData={customDateRangeRed}
        profile_feeds={feeds}
        user={user}
      />
    ).toBlob();
    saveAs(
      blob,
      `Content NewsFeed-${activeSocialMediaType}-overview Dashboard.pdf`
    );
  };

  let SelectedProfileDetails = addedProfileList.filter((data) =>
    contentQueryParams.selectedProfiles.includes(data.id)
  );

  const classes = useStyles({ xs });

  return (
    <Layout>
      <div className="contentNewsfeedContainer">
        <Container disableGutters maxWidth="xl">
          <Grid className={classes.row} container>
            <div className={classes.tabHeaderComp}>
              <div style={{ flexGrow: 1 }}>
                <SocialButton />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginRight: xs ? 0 : 10,
                  flexGrow: xs ? 2 : "initial",
                  height: xs ? "100%" : "initial",
                }}
              >
                <FormControl
                  style={{
                    width: 200,
                  }}
                  className={classes.dropDown}
                >
                  {selectProfiles.length > 0 ? (
                    <StyledInputLabel
                      variant="outlined"
                      id="contentnewsfeed-selectedprofiles"
                      shrink={true}
                    >
                      {" "}
                      Select profiles
                    </StyledInputLabel>
                  ) : (
                    <StyledInputLabel
                      variant="outlined"
                      id="contentnewsfeed-selectedprofiles"
                      shrink={true}
                    >
                      {" "}
                      Select profiles
                    </StyledInputLabel>
                  )}

                  <StyledSelect
                    labelId="demo-simple-select-label"
                    variant="outlined"
                    displayEmpty={false}
                    value=""
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    MenuProps={menuProps}
                  >
                    {addedProfileList.length > 0 ? (
                      addedProfileList.map((addedProfileList) => (
                        <StyledMenuItem
                          key={addedProfileList.id}
                          value={addedProfileList.id}
                          selected={true}
                          style={{
                            background:
                              selectProfiles.indexOf(addedProfileList.id) > -1
                                ? "#FFF8DE"
                                : "transparent",
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <div
                            id="styled-menu-item"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              type="checkbox"
                              onChange={(e) =>
                                updateSelectedProfiles(addedProfileList.id)
                              }
                              checked={
                                selectProfiles.indexOf(addedProfileList.id) > -1
                              }
                            />
                            <Avatar
                              src={formatImage(
                                activeSocialMediaType,
                                subdomain,
                                addedProfileList.picture
                              )}
                              style={{ width: 25, height: 25, marginRight: 10 }}
                            />{" "}
                            <Typography
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                whiteSpace: "normal",
                              }}
                            >
                              {" "}
                              {addedProfileList.name}{" "}
                            </Typography>{" "}
                          </div>
                        </StyledMenuItem>
                      ))
                    ) : (
                      <StyledMenuItem value="" selected={true}>
                        <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                          No Data Avialable
                        </Typography>{" "}
                      </StyledMenuItem>
                    )}
                  </StyledSelect>
                </FormControl>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginRight: 10,
                  marginTop: xs ? 10 : 0,
                  marginBottom: xs ? 10 : 0,
                }}
              >
                <FormControl className={classes.dropDown}>
                  {selectedPostTypes.length === postTypes.length ? (
                    <StyledInputLabel
                      variant="outlined"
                      id="contentnewsfeed-selectedprofiles"
                      shrink={true}
                    >
                      {" "}
                      All types
                    </StyledInputLabel>
                  ) : (
                    <StyledInputLabel
                      variant="outlined"
                      id="contentnewsfeed-selectedprofiles"
                      shrink={true}
                    >
                      {" "}
                      Post types
                    </StyledInputLabel>
                  )}

                  <StyledSelect
                    labelId="demo-simple-select-label"
                    variant="outlined"
                    displayEmpty={false}
                    value=""
                    open={openPost}
                    onClose={handlePostsClose}
                    onOpen={handlePostsOpen}
                    MenuProps={menuProps}
                  >
                    {postTypes.length > 0 ? (
                      postTypes.map((postType) => (
                        <ClickAwayListener
                          mouseEvent="onMouseDownPost"
                          touchEvent="onTouchStartPost"
                          onClickAway={handleClickAwayPost}
                        >
                          <StyledMenuItem
                            key={postType}
                            value={postType}
                            selected={true}
                            style={{
                              background:
                                selectedPostTypes.indexOf(postType) > -1
                                  ? "#FFF8DE"
                                  : "transparent",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <div
                              id="styled-menu-item"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                type="checkbox"
                                onChange={(e) =>
                                  updateSelectedPosts(
                                    postType,
                                    e.target.checked
                                  )
                                }
                                checked={
                                  selectedPostTypes.indexOf(postType) > -1
                                }
                              />
                              <Typography
                                style={{ fontSize: 15, fontWeight: 600 }}
                              >
                                {" "}
                                {postType}{" "}
                              </Typography>{" "}
                            </div>
                          </StyledMenuItem>
                        </ClickAwayListener>
                      ))
                    ) : (
                      <StyledMenuItem value="" selected={true}>
                        <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                          No Data Avialable
                        </Typography>{" "}
                      </StyledMenuItem>
                    )}
                  </StyledSelect>
                </FormControl>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: sm ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  width: sm ? "100%" : "initial",
                }}
              >
                <div style={{ margin: sm ? "10px 0px" : "0px 0px" }}>
                  <FilterDays />
                </div>
                <div style={{ margin: sm ? "10px 0px" : "0px 0px" }}>
                  <DownloadButton>
                    <StyledMenuItem onClick={() => generatePdfDocument()}>
                      {" "}
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
                      <ContentNewsFeedDataExport
                        xlsxLogo={XLSXlogo}
                        showDownloadSnackBar={setShowDownloadToast}
                        timeRange={customDateRangeRed}
                        selectProfiles={selectProfiles}
                        chipData={chipData}
                        selectedPostTypes={selectedPostTypes}
                        onClick={() => {
                          //send download activity report function
                          createUserDownloadActivity("excel");
                        }}
                      />{" "}
                    </StyledMenuItem>
                  </DownloadButton>
                </div>
              </div>
            </div>

            <PageTitle title="Content Newsfeed" />
            <Grid container justifyContent="center">
              <div className={classes.selectedPagesDiv}>
                {selectProfiles &&
                  selectProfiles.length !== 0 &&
                  SelectedProfileDetails &&
                  SelectedProfileDetails.map((profileList) => (
                    <div id="profileId">
                      <div
                        id="card"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: xs ? "normal" : md ? "center" : "normal",
                        }}
                      >
                        <CardMedia>
                          <HtmlTooltip title={profileList.name} placement="top">
                            <Avatar
                              alt="profileImage"
                              src={formatImage(
                                activeSocialMediaType,
                                subdomain,
                                profileList.picture
                              )}
                              style={{
                                width: xs ? "68px" : md ? "100px" : "50px",
                                height: xs ? "68px" : md ? "100px" : "50px",
                                marginRight: 10,
                              }}
                            />
                          </HtmlTooltip>
                        </CardMedia>
                      </div>
                    </div>
                  ))}
              </div>
            </Grid>
            <Grid container justifyContent="center">
              <div className={classes.inputWrapper}>
                <div
                  style={{
                    padding: "0px 40px 10px",
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
                  />
                </div>
                <div className={classes.chipComp}>
                  <ChipComp chipData={chipData} setChipData={setChipData} />
                  {chipData.length > 0 && (
                    <Typography
                      className="clearname"
                      onClick={() => setChipData([])}
                    >
                      Clear all
                    </Typography>
                  )}
                </div>
              </div>
            </Grid>
            {contentQueryParams.selectedProfiles.length > 0 &&
              selectedPostTypes.length > 0 && (
                <div className={classes.postWrapper}>
                  <span className={classes.contentNewsFeedCount}>
                    {selectProfiles.length !== 0
                      ? total
                        ? `${total} Results`
                        : ""
                      : null}
                    {/* {total && total}  */}
                  </span>
                  <div style={{ marginTop: xs ? 10 : "initial" }}>
                    {selectProfiles.length !== 0 && (
                      <FormControl style={{ minWidth: 230 }}>
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <StyledSelect
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          variant="outlined"
                          displayEmpty={false}
                          MenuProps={menuProps}
                          value={contentQueryParams.sortType}
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
                                    style={{ fontSize: 15, fontWeight: 600 }}
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
                    )}
                  </div>
                </div>
              )}
            {selectedPostTypes.length !== 0 ? (
              <div className={classes.ContentNewsFeedPostsContainer}>
                {selectProfiles && selectProfiles.length !== 0 ? (
                  <Grid container spacing={xs ? 2 : 3}>
                    {addedProfileListLoading || contentNewsFeedLoading ? (
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
                    ) : !contentNewsFeedLoading && feeds && feeds.length > 0 ? (
                      feeds.map((feed) => (
                        <Grid item xs={12} md={6} lg={3} xl={3} key={feed._id}>
                          <div>
                            <SocialMediaPostsCard
                              pageId={feed.profile_info.social_page_id}
                              pageName={feed.profile_info.page_name}
                              pagePicture={feed.profile_info.page_picture}
                              topPostData={feed}
                              totalPageLikes={feed.profile_info.page_fan_count}
                            />
                          </div>
                        </Grid>
                      ))
                    ) : (
                      feeds &&
                      feeds.length === 0 && (
                        <div style={{ width: "100%", margin: 10 }}>
                          <div className={classes.chartFallBack}>
                            <Typography className={classes.noData} variant="h6">
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
            {!sm &&
              contentQueryParams.selectedProfiles.length > 0 &&
              selectedPostTypes.length > 0 &&
              selectProfiles.length > 0 && (
                <div className="PaginationSection">
                  <ReactPaginate
                    previousLabel={` < Previous`}
                    nextLabel={"Next >"}
                    breakLabel={"..."}
                    breakClassName={"PaginationLi"}
                    pageCount={Math.ceil(pages)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(e) => handlePageChange(e)}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"activePaginate"}
                    forcePage={page ? page - 1 : 1}
                  />
                </div>
              )}
          </Grid>
        </Container>
        {showDownloadToast && (
          <SnackBarDownload
            message={"Your download should begin in a moment"}
          />
        )}
      </div>
    </Layout>
  );
};

export default ContentNewsFeedPage;
