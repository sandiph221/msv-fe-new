import { useEffect, useState } from "react";
import {
  makeStyles,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { socialMediaType } from "../../store/actions/SettingActions";
import fbIcon from "../../assets/images/facebook.png";
import instaIcon from "../../assets/images/insta-icon.png";
import { setActiveSocialMediaType } from "../../store/actions/SocialMediaProfileAction";
const useStyles = makeStyles((theme) => ({
  socialBtnContainer: {
    width: "auto",
  },
  socialBtnIcon: {
    height: "25px",
  },
  fbBtn: {
    background: "red",
  },
  dropDowninputLabel: {
    outlined: {
      backgroundColor: "red",
    },
  },
  dropDownSelect: {
    "& .MuiSelect-root": {
      backgroundColor: "red",
      "&.MuiOutlinedInput-input ": {
        padding: "7px 20px",
        width: 30,
      },
    },
  },
}));

const SocialButton = ({ socialListening }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const { activeSocialMediaType, addedProfileListLoading } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const handleClick = (socialMediaType) => {
    if (activeSocialMediaType !== socialMediaType) {
      dispatch(setActiveSocialMediaType(socialMediaType));
    }
  };

  useEffect(() => {
    if (socialListening && activeSocialMediaType !== "instagram") {
      dispatch(setActiveSocialMediaType("instagram"));
    }
  }, [socialListening]);

  const handleChange = (e) => {
    if (activeSocialMediaType !== e.target.value) {
      dispatch(setActiveSocialMediaType(e.target.value));
    }
  };

  //menuProps for select dropdown component
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

  return (
    <Grid className={classes.socialBtnContainer} container direction="row">
      {xs ? (
        <div>
          <FormControl className={classes.margin} variant="outlined">
            <InputLabel
              id="demo-customized-select-label"
              className={classes.dropDowninputLabel}
            ></InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={activeSocialMediaType}
              onChange={handleChange}
              className={classes.dropDownSelect}
              MenuProps={menuProps}
            >
              <MenuItem value="instagram">
                <img className={classes.socialBtnIcon} src={instaIcon} alt="" />
              </MenuItem>
              <MenuItem value="facebook">
                <img className={classes.socialBtnIcon} src={fbIcon} alt="" />
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      ) : (
        <>
          <Box>
            <Button
              id={classes.instaBtn}
              disableElevation
              style={{
                textTransform: "capitalize",
                marginRight: 15,
                fontWeight: 600,
                fontSize: 15,
                backgroundColor:
                  activeSocialMediaType === "instagram" ? "#FFEFF1" : "",
              }}
              disabled={addedProfileListLoading}
              onClick={() => handleClick("instagram")}
              name="instagram"
            >
              <img className={classes.socialBtnIcon} src={instaIcon} alt="" />
            </Button>
          </Box>
          <Box>
            <Button
              id={classes.fbBtn}
              disableElevation
              style={{
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: 15,
                backgroundColor:
                  activeSocialMediaType === "facebook"
                    ? "rgb(22, 119, 242, 0.2)"
                    : "",
              }}
              onClick={() => handleClick("facebook")}
              disabled={
                addedProfileListLoading || socialListening ? true : false
              }
            >
              <img className={classes.socialBtnIcon} src={fbIcon} alt="" />
            </Button>
          </Box>
        </>
      )}
    </Grid>
  );
};

export default SocialButton;
