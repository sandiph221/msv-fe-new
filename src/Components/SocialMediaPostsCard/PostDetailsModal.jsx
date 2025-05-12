
import {
  Avatar,
  Typography,
  Slide,
  Modal,
  Container,
  Grid,
  makeStyles,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  withStyles,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PieChart from "../PieChart";
import {
  formatImage,
  formatNumber,
  numbersFormat,
  totalEngagementPerKFans,
} from "utils/functions.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MessageIcon from "@mui/icons-material/Message";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Haha, Like, Love, Wow, Care, Angry } from "../logosandicons";
import LazyLoad from "react-lazyload";
import "./SocialMediaPostsCard.css";
import instaIcon from "../../assets/images/insta-icon.png";
import fbIcon from "../../assets/images/facebook.png";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    justifyContent: "flex-end",
  },
  paper: {
    width: (props) => (props.xs ? "100vw" : "55vw"),
    backgroundColor: "#FAFAFA",
    boxShadow: theme.shadows[5],
    paddingBottom: 30,
    position: "relative",
    overflow: "auto",
  },
  postsDate: {
    display: (props) => (props.xs ? "block" : "flex"),
    flexDirection: "row",
    marginLeft: 20,
  },
  postDetailsheader: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #bdbdbd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    marginLeft: 10,
  },
  postDetailContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow:
      "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)",
    padding: (props) => (props.xs ? 10 : 24),
    marginTop: 20,
    height: "90%",
  },
  postsMedia: {
    boxShadow: "none",
    "& .MuiCardContent-root": {
      padding: 0,
    },
    "& .MuiCardMedia-root": {
      borderRadius: 10,
      minHeight: 360,
      maxHeight: 360,
      "&.no-attachment": {
        background: "#000",
        backgroundImage: "none !important",
      },
    },
    "& .MuiButtonBase-root": {
      cursor: "auto",
    },
    "& .MuiCardActionArea-root": {
      "&:hover": {
        backgroundColor: "#fff",
        "& .MuiCardActionArea-focusHighlight": {
          opacity: 0.0,
        },
      },

      // "&:hover": {
      //   backgroundColor: "#ffff",
      //   "& .MuiCardActionArea-root": {
      //     opacity: 1
      //   }
      // }
    },
  },
  postsInteraction: {
    borderLeft: "1px solid #bdbdbd",
    height: "100%",
    width: "100%",
    flexBasis: "45%",
    paddingLeft: 24,
  },
  interactionTitle: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 45,
    "& div": {
      "& p": {
        fontWeight: 600,
        fontSize: 15,
        marginBottom: 10,
        "&:last-child": {
          fontWeight: 400,
        },
      },
    },
  },
  pieDistributionIcon: {
    width: 38,
    height: 38,
    padding: 7,
    borderRadius: "50%",
    marginRight: 20,
  },
  pieChartDetailHeader: {
    display: "flex",
    alignItems: "center",
    "& p": {
      fontWeight: 600,
    },
  },
  detailPieChart: {
    "& p": {
      fontSize: "30px !important",
    },
  },
  closeIcon: {
    backgroundColor: "#fff",
    zIndex: 999999,
    cursor: "pointer",
  },
}));

