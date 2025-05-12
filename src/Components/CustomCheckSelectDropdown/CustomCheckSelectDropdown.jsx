import {
  makeStyles,
  FormControl,
  Checkbox,
  Typography,
  withStyles,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";

import { Styles } from "./Styles";

const useStyles = makeStyles((theme) => Styles(theme));

  
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

export const CustomCheckSelectDropdown = ({
  selectedPostTypes,
  handlePostsClose,
  handlePostsOpen,
  openPost,
  postTypes,
  updateSelectedPosts,
}) => {
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

  
  const classes = useStyles();


  return (
    <FormControl
    className={classes.formControl}
     
    >
      {selectedPostTypes && selectedPostTypes.length === postTypes.length ? (
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

      <Select
        labelId="demo-simple-select-label"
        variant="outlined"
        displayEmpty={false}
        value=""
        open={openPost}
        onClose={handlePostsClose}
        onOpen={handlePostsOpen}
        MenuProps={menuProps}
        className={classes.select}
      >
        {postTypes && postTypes.length > 0 ? (
          postTypes.map((postType) => (
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
                    updateSelectedPosts(postType, e.target.checked)
                  }
                  checked={selectedPostTypes.indexOf(postType) > -1}
                />
                <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                  {" "}
                  {postType}{" "}
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
      </Select>
    </FormControl>
  );
};
