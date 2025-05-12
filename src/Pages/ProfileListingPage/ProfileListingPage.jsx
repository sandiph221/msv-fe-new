import { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  makeStyles,
  InputAdornment,
  withStyles,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  useTheme,
  useMediaQuery,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Checkbox,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Layout from "../../Components/Layout";
import { Styles } from "./Styles";
import { useSelector, useDispatch } from "react-redux";
import {
  getAddedProfileList,
  resetSelectedProfileForCompare,
  searchAddedProfileList,
  selectProfilesToComapre,
} from "../../store/actions/SocialMediaProfileAction";
import SocialButton from "../../Components/SocialButton";
import MaterailDataTable from "../../Components/MaterialDataTable/MaterialDatatable";
import AddProfileModal from "../../Components/AddProfileModal/AddProfileModal";
import CompareIcon from "@mui/icons-material/Compare";
import { withRouter, Link } from "react-router-dom";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import TextInput from "../../Components/TextInput/TextInput";
import { CustomButton } from "../../Components/CustomButton/CustomButton";
import { SnackBar } from "../../Components/SnackBar/SnackBar";
import Spinner from "../../Components/Spinner";
import CustomDataTable from "../../Components/MaterialDataTable/CustomDataTable";
import FilterDays from "../../Components/FilterDays";

const useStyles = makeStyles((theme) => Styles(theme));

//Styled menu
const StyledSelect = withStyles({
  root: {
    padding: 8,
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

const ProfileListingPage = ({ history }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const dispatch = useDispatch();
  const classes = useStyles({ xs });
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [searchProfile, setSearchProfile] = React.useState("");
  const {
    addedProfileList,
    activeSocialMediaType,
    addedProfileListLoading,
    searchedAddedProfilesList,
    profilesListForCompareLoading,
    selectedProfilesListToComapre,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);
  const [openPost, setOpenPosts] = React.useState(false);
  let filterDataLabels = [
    { title: "Total Fans", mobileTitle: "Fans", key: "fan_count" },
    {
      title: "Relative Change in Total Fans",
      mobileTitle: "Change in Fans",
      key: "relative_fan_change",
    },
    { title: "Shares", mobileTitle: "Shares", key: "shares_count" },
    { title: "Comment Count", mobileTitle: "Comments", key: "comments_count" },
    { title: "Post Counts", mobileTitle: "Posts", key: "posts_count" },
    {
      title: "Sum of Interactions",
      mobileTitle: "Interactions",
      key: "interactions_count",
    },
    {
      title: "Average Interaction per 1k Fans",
      mobileTitle: "Avg Interactions",
      key: "interaction_per_1k_fans",
    },
    {
      title: "Average Interaction per post",
      mobileTitle: "Avg Interactions / Post",
      key: "avg_interaction_per_post",
    },
    {
      title: "Average Interaction per 1k Fans per Post",
      mobileTitle: "Avg Interactions / 1k Fan / Post",
      key: "avg_interaction_per_1k_fans_per_post",
    },
  ];
  if (activeSocialMediaType === "instagram") {
    filterDataLabels = [
      { title: "Total Fans", mobileTitle: "Fans", key: "fan_count" },
      {
        title: "Relative Change in Total Fans",
        mobileTitle: "Change in Fans",
        key: "relative_fan_change",
      },
      {
        title: "Comment Count",
        mobileTitle: "Comments",
        key: "comments_count",
      },
      { title: "Post Counts", mobileTitle: "Posts", key: "posts_count" },
      {
        title: "Sum of Interactions",
        mobileTitle: "Interactions",
        key: "interactions_count",
      },
      {
        title: "Average Interaction per 1k Fans",
        mobileTitle: "Avg Interactions",
        key: "interaction_per_1k_fans",
      },
      {
        title: "Average Interaction per post",
        mobileTitle: "Avg Interactions / Post",
        key: "avg_interaction_per_post",
      },
      {
        title: "Average Interaction per 1k Fans per Post",
        mobileTitle: "Avg Interactions / 1k Fan / Post",
        key: "avg_interaction_per_1k_fans_per_post",
      },
    ];
  }
  const [selectedPostTypes, setSelectedPostTypes] =
    React.useState(filterDataLabels);

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

  React.useEffect(() => {
    //checking internet connection

    var condition = navigator.onLine ? "online" : "offline";

    if (condition === "offline") {
      toast.error("No internet connection");
    }
  }, [addedProfileList, activeSocialMediaType]);

  /* getting added profile list on component did mount */
  React.useEffect(() => {
    dispatch(getAddedProfileList());
  }, [activeSocialMediaType, customDateRangeRed]);

  React.useEffect(() => {
    dispatch(resetSelectedProfileForCompare()); // reset selected profiles list for compare
  }, [activeSocialMediaType]);

  /* search handle from profiles added list */
  const searchAddedProfile = async (e) => {
    dispatch(
      getAddedProfileList(e.target.value)
    ); /* action dispatch for api calls */
    setSearchProfile(e.target.value);
  };

  /* get seleted profiles list from child component */
  const getSelectedProfile = (profiles) => {
    setSelectedProfiles(profiles);
  };

  /* select profiles list to comapare on click */
  const selectProfiles = (page) => {
    if (page === "compare") {
      if (
        selectedProfiles.length >= 2 ||
        selectedProfilesListToComapre.length !== 0
      ) {
        dispatch(selectProfilesToComapre(selectedProfiles));
        history.push("/profile-comparison");
      } else {
        toast.error("Select at least two or more profiles.");
      }
    } else if (page === "content") {
      dispatch(selectProfilesToComapre(selectedProfiles));
      history.push("/content-newsfeed");
    }
  };

  //select data label option functions
  const handlePostsOpen = () => {
    setOpenPosts(true);
  };

  const handlePostsClose = () => {
    setOpenPosts(false);
  };
  //update selcted profiles

  const updateSelectedPosts = (value, checked) => {
    setOpenPosts(true);
    let selectedPostId = selectedPostTypes.map((s) => s.key);
    if (checked) {
      selectedPostId = [...selectedPostId, value.key];
      // setSelectedPostTypes([...selectedPostTypes, value])
    } else {
      selectedPostId = selectedPostId.filter((s) => s !== value.key);
    }
    const filteredPostType = filterDataLabels.filter((s) =>
      selectedPostId.includes(s.key)
    );
    setSelectedPostTypes(filteredPostType);
  };

  const postTypeIsChecked = (postType) => {
    const [checkedData] = selectedPostTypes.filter(
      (s) => s.key === postType.key
    );
    if (checkedData) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div className={classes.tabHeaderComp}>
          <SocialButton />
          <div>
            <FilterDays xs={xs} />
          </div>
        </div>
        <PageTitle />
        <div
          style={{
            display: xs ? "block" : "flex",
            justifyContent: "space-between",
            padding: xs ? "0px 10px" : "0px 40px",
            alignItems: "baseline",
            width: "100%",
            marginTop: 10,
          }}
        >
          <div
            style={{ display: xs ? "flex" : "block" }}
            className={classes.customButton}
          >
            <CustomButton
              startIcon={<CompareIcon />}
              onClick={() => selectProfiles("compare")}
            >
              Compare
            </CustomButton>
            {"     "}
            <CustomButton onClick={() => selectProfiles("content")}>
              Content Newsfeed
            </CustomButton>
          </div>

          <div
            style={{
              width: xs ? "100%" : "35%",
              display: xs ? "block" : "flex",
              justifyContent: "center",
            }}
          >
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
                >
                  {" "}
                  Select labels
                </StyledInputLabel>

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
                  {filterDataLabels.length > 0 ? (
                    filterDataLabels.map((postType) => (
                      <StyledMenuItem
                        key={postType.key}
                        value={postType.key}
                        selected={true}
                        style={{
                          background: postTypeIsChecked(postType)
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
                              updateSelectedPosts(postType, e.target.checked)
                            }
                            checked={postTypeIsChecked(postType)}
                          />
                          <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                            {" "}
                            {postType.title}{" "}
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
            <TextInput
              placeholder="Search"
              onChange={searchAddedProfile}
              backgroundColor
            />
          </div>
        </div>
        <div
          className={classes.profileListComponent}
          style={{
            width: "100%",
            padding: xs ? "20px 10px" : "20px 40px",
            height: "auto",
          }}
        >
          <div>
            <div className="profileTable" id="profile-list-table">
              {/* <MaterailDataTable
                data={addedProfileList}
                getSelectedProfileList={(profiles) =>
                  getSelectedProfile(profiles)
                }
                loader={addedProfileListLoading}
                selectedLabels={selectedPostTypes}
              /> */}
              <CustomDataTable
                data={addedProfileList}
                loader={addedProfileListLoading}
                selectedLabels={selectedPostTypes}
                allLabels={filterDataLabels}
                getSelectedProfileList={(profiles) =>
                  getSelectedProfile(profiles)
                }
              />
              {addedProfileList && addedProfileList.length === 0 && (
                <Typography style={{ textAlign: "center", marginTop: 30 }}>
                  No records found
                </Typography>
              )}
            </div>
            <AddProfileModal />
          </div>
        </div>
      </Grid>
      {!addedProfileListLoading &&
        addedProfileList &&
        addedProfileList.length > 0 && <SnackBar data={addedProfileList} />}
    </Layout>
  );
};

export default withRouter(ProfileListingPage);
