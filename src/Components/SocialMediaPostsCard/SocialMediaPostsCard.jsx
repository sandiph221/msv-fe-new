import {
  Avatar,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CommentIcon from "@mui/icons-material/Comment";
import LinkIcon from "@mui/icons-material/Link";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideocamIcon from "@mui/icons-material/Videocam";
import * as moment from "moment-timezone";
import { useState } from "react";
import LazyLoad from "react-lazyload";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import fbIcon from "../../assets/images/facebook.png";
import instaIcon from "../../assets/images/insta-icon.png";
import postImg from "../../assets/images/post-img.jpeg";
import { formatImage, formatNumber, numbersFormat } from "utils/functions.js";
import { Angry, Care, Haha, Like, Love, Wow } from "../logosandicons";
import { PostDetailsModal } from "./PostDetailsModal";
import "./SocialMediaPostsCard.css";
import { Styles } from "./Styles";

import Spinner from "../Spinner";

const useStyles = makeStyles((theme) => Styles(theme));

const SocialMediaPostsCard = ({
  topPostData,
  pageId,
  pageName,
  pagePicture,
  totalPageLikes,
  history,
}) => {
  const {
    attachment,
    feed_comment_count,
    feed_like_count,
    caption,
    feed_created_date,
    feed_created_date_utc,
    feed_share_count,
    feed_love_count,
    feed_haha_count,
    feed_wow_count,
    feed_care_count,
    feed_angry_count,
    feed_link,
    feed_type,
    total_engagement,
    other_engagement,
    profile_info,
    avg_interaction_per_1k_fans,
  } = topPostData;

  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const { user } = useSelector((state) => state.auth);

  let subdomain = user.CustomerSubdomain.subdomain;

  const [openModal, setOpenModal] = useState(false);

  // const createdDate = new Date(feed_created_date)
  //   .toLocaleString()
  //   .split(" ")[0]
  //   .replace(/,/g, " ");

  let createdDate =
    user && feed_created_date_utc
      ? `${moment(feed_created_date_utc)
          .tz(user.timezone)
          .format("DD/MM/YYYY HH:mm")} ${user.timezone}`
      : moment(feed_created_date).format("DD/MM/YYYY");

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }))(Tooltip);

  let total_reactions =
    (feed_like_count ? feed_like_count : 0) +
    (feed_haha_count ? feed_haha_count : 0) +
    (feed_love_count ? feed_love_count : 0) +
    (feed_wow_count ? feed_wow_count : 0);

  const handleClose = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const feedTypeIcon = (type) => {
    if (type.toLowerCase() === "image" || type.toLowerCase() === "photo") {
      return <CameraAltIcon fontSize="small" color="disabled" />;
    }
    if (type.toLowerCase() === "video") {
      return <VideocamIcon fontSize="small" color="disabled" />;
    }
    if (type.toLowerCase() === "link") {
      return <LinkIcon fontSize="small" color="disabled" />;
    }
    if (type.toLowerCase() === "album") {
      return <PhotoAlbumIcon fontSize="small" color="disabled" />;
    }
    if (type.toLowerCase() === "sidecar") {
      return <PhotoLibraryIcon fontSize="small" color="disabled" />;
    }
    return <CommentIcon fontSize="small" color="disabled" />;
  };

  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const xl = useMediaQuery(theme.breakpoints.down("xl"));
  const matches = useMediaQuery("(min-width:1440px) and (max-width:1919px)");
  const matches_lg = useMediaQuery("(min-width:1280px) and (max-width:1439px)");
  const matches_xl = useMediaQuery("(min-width:1280px) and (max-width:1439px)");

  let iframeConfig = {
    urlHeight: "360px",
    urlWidth: "360px",
    height: "360px",
    width: "100%",
  };

  if (matches) {
    iframeConfig = {
      urlHeight: "560px",
      urlWidth: "460px",
      height: "360px",
      width: "100%",
    };
  }
  if (matches_lg) {
    iframeConfig = {
      urlHeight: "660px",
      urlWidth: "460px",
      height: "360px",
      width: "100%",
    };
  }

  const [imageLoaded, setImageLoaded] = useState(false);

  const getImage = (attachment) => {
    const img = new Image();

    let imageSrc = formatImage(activeSocialMediaType, subdomain, postImg);
    if (attachment) {
      imageSrc = formatImage(activeSocialMediaType, subdomain, attachment);
    }

    img.src = imageSrc;
    img.onload = () => setImageLoaded(true);

    return imageSrc;
  };

  return (
    <div id="post-card" className="post-card">
      <Card variant="outlined" style={{ padding: 10 }}>
        <CardContent style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <div style={{ display: "flex" }}>
              <Avatar
                style={{
                  height: 45,
                  width: 45,
                  marginRight: 15,
                  border: "1px solid #E0E0E0 ",
                }}
                src={formatImage(activeSocialMediaType, subdomain, pagePicture)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 10,
                }}
              >
                <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push("/brand-overview", pageId)}
                  >
                    {pageName}
                  </span>
                </Typography>

                <div style={{ display: "flex", marginTop: 5 }}>
                  {feedTypeIcon(feed_type)}
                  <Typography
                    style={{
                      fontSize: 12,
                      color: "#757575",
                      marginLeft: 5,
                    }}
                  >
                    {" "}
                    {createdDate}
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <a
                href={feed_link}
                target="_blank"
                style={{ textDecoration: "none" }}
                rel="noreferrer"
              >
                <img
                  alt="social-media-icon"
                  src={
                    activeSocialMediaType === "instagram"
                      ? instaIcon
                      : activeSocialMediaType === "facebook"
                      ? fbIcon
                      : ""
                  }
                  style={{ height: 25, width: 25 }}
                />
              </a>
            </div>
          </div>

          <Typography
            id="captionTrim"
            style={{
              marginBottom: 10,
              fontSize: 15,
              fontWeight: 400,
              height: 65,
            }}
          >
            {caption}
          </Typography>
        </CardContent>

        {feed_type.toLowerCase() === "video" && attachment ? (
          <div
            id="card-video"
            style={{
              minHeight: 360,
              cursor: "pointer",
              position: "relative",
              display: "block",
            }}
            onClick={handleOpenModal}
            className={classes.cardVideo}
          >
            <LazyLoad>
              <ReactPlayer
                id="react-player"
                width={"100%"}
                height={"360px"}
                url={
                  activeSocialMediaType !== "facebook"
                    ? formatImage(activeSocialMediaType, subdomain, attachment)
                    : attachment
                }
                controls={true}
                playsinline={true}
                config={{
                  facebook: {
                    attributes: {
                      height: 360,
                      overflow: "hidden",
                    },
                  },
                }}
              />
            </LazyLoad>
          </div>
        ) : attachment ? (
          <LazyLoad>
            {!imageLoaded ? (
              <div
                style={{
                  position: "relative",
                  height: "360px",
                  backgroundColor: "#eaeaea",
                  borderRadius: "10px",
                }}
              >
                <Spinner />
              </div>
            ) : null}
            {/* <CardMedia
              className={!attachment ? "no-attachment" : ""}
              onClick={handleOpenModal}
              style={{
                paddingTop: feed_type === "video" ? "0px" : "62.65%",
                borderRadius: 10,
                minHeight: 360,
                maxHeight: 360,
                cursor: "pointer",
                display: imageLoaded ? "block" : "none",
              }}
              image={getImage(attachment)}
            /> */}
            <div
              className={!attachment ? "no-attachment" : ""}
              onClick={handleOpenModal}
              style={{
                borderRadius: 10,
                minHeight: 360,
                maxHeight: 360,
                cursor: "pointer",
                display: imageLoaded ? "flex" : "none",
                position: "relative",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={getImage(attachment)}
                style={{
                  position: "absolute",
                  height: "calc(100%)",
                  width: "calc(100%)",
                  objectFit: "cover",
                }}
              />
            </div>
          </LazyLoad>
        ) : (
          <div
            style={{
              height: "360px",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "10px",
              padding: "120px 20px 20px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                paddingBottom: 10,
                textTransform: "capitalize",
              }}
            >
              {feed_type} Unavailable
            </div>
            <div style={{ fontSize: 14 }}>
              This {feed_type} may no longer exist, or you don't have permission
              to view it.
            </div>
          </div>
        )}
        <PostDetailsModal
          modalOpen={openModal}
          handleClose={handleClose}
          profile_info={profile_info}
          pageName={pageName}
          createdDate={createdDate}
          caption={caption}
          total_engagement={total_engagement}
          totalPageLikes={totalPageLikes}
          profileImage={formatImage(
            activeSocialMediaType,
            subdomain,
            pagePicture
          )}
          postImage={attachment ? attachment : postImg}
          chartData={{
            total_reactions,
            feed_comment_count,
            feed_share_count,
            feed_haha_count,
            feed_wow_count,
            feed_love_count,
            feed_like_count,
            avg_interaction_per_1k_fans,
          }}
          feed_type={feed_type}
          feed_link={feed_link}
          feedTypeIcon={feedTypeIcon}
          subdomain={subdomain}
        />

        <CardContent style={{ padding: "25px 10px 0px 10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ fontSize: 12, textAlign: "end", marginRight: 10 }}
              >
                {" "}
                Engagements per 1k Fans{" "}
              </Typography>
              <Typography
                style={{ fontSize: 10, textAlign: "end", fontWeight: 600 }}
              >
                {" "}
                {numbersFormat(avg_interaction_per_1k_fans)}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                borderTop: "1px solid #EBEFF4",
              }}
            >
              <Typography
                style={{ fontSize: 15, flexGrow: 1, fontWeight: 600 }}
              >
                Total Engagements
              </Typography>
              <Typography
                style={{ marginRight: 10, fontSize: 24, fontWeight: 600 }}
              >
                {numbersFormat(total_engagement)}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <div>
              {activeSocialMediaType === "facebook" ? (
                <>
                  {" "}
                  <Typography style={{ fontSize: 14, color: "#757575" }}>
                    Reactions
                  </Typography>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <ul className="tooltipReactionsUL">
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Like} />
                              Like
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              {formatNumber(feed_like_count)}
                            </Typography>{" "}
                          </li>
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Love} />
                              Love
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              {formatNumber(feed_love_count)}
                            </Typography>{" "}
                          </li>
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Wow} />
                              Wow
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              {formatNumber(feed_wow_count)}
                            </Typography>{" "}
                          </li>
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Haha} />
                              Haha
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              {formatNumber(feed_haha_count)}
                            </Typography>{" "}
                          </li>
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Care} />
                              Care
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              0
                            </Typography>{" "}
                          </li>
                          <li className="tooltipReactionsLi">
                            {" "}
                            <Typography
                              style={{
                                marginRight: 10,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img src={Angry} />
                              Angry
                            </Typography>{" "}
                            <Typography style={{ marginLeft: "auto" }}>
                              {" "}
                              0
                            </Typography>{" "}
                          </li>
                        </ul>
                        <hr />
                        <div style={{ display: "flex" }}>
                          <Typography color="inherit">Reactions</Typography>{" "}
                          <Typography style={{ marginLeft: "auto" }}>
                            {" "}
                            {numbersFormat(total_reactions)}
                          </Typography>
                        </div>
                      </React.Fragment>
                    }
                    placement="top"
                  >
                    <Typography
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {numbersFormat(total_reactions)}
                    </Typography>
                  </HtmlTooltip>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Typography style={{ fontSize: 14, color: "#757575" }}>
                    Likes
                  </Typography>
                  <Typography
                    style={{ fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                  >
                    {numbersFormat(feed_like_count)}
                  </Typography>
                </>
              )}
            </div>
            <div style={{ textAlign: "end" }}>
              <Typography style={{ fontSize: 14, color: "#757575" }}>
                Comments
              </Typography>
              <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                {numbersFormat(feed_comment_count)}
              </Typography>
            </div>
            {activeSocialMediaType !== "instagram" ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "end" }}>
                  <Typography style={{ fontSize: 14, color: "#757575" }}>
                    Shares
                  </Typography>
                  <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                    {numbersFormat(feed_share_count)}
                  </Typography>
                </div>
                {/* <div style={{textAlign: "end"}}>
                    <Typography style={{ fontSize: 14, color: "#757575" }}>
                      Other Engagements
                    </Typography>
                    <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                      {numbersFormat(other_engagement)}
                    </Typography>
                  </div> */}
              </div>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default withRouter(SocialMediaPostsCard);
