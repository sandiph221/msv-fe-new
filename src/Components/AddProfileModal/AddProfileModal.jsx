import { useEffect } from "react";
import { makeStyles, useTheme, withStyles } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Spinner from "../Spinner";
import {
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addProfileList,
  searchSocialMediaProfiles,
} from "../../store/actions/SocialMediaProfileAction";
import SearchIcon from "@mui/icons-material/Search";
import noResultFoundImg from "../../assets/images/noResultFound.png";
import * as constant from "../../utils/constant";
import { OutlinedInput } from "@mui/material";
import { Checkbox } from "@mui/material";
import TextInput from "../TextInput/TextInput";
import { CustomButton } from "../CustomButton/CustomButton";
import TextInputProfile from "../TextInput/TextInputProfile";
import { formatImage, formatNumber } from "utils/functions.js";

const styles = (theme) => ({
  root: {
    margin: 0,
    marginBottom: 30,
    display: "flex",
    justifyContent: "space-between",
    padding: 0,
  },
});
const useStyles = makeStyles((theme) => ({
  btnPrimary: {
    fontSize: 15,
    color: "#323132",
    fontWeight: 600,
    borderRadius: 4,
    padding: "12px 50px",
    marginTop: 20,
    "&:hover": {
      backgroundColor: "#f4d45f",
      borderColor: "#f4d45f",
    },
  },
}));

/* styled component starts */
/* styled buuton for materail ui dialog component */
const StyledDialog = withStyles({
  paper: {
    width: (props) => (props.view ? "100%" : "50%"),
    padding: (props) => (props.xs ? 20 : "26px 40px 37px 40px"),
    height: "auto",
    margin: 0,
    boxShadow: "none",
  },
})(Dialog);

/* styled component for materail ui dialogTitle component */
const DialogTitle = withStyles(styles)((props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      marginBottom: 10,
      display: "flex",
      justifyContent: "space-between",
      padding: 0,
    },
  }));
  const { children, classes, onClose, ...other } = props;
  const classes1 = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes1.root} {...other}>
      <Typography style={{ fontSize: 24, color: "#323132" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon style={{ color: "#323132" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

/* styled component for materail ui dialogContent component */
const DialogContent = withStyles((theme) => ({
  root: {
    border: "none",
    marginTop: 0,
    padding: 0,
    height: 335,
    position: "relative",
  },
}))(MuiDialogContent);

/* styled component for materail ui dialogAction component */
const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 20,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    width: "19.4%",
  },
}))(MuiDialogActions);

/* styled component for materail ui button component */

const StyledTableCell = withStyles({
  root: {
    padding: "8px 0px",
    borderTop: "1px solid #E8E8E8",
    borderBottom: "1px solid #E8E8E8",
  },
})(TableCell);

/* styled component ends */

