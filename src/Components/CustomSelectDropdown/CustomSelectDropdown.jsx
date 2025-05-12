import { useMediaQuery, useTheme } from "@mui/material";
import {
  Avatar,
  FormControl,
  Typography,
  withStyles,
  MenuItem,
  makeStyles,
  InputLabel,
  Select,
} from "@mui/material";

import { formatImage } from "utils/functions.js";
import { Styles } from "./Styles";

const StyledMenuItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#FFF8DE",
    },
  },
})(MenuItem);

const StyledSelect = withStyles({
  root: {
    padding: 8,
    border: "1px solid #BDBDBD",
  },
})(Select);

const useStyles = makeStyles((theme) => Styles(theme));

export const CustomSelectDropdown = ({
  selectProfile,
  selectProfileHandleChange,
  addedProfileList,
  subdomain,
  activeSocialMediaType,
}) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles({ sm });

  //menuProps for select dropdown component
  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    getContentAnchorEl: null,
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label"></InputLabel>
      <StyledSelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="outlined"
        displayEmpty={true}
        MenuProps={menuProps}
        value={selectProfile}
        onChange={selectProfileHandleChange}
        style={{ fontSize: 15, fontWeight: 600, padding: "13px !important" }}
      >
        {addedProfileList && addedProfileList.length > 0 ? (
          addedProfileList.map((addedProfileList) => (
            <StyledMenuItem
              value={addedProfileList.id}
              selected={true}
              key={addedProfileList.id}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Avatar
                  src={formatImage(
                    activeSocialMediaType,
                    subdomain,
                    addedProfileList.picture
                  )}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                  }}
                />{" "}
                <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                  {" "}
                  {addedProfileList.name}{" "}
                </Typography>{" "}
              </div>
            </StyledMenuItem>
          ))
        ) : (
          <StyledMenuItem selected={true} value="">
            {" "}
            <Typography style={{ fontSize: 15, fontWeight: 600 }}>
              No Data Available
            </Typography>{" "}
          </StyledMenuItem>
        )}
      </StyledSelect>
    </FormControl>
  );
};
