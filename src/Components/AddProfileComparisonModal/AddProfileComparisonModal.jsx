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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddedProfileList,
  selectProfilesToComapre,
} from "../../store/actions/SocialMediaProfileAction";
import noResultFoundImg from "../../assets/images/noResultFound.png";
import * as constant from "../../utils/constant";
import { CustomButton } from "../CustomButton/CustomButton";
import TextInput from "../TextInput/TextInput";
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

/* styled component starts */
/* styled buuton for materail ui dialog component */
const StyledDialog = withStyles({
  paper: {
    width: (props) => (props.view ? "100%" : "46%"),
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
    marginTop: 10,
    padding: 0,
    height: 335,
    position: "relative",
  },
}))(MuiDialogContent);

/* styled component for materail ui dialogAction component */
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
  },
}))(MuiDialogActions);

/* styled component for materail ui button component */
const StyledButton = withStyles({
  root: {
    border: (props) => (props.profile ? "1px solid #BDBDBD" : "none"),
    height: "100%",
    "&:hover": {
      backgroundColor: (props) => (props.profile ? "#FBE281" : "transparent"),
      border: (props) => (props.profile ? "1px solid #fff" : "none"),
    },
  },
  label: {
    color: "#323132",
  },
})(Button);

/* styled component ends */

export default function AddProfileComaprisonModal({ profile }) {
  const dispatch = useDispatch();
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
  const [open, setOpen] = React.useState(false);
  const [inputCloseBtn, setInputCloseBtn] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [profileListToAdd, setProfileListToAdd] = React.useState([]);
  const {
    selectedProfilesListToComapre,
    addedProfileList,
    addedProfileListLoading,
    activeSocialMediaType,
  } = useSelector((state) => state.socialMediaProfileListReducer);
  const { user } = useSelector((state) => state.auth);
  let subdomain = user.CustomerSubdomain.subdomain;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setProfileListToAdd([]); /* setting local state to empty after submitting */
    setInputCloseBtn(false);
  };

  /* searching socail media profiles list */
  const searchProfilesList = async (event) => {
    event.preventDefault();
    if (event) {
      setSearchLoading(true);
      await setSearchQuery(
        event.target.value
      ); /* setting state value in local component  */

      await dispatch(
        getAddedProfileList(event.target.value)
      ); /* dispatching actions for api calls */

      setSearchLoading(false);
      setInputCloseBtn(false);
    }
  };

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
      selectProfilesToComapre(profileListToAdd)
    ); /* dispatching actions for api call */
    setOpen(false);
    setSearchQuery("");
    setProfileListToAdd([]); /* setting local state to empty after submitting */
  };
  /* text field close btn on click handling */
  const closeBtnClick = async () => {
    setSearchQuery("");
    await dispatch(getAddedProfileList(""));
  };

  useEffect(async () => {
    setSearchQuery("");
    await dispatch(getAddedProfileList(""));
  }, [open]);

  return (
    <>
      <StyledButton
        variant="outlined"
        color="default"
        onClick={handleClickOpen}
        startIcon={<AddCircleOutlineIcon />}
        disabled={user.role === constant.CUSTOMER_VIEWER_NAME ? true : false}
        profile={profile}
      >
        Add Profile
      </StyledButton>
      <StyledDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xl"
        view={mobileView.mobileView}
        xs
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography style={{ fontWeight: 600, fontSize: 24 }}>
            {" "}
            Add Profile{" "}
          </Typography>
        </DialogTitle>
        {/* <TextField
          id="searchProfile"
          type="text"
          onChange={searchProfilesList}
          variant="outlined"
          placeholder="Search URL or Profile Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#323132" }} />
              </InputAdornment>
            ),
          }}
          style={{ height: "35px" }}
        /> */}
        <TextInput
          closeBtn={searchQuery ? true : false}
          value={searchQuery}
          onChange={searchProfilesList}
          placeholder="Search by name or URL of Social Profile you would like to monitor"
          onClick={closeBtnClick}
        />

        <DialogContent dividers>
          {addedProfileListLoading ? (
            <Spinner />
          ) : /* showing loader if the loading value is true */
          !addedProfileListLoading &&
            searchQuery &&
            addedProfileList.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <img alt="results not found" src={noResultFoundImg} />
              <Typography> Sorry no result found</Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead></TableHead>
                <TableBody>
                  {
                    /* displaying data as soon the search query is true and loading is false */

                    addedProfileList &&
                      addedProfileList.length !== 0 &&
                      addedProfileList.map((profilesList) => (
                        <TableRow
                          key={profilesList.id}
                          style={{
                            /* displaying background color if profile list is already added */
                            backgroundColor: selectedProfilesListToComapre.find(
                              (profile) => profile.id === profilesList.id
                            )
                              ? "#FFF8DE"
                              : "",
                          }}
                        >
                          <TableCell
                            align="left"
                            padding={xs ? "none" : "default"}
                            style={{ width: xs ? "70%" : "normal" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                marginLeft: xs ? 10 : "initial",
                              }}
                            >
                              {" "}
                              <Avatar
                                src={formatImage(
                                  activeSocialMediaType,
                                  subdomain,
                                  profilesList.picture
                                )}
                                style={{
                                  width: xs ? 30 : 44,
                                  height: xs ? 30 : 44,
                                }}
                              />{" "}
                              <Typography
                                style={{
                                  alignSelf: "center",
                                  marginLeft: xs ? 10 : 20,
                                  color: "#323132",
                                  fontWeight: 600,
                                  fontSize: xs ? 10 : 15,
                                }}
                              >
                                {" "}
                                {profilesList.name}{" "}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell
                            align="left"
                            padding={xs ? "none" : "default"}
                            style={{ width: xs ? "25%" : "normal" }}
                          >
                            {" "}
                            <div>
                              <Typography
                                style={{
                                  color: "#757575",
                                  fontSize: xs ? 10 : 14,
                                }}
                              >
                                {" "}
                                Total Fans{" "}
                              </Typography>{" "}
                              <Typography
                                style={{
                                  color: "#323132",
                                  fontWeight: 600,
                                  fontSize: xs ? 10 : 14,
                                }}
                              >
                                {" "}
                                {formatNumber(profilesList.fan_count)}{" "}
                              </Typography>{" "}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ padding: xs ? 0 : "normal" }}
                          >
                            {
                              /*  */
                              selectedProfilesListToComapre.find(
                                (profile) => profile.id === profilesList.id
                              ) ||
                              profileListToAdd.find(
                                (profile) => profile.id === profilesList.id
                              ) ? (
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleDelete(profilesList)}
                                  disabled={
                                    selectedProfilesListToComapre.find(
                                      (addedprofile) =>
                                        parseInt(addedprofile.id) ===
                                        profilesList.id
                                    )
                                      ? true
                                      : false
                                  }
                                >
                                  {selectedProfilesListToComapre.find(
                                    (profile) => profile.id === profilesList.id
                                  ) ? (
                                    <Typography
                                      style={{
                                        fontSize: xs ? 10 : 13,
                                        fontWeight: 600,
                                      }}
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
                                  onClick={() => handleAddProfile(profilesList)}
                                >
                                  <AddCircleOutlineIcon
                                    style={{ color: "#323132" }}
                                  />
                                </IconButton>
                              )
                            }
                          </TableCell>
                        </TableRow>
                      ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {}
        </DialogContent>
        <DialogActions>
          <CustomButton defaultBackgroundColor onClick={addProfilesToCompare}>
            Done
          </CustomButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
}