export const PostDetailsModal = ({
  modalOpen,
  handleClose,
  profile_info,
  profileImage,
  pageName,
  createdDate,
  caption,
  total_engagement,
  totalPageLikes,
  postImage,
  chartData,
  feed_link,
  feed_type,
  feedTypeIcon,
  subdomain,
}) => {
  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles({ xs });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      closeAfterTransition
      className={classes.modal}
      BackdropProps={{
        timeout: 500,
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Slide
        in={modalOpen}
        direction="left"
        timeout={{ enter: 700, exit: 500 }}
      >
        <div className={classes.paper}>
          <div className={classes.postDetailsheader}>
            <div className={classes.closeIcon} onClick={handleClose}>
              <CloseIcon />
            </div>
            <div className={classes.pageTitle}>
              <div
                style={{
                  backgroundColor: profile_info.color,
                  width: 5,
                  height: 35,
                  marginRight: 10,
                }}
              ></div>
              <div
                style={{ display: xs ? "block" : "flex", alignItems: "center" }}
              >
                <Avatar
                  style={{
                    height: 45,
                    width: 45,
                    marginRight: 15,
                    border: "1px solid #E0E0E0 ",
                  }}
                  src={profileImage}
                />
                <div>
                  <Typography style={{ fontSize: 15, fontWeight: 600 }}>
                    {pageName}
                  </Typography>
                </div>
              </div>
            </div>
            {feedTypeIcon(feed_type)}
            <div className={classes.postsDate}>
              <Typography
                style={{ fontSize: 14, fontWeight: "600", marginRight: 10 }}
              >
                {" "}
                Date:
              </Typography>
              <Typography style={{ fontSize: 14, color: "#757575" }}>
                {" "}
                {createdDate}
              </Typography>
            </div>
          </div>

          <Container maxWidth="xl" style={{ minHeight: "100%" }}>
            <Grid container className={classes.postDetailContent} spacing={3}>
              <Grid item xs={12} lg={6} xl={7}>
                <Card className={classes.postsMedia}>
                  <CardActionArea>
                    <CardContent style={{ display: "flex" }}>
                      <Typography
                        style={{
                          fontSize: 14,
                          marginBottom: 20,
                          whiteSpace: "break-spaces",
                        }}
                      >
                        {" "}
                        {caption}
                      </Typography>
                      <div style={{ marginLeft: "auto" }}>
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
                    </CardContent>
                    {feed_type.toLowerCase() === "video" &&
                    postImage !== "/static/media/post-img.67d01cc1.jpeg" ? (
                      <div id="modal-card-video" style={{ minHeight: 360 }}>
                        <ReactPlayer
                          id="react-player"
                          width={"100%"}
                          height={"100%"}
                          config={{
                            facebook: {
                              attributes: {
                                height: "410px",
                              },
                            },
                          }}
                          url={
                            activeSocialMediaType !== "facebook"
                              ? formatImage(
                                  activeSocialMediaType,
                                  subdomain,
                                  postImage
                                )
                              : postImage
                          }
                          controls={true}
                          playsinline={true}
                        />
                        {/* {activeSocialMediaType !== "facebook" ? (
                        
                            <ReactPlayer
                              width={"100%"}
                              height={"360px"}
                              url={formatImage(activeSocialMediaType, subdomain, postImage)}
                              controls
                              playsinline
                            />
                        ) : (
                            <iframe
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen="true"
                              frameborder="0"
                              scrolling="no"
                              src={`https://www.facebook.com/plugins/video.php?href=${postImage}`}
                              style={{ border: "none", overflow: "hidden" }}
                              width="100%"
                              height="360px"
                            />
                        )} */}
                      </div>
                    ) : (
                      <CardMedia
                        className={
                          postImage === "/static/media/post-img.67d01cc1.jpeg"
                            ? "no-attachment"
                            : ""
                        }
                        alt="post-pic"
                        image={formatImage(
                          activeSocialMediaType,
                          subdomain,
                          postImage
                        )}
                      />
                    )}
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6} xl={5}>
                <div className={classes.postsInteraction}>
                  <div className={classes.interactionTitle}>
                    <div className={classes.titleHeader}>
                      <Typography>Total engagements</Typography>
                      <Typography>
                        {" "}
                        {numbersFormat(total_engagement)}{" "}
                      </Typography>
                    </div>
                    <div className={classes.titleHeader}>
                      <Typography>Engagements per 1k fans</Typography>
                      <Typography>
                        {numbersFormat(chartData.avg_interaction_per_1k_fans)}
                      </Typography>
                    </div>
                  </div>
                  <div className={classes.detailPieChart}>
                    <PieChart
                      chartData={chartData}
                      activeSocialMediaType={activeSocialMediaType}
                      postDetailsChart={true}
                      total={
                        parseInt(chartData.total_reactions) +
                        parseInt(chartData.feed_comment_count) +
                        parseInt(
                          chartData.feed_share_count
                            ? chartData.feed_share_count
                            : 0
                        )
                      }
                    />
                  </div>
                  <Grid item xs={12}>
                    <TableContainer className={classes.chartDetails}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableBody>
                          {activeSocialMediaType === "facebook" ? (
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {" "}
                                        {formatNumber(
                                          chartData.feed_like_count
                                        )}
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {" "}
                                        {formatNumber(
                                          chartData.feed_love_count
                                        )}
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {" "}
                                        {formatNumber(chartData.feed_wow_count)}
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {" "}
                                        {chartData.feed_haha_count}
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
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
                                      <Typography
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {" "}
                                        0
                                      </Typography>{" "}
                                    </li>
                                  </ul>
                                  <hr />
                                  <div style={{ display: "flex" }}>
                                    <Typography color="inherit">
                                      Reactions
                                    </Typography>{" "}
                                    <Typography style={{ marginLeft: "auto" }}>
                                      {" "}
                                      {numbersFormat(chartData.total_reactions)}
                                    </Typography>
                                  </div>
                                </React.Fragment>
                              }
                              placement="top"
                            >
                              <TableRow style={{ cursor: "pointer" }}>
                                <TableCell
                                  className={classes.pieChartDetailHeader}
                                  component="th"
                                  scope="row"
                                >
                                  <FavoriteIcon
                                    className={classes.pieDistributionIcon}
                                    style={{
                                      background: "rgba(255, 52, 52, 0.1)",
                                      color: "#ff3434",
                                    }}
                                  />
                                  <Typography
                                    className={classes.pieDistributionTitle}
                                  >
                                    Reactions
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {formatNumber(chartData.total_reactions) || 0}
                                </TableCell>
                                <TableCell>
                                  {chartData.total_reactions || 0
                                    ? Math.round(
                                        (parseInt(chartData.total_reactions) /
                                          (parseInt(chartData.total_reactions) +
                                            parseInt(
                                              chartData.feed_comment_count
                                            ) +
                                            parseInt(
                                              chartData.feed_share_count
                                                ? chartData.feed_share_count
                                                : 0
                                            ))) *
                                          100
                                      ) + "%"
                                    : "0%"}
                                </TableCell>
                              </TableRow>
                            </HtmlTooltip>
                          ) : (
                            <TableRow>
                              <TableCell
                                className={classes.pieChartDetailHeader}
                                component="th"
                                scope="row"
                              >
                                <FavoriteIcon
                                  className={classes.pieDistributionIcon}
                                  style={{
                                    background: "rgba(255, 52, 52, 0.1)",
                                    color: "#ff3434",
                                  }}
                                />
                                <Typography
                                  className={classes.pieDistributionTitle}
                                >
                                  Like
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formatNumber(chartData.total_reactions) || 0}
                              </TableCell>
                              <TableCell>
                                {chartData.total_reactions || 0
                                  ? Math.round(
                                      (parseInt(chartData.total_reactions) /
                                        (parseInt(chartData.total_reactions) +
                                          parseInt(
                                            chartData.feed_comment_count
                                          ) +
                                          parseInt(
                                            chartData.feed_share_count
                                              ? chartData.feed_share_count
                                              : 0
                                          ))) *
                                        100
                                    ) + "%"
                                  : "0%"}
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell
                              className={classes.pieChartDetailHeader}
                              component="th"
                              scope="row"
                            >
                              <MessageIcon
                                className={classes.pieDistributionIcon}
                                style={{
                                  background: "rgba(11, 102, 112, 0.1)",
                                  color: "#0b6670",
                                }}
                              />
                              <Typography
                                className={classes.pieDistributionTitle}
                              >
                                Comments
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatNumber(chartData.feed_comment_count) || 0}
                            </TableCell>
                            <TableCell>
                              {chartData.feed_comment_count || 0
                                ? Math.round(
                                    (parseInt(chartData.feed_comment_count) /
                                      (parseInt(chartData.total_reactions) +
                                        parseInt(chartData.feed_comment_count) +
                                        parseInt(
                                          chartData.feed_share_count
                                            ? chartData.feed_share_count
                                            : 0
                                        ))) *
                                      100
                                  ) + "%"
                                : "0%"}
                            </TableCell>
                          </TableRow>

                          {activeSocialMediaType !== "instagram" ? (
                            <TableRow>
                              <TableCell
                                className={classes.pieChartDetailHeader}
                                component="th"
                                scope="row"
                              >
                                <ReplySharpIcon
                                  className={classes.pieDistributionIcon}
                                  style={{
                                    background: "rgba(248, 193, 68, 0.2)",
                                    color: "#f8c144",
                                  }}
                                />
                                <Typography
                                  className={classes.pieDistributionTitle}
                                >
                                  Share
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formatNumber(chartData.feed_share_count) || 0}
                              </TableCell>
                              <TableCell>
                                {chartData.feed_share_count || 0
                                  ? Math.round(
                                      (parseInt(chartData.feed_share_count) /
                                        (parseInt(chartData.total_reactions) +
                                          parseInt(
                                            chartData.feed_comment_count
                                          ) +
                                          parseInt(
                                            chartData.feed_share_count
                                          ))) *
                                        100
                                    ) + "%"
                                  : "0%"}
                              </TableCell>
                            </TableRow>
                          ) : (
                            ""
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Slide>
    </Modal>
  );
};
