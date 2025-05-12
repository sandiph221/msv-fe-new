
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  makeStyles,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import CompareIcon from '@material-ui/icons/Compare';
import SearchIcon from '@material-ui/icons/Search';
import styles from "./Styles";
import ProfileDataTable from "../ProfileDataTable/ProfileDataTable";

const useStyles = makeStyles((theme) => styles(theme));

const ProfileList = ({ title }) => {
  const classes = useStyles();
  return (
    <Container className={classes.profileList}>
      <Typography className={classes.title}> {title} </Typography>
      <div className={classes.buttonGroup}>
        <div className={classes.leftButtonGroup}>
          <Button
            variant="contained"
            className={classes.buttonComp}
            startIcon={<CompareIcon />}
          >
            Compare
          </Button>
          <Button variant="contained" className={classes.buttonComp}>
            Content NewsFeed
          </Button>
        </div>
        <div className={classes.righButtonGroup}>
          <TextField
            className={classes.textField}
            hintText="Search by profile name"
            variant="outlined"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  className={classes.textFieldInput}
                  position="start"
                >
                  <SearchIcon style={{ color: "#323132" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <ProfileDataTable />
    </Container>
  );
};

export default ProfileList;