export default function AddProfileModal() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const [mobileView, setMobileView] = React.useState(false);
  const [closeBox, setCloseBox] = React.useState(false);
  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setMobileView((prevState) => ({ ...prevState, mobileView: true }))
        : setMobileView((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [profileListToAdd, setProfileListToAdd] = React.useState([]);
  const [initialProfileListToAdd, setInitialProfileListToAdd] = React.useState(
    []
  );
  const {
    searchedProfileList,
    addedProfileList,
    searchLoading,
    activeSocialMediaType,
    getComparisionProfileError,
  } = useSelector((state) => state.socialMediaProfileListReducer);
  const { user } = useSelector((state) => state.auth);
  const { CustomerSubdomain } = user;

  let subdomain = CustomerSubdomain.subdomain;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setProfileListToAdd([]); /* setting local state to empty after submitting */
  };
  /* text field close btn on click handling */
  const closeBtnClick = () => {
    setSearchQuery("");
  };
  useEffect(() => {
    /* handling submit on pressing enter */
    const listener = (event) => {
      if (
        event.code === constant.ENTER_PAD ||
        event.code === constant.ENTER_NUM_PAD
      ) {
        searchClick();
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [searchQuery]);

  const searchClick = () => {
    if (searchQuery) {
      dispatch(searchSocialMediaProfiles(searchQuery));
    }
  };

  /* searching socail media profiles list */
  const searchProfilesList = (event) => {
    if (event) {
      setCloseBox(true);
      setSearchQuery(
        event.target.value
      ); /* setting state value in local component  */
    }
    /* dispatching actions for api calls */
  };

  /* handle checkbox */
  const profileListToAddId = profileListToAdd.map((data) => data.id);
  const checkboxHandle = (profileList, e) => {
    if (e.target.checked) {
      setInitialProfileListToAdd((prevState) => [...prevState, profileList]);
    } else {
      setInitialProfileListToAdd(
        initialProfileListToAdd.filter(
          (profile) => profile.id !== profileList.id
        )
      );
    }
  };
  /* handle add initial profile list  */
  const addInitialProfile = (event) => {
    event.preventDefault();
    setProfileListToAdd(profileListToAdd.concat(initialProfileListToAdd));
    setCloseBox(false);
    setSearchQuery("");
    setInitialProfileListToAdd([]);
  };

  /* emply initial profiles list when search filed has no value */
  useEffect(() => {
    if (searchQuery == "") {
      setInitialProfileListToAdd([]);
      dispatch(searchSocialMediaProfiles(""));
    }
  }, [searchQuery]);

  /* adding profile list in local state component*/
  const handleAddProfile = (data) => {
    setProfileListToAdd((prevState) => [...prevState, data]);
  };

  /* deleting profile list from local state component*/
  const handleDelete = (data) => {
    const deleteItem = profileListToAdd.filter(
      (profiles) => profiles.id !== data.id
    ); /* deleting profiles */
    setProfileListToAdd(deleteItem);
  };

  /* adding list of profiles  */
  const addProfilesToCompare = (e) => {
    e.preventDefault();
    dispatch(
      addProfileList(profileListToAdd)
    ); /* dispatching actions for api call */
    setOpen(false);
    setSearchQuery("");
    setProfileListToAdd([]); /* setting local state to empty after submitting */
  };

  const socialMedaiProfileList = profileListToAdd.filter(
    (ele, ind) =>
      ind === profileListToAdd.findIndex((elem) => elem.id === ele.id)
  );
  return (
    <div
      id="dialog-component"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div style={{ marginTop: 37 }}>
        <CustomButton
          backgroundColor
          onClick={handleClickOpen}
          startIcon={<AddCircleOutlineIcon />}
          disabled={user.role === constant.CUSTOMER_VIEWER_NAME ? true : false}
        >
          Add Profile
        </CustomButton>
      </div>
      <div>
        <StyledDialog
          id="styled-dialog"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          maxWidth="xl"
          view={mobileView.mobileView}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            <Typography style={{ fontWeight: 600, fontSize: 24 }}>
              {" "}
              Add Profile{" "}
            </Typography>
          </DialogTitle>
          <TextInputProfile
            radius={searchQuery && closeBox ? true : false}
            value={searchQuery}
            closeBtn={searchQuery ? true : false}
            onChange={(e) => searchProfilesList(e)}
            placeholder="Search by name or URL of Social Profile you would like to monitor"
            onClick={closeBtnClick}
            iconPosition={true}
            searchClick={searchClick}
          />
          <DialogContent dividers>
            {profileListToAdd.length > 0 && (
              <TableContainer
                style={{
                  marginTop: 10,
                  opacity:
                    searchQuery &&
                    searchedProfileList &&
                    searchedProfileList.length !== 0 &&
                    closeBox
                      ? 0.6
                      : 1,
                }}
              >
                <Table aria-label="simple table">
                  <TableHead></TableHead>
                  {profileListToAdd.length > 0 &&
                    socialMedaiProfileList.map((profilesList, index) => (
                      <TableRow
                        key={profilesList.id}
                        style={{
                          margin: "0px 10px",
                          /* displaying background color if profile list is already added */
                          backgroundColor: profilesList.is_already_added
                            ? "#FFF8DE"
                            : "",
                          opacity:
                            CustomerSubdomain.social_media_profiles_limit -
                              addedProfileList.length <=
                            index
                              ? 0.6
                              : 1,
                        }}
                      >
                        <StyledTableCell
                          align="left"
                          padding={xs ? "none" : "default"}
                          style={{ width: xs ? "70%" : "normal" }}
                        >
                          <div style={{ display: "flex" }}>
                            {" "}
                            <Avatar
                              src={formatImage(
                                activeSocialMediaType,
                                subdomain,
                                profilesList.profile_picture_url
                              )}
                              style={{
                                width: xs ? 36 : 44,
                                height: xs ? 36 : 44,
                                border: "1px solid #E0E0E0",
                              }}
                            />{" "}
                            <div
                              style={{
                                alignSelf: "center",
                                marginLeft: "20px",
                              }}
                            >
                              <div>
                                <Typography
                                  style={{
                                    color: "#323132",
                                    fontWeight: 600,
                                    fontSize: xs ? 12 : 15,
                                  }}
                                >
                                  {" "}
                                  {profilesList.name}{" "}
                                </Typography>{" "}
                                <Typography
                                  style={{
                                    color: " #757575",
                                    fontSize: xs ? 8 : 10,
                                  }}
                                >
                                  {" "}
                                  {profilesList.username}{" "}
                                </Typography>{" "}
                              </div>
                              <div>
                                <Typography
                                  color="error"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 10,
                                  }}
                                >
                                  {" "}
                                  {CustomerSubdomain.social_media_profiles_limit -
                                    addedProfileList.length <=
                                  index
                                    ? "Profile limit reached"
                                    : ""}{" "}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </StyledTableCell>

                        <StyledTableCell
                          align="left"
                          padding={xs ? "none" : "default"}
                          style={{ width: xs ? "25%" : "normal" }}
                        >
                          {" "}
                          <div>
                            <div>
                              <Typography
                                style={{ color: "#757575", fontSize: 14 }}
                              >
                                {" "}
                                Total Fans{" "}
                              </Typography>{" "}
                              <Typography
                                style={{
                                  color: "#323132",
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                {" "}
                                {formatNumber(
                                  profilesList.fan_count ??
                                    profilesList.followers_count
                                )}{" "}
                              </Typography>{" "}
                            </div>
                          </div>
                        </StyledTableCell>

                        <StyledTableCell
                          align="center"
                          style={{ padding: xs ? 0 : "normal" }}
                        >
                          {
                            /*  */
                            (addedProfileList &&
                              addedProfileList.find(
                                (profile) =>
                                  parseInt(profile.social_page_id) ===
                                  profilesList.id
                              )) ||
                            profileListToAdd.find(
                              (profile) => profile.id === profilesList.id
                            ) ? (
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(profilesList)}
                                disabled={
                                  searchQuery && searchedProfileList
                                    ? true
                                    : false
                                }
                              >
                                {profilesList.is_already_added ? (
                                  <Typography
                                    style={{ fontSize: 13, fontWeight: 600 }}
                                    color="error"
                                  >
                                    Already Added
                                  </Typography>
                                ) : (
                                  <RemoveCircleOutlineOutlinedIcon color="error" />
                                )}
                              </IconButton>
                            ) : (
                              <IconButton
                                aria-label="add"
                                onClick={() =>
                                  handleAddProfile({
                                    ...profilesList,
                                    picture:
                                      profilesList.picture ??
                                      profilesList.profile_picture_url,
                                  })
                                }
                              >
                                <AddCircleOutlineIcon
                                  style={{ color: "#323132" }}
                                />
                              </IconButton>
                            )
                          }
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </Table>
              </TableContainer>
            )}

            <Paper
              style={{
                border: "1px solid #BDBDBD",
                borderRadius:
                  searchQuery && closeBox ? "0px 0px 4px 4px" : "4px",
                borderTop: 0,
                height: "100%",
                display: searchQuery && closeBox ? "flex" : "none",
                flexDirection: "column",
                padding: "10px 10px 0px 10px",
                overflow: "auto",
                position: "absolute",
                top: 0,
                width: "100%",
                backgroundColor: "#fff",
              }}
            >
              {
                searchLoading && (
                  <Spinner size={30} />
                ) /* showing loader if the loading value is true */
              }
              {getComparisionProfileError && (
                <p
                  style={{
                    alignSelf: "center",
                    background: "#e74c3c",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                >
                  {getComparisionProfileError}
                </p>
              )}
              {searchQuery &&
              !searchLoading &&
              searchedProfileList &&
              searchedProfileList.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    component="div"
                    style={{
                      fontSize: 12,
                      color: "#bdbdbd",
                      alignSelf: "center",
                    }}
                  >
                    {" "}
                    Sorry no result found
                  </Typography>
                </div>
              ) : (
                !searchLoading &&
                searchedProfileList &&
                searchedProfileList.length > 0 &&
                searchedProfileList.map((profilesList) => (
                  <div
                    key={profilesList.id}
                    style={{
                      display: "flex",
                      minHeight: 45,
                    }}
                  >
                    <input
                      type="checkbox"
                      disabled={profilesList.is_already_added ? true : false}
                      onChange={(e) => checkboxHandle(profilesList, e)}
                      inputProps={{ "aria-label": "primary checkbox" }}
                      style={{ flexBasis: "5%", alignSelf: "center" }}
                      value={profilesList.profile_name}
                    />
                    <div style={{ display: "flex", margin: "0px 10px" }}>
                      {" "}
                      <Avatar
                        src={formatImage(
                          activeSocialMediaType,
                          subdomain,
                          profilesList.profile_picture_url
                        )}
                        style={{
                          width: xs ? 18 : 34,
                          height: xs ? 18 : 34,
                          border: "1px solid #BDBDBD",
                        }}
                      />{" "}
                      <div style={{ marginLeft: 10 }}>
                        <Typography
                          style={{
                            alignSelf: "center",
                            color: "#323132",
                            fontWeight: 600,
                            fontSize: xs ? 8 : 14,
                          }}
                        >
                          {" "}
                          {profilesList.name ?? profilesList.username}{" "}
                        </Typography>{" "}
                        <Typography
                          style={{
                            color: " #757575",
                            fontSize: xs ? 8 : 10,
                          }}
                        >
                          {" "}
                          {profilesList.username}{" "}
                        </Typography>
                      </div>
                    </div>
                    {(profilesList.fan_count ??
                      profilesList.followers_count) && (
                      <div
                        style={{
                          display: "flex",
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          style={{
                            color: "#757575",
                            fontSize: 12,
                            marginRight: 6,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {" "}
                          Total Fans{" "}
                        </Typography>{" "}
                        <Typography
                          style={{
                            color: "#323132",
                            fontWeight: 600,
                            fontSize: 10,
                          }}
                        >
                          {" "}
                          (
                          {formatNumber(
                            profilesList.fan_count ??
                              profilesList.followers_count
                          )}
                          ){" "}
                        </Typography>{" "}
                      </div>
                    )}
                    {profilesList.is_already_added && (
                      <div
                        style={{
                          borderRadius: 4,
                          padding: 4,
                          marginLeft: 30,
                          textAlign: "end",
                        }}
                      >
                        <Typography style={{ fontSize: 10, color: "#FF3434" }}>
                          Already Added
                        </Typography>
                      </div>
                    )}
                  </div>
                ))
              )}

              {initialProfileListToAdd.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    position: "sticky",
                    bottom: "0px",
                    backgroundColor: "#fff",
                    padding: "15px 0px",
                    zIndex: 99999999,
                    marginTop: 20,
                  }}
                >
                  <div style={{ width: "11%", alignSelf: "center" }}>
                    <CustomButton
                      width
                      initialProfileAdd
                      defaultBackgroundColor
                      onClick={addInitialProfile}
                    >
                      {`ok (${initialProfileListToAdd.length})`}
                    </CustomButton>
                  </div>
                </div>
              )}
            </Paper>
          </DialogContent>
          <DialogActions>
            <div id="dialog-action">
              <CustomButton
                disabled={
                  CustomerSubdomain.social_media_profiles_limit -
                    addedProfileList.length >=
                    profileListToAdd.length && profileListToAdd.length > 0
                    ? false
                    : true
                }
                defaultBackgroundColor
                onClick={addProfilesToCompare}
              >
                Done
              </CustomButton>
            </div>
          </DialogActions>
        </StyledDialog>
      </div>
    </div>
  );
}
