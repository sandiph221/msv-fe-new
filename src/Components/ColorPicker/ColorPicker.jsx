import { Typography, useTheme, useMediaQuery, makeStyles } from "@mui/material";
import { useEffect, useState } from "react";
import { PhotoshopPicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileColor } from "../../store/actions/SocialMediaProfileAction";
import { Styles } from "./Styles";

const useStyles = makeStyles((theme) => Styles(theme));

export const ColorPicker = ({ selectProfile, getColors }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [displayColorPicker, setDisplayColorpicker] = useState(false);
  const [color, setColor] = useState("");
  const [acceptColor, setAcceptColor] = useState("");

  const { addedProfileList } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const colorRef = React.useRef();
  const showPicker = () => {
    // diplay color picker
    setDisplayColorpicker(true);
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };
  const handleAccept = () => {
    setDisplayColorpicker(false);
    setAcceptColor(color);
    dispatch(updateProfileColor(selectProfile, color));
  };
  useEffect(() => {
    if (selectProfile) {
      const filteredData = addedProfileList.find(
        (data) => data.id === selectProfile
      );
      setColor(filteredData ? filteredData.color : "");
    }
  }, [selectProfile]);

  useEffect(() => {
    if (acceptColor) {
      getColors(acceptColor);
    }
  }, [acceptColor]);

  useEffect(() => {
    const element = colorRef;
  }, []);

  const classes = useStyles({ xs });
  return (
    <div
      id="custom-color-picker"
      ref={colorRef}
      className={classes.colorPickerWrapper}
    >
      {selectProfile && (
        <div
          style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          onClick={showPicker}
        >
          <div
            id="picker-component"
            style={{
              height: 20,
              width: 20,
              borderRadius: "50%",
              backgroundColor: color,
              position: "relative",
            }}
          ></div>
          <Typography
            style={{ fontSize: 11, color: "#bdbdbd", marginLeft: 10 }}
          >
            (Pick Brand Color)
          </Typography>
        </div>
      )}

      {displayColorPicker && (
        <div
          style={{
            position: "absolute",
            zIndex: 999999,
            right: sm ? "-20%" : md ? "0px" : "initial",
          }}
        >
          <PhotoshopPicker
            color={color}
            onChange={handleChange}
            onCancel={() => setDisplayColorpicker(false)}
            onAccept={handleAccept}
          />
        </div>
      )}
    </div>
  );
};
