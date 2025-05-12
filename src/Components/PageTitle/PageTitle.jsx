import { Typography, useMediaQuery, useTheme } from "@mui/material";
import fbIcon from "../../assets/images/facebook.png";
import instaBg from "../../assets/images/instabg.png";
import { useSelector } from "react-redux";

const PageTitle = ({ title, subTitle }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
        marginTop: 30,
        width: "100%",
      }}
    >
      <img
        alt="socialMediaLogo"
        style={{
          height: xs ? 50 : 70,
          width: xs ? 50 : 70,
          marginRight: 20,
          borderRadius: "50%",
          padding: 10,
        }}
        src={
          activeSocialMediaType === "instagram"
            ? instaBg
            : activeSocialMediaType === "facebook"
            ? fbIcon
            : ""
        }
      />
      <Typography
        variant="h4"
        style={{
          fontSize: xs ? 20 : 28,
          fontWeight: 700,
          textTransform: "capitalize",
        }}
      >
        {title
          ? `${title}`
          : `${activeSocialMediaType} ${subTitle ? subTitle : "Overview"}`}
      </Typography>
    </div>
  );
};

export default PageTitle;
