import { Image, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";
import { formatImage, numbersFormat } from "utils/functions.js";

import fbLogo from "../../../assets/images/facebook.png";
import InstagramLogo from "../../../assets/images/instagram.png";
import cameraIcon from "../../../assets/images/cameraIcon.png";
import playArrowIcon from "../../../assets/images/playIcon.png";
import videoIcon from "../../../assets/images/videoIcon.png";
import commentIcon from "../../../assets/images/commentIcon.png";
import linkIcon from "../../../assets/images/linkIcon.png";
import photoAlbumIcon from "../../../assets/images/photoAlbumIcon.png";
import * as moment from "moment-timezone";
import PoppinsFont from "../../../assets/fonts/Poppins-Medium.ttf";

export const PdfTopPostComponent = ({
  topPost,
  activeSocialMediaType,
  subdomain,
  user,
}) => {
  // Register font
  Font.register({ family: "Poppins", src: PoppinsFont });
  const stylesPdf = StyleSheet.create({
    profileImg: {
      height: 30,
      width: 30,
      border: "1px solid #D5DDE0",
      borderRadius: 5,
    },
    profileImgSelected: {
      height: 20,
      width: 20,
      border: "1px solid #D5DDE0",
      borderRadius: "50%",
    },
    page: {
      backgroundColor: "#f5f5f5",
      padding: 15,
      fontFamily: "Poppins",
    },
    graphPage: {
      backgroundColor: "#f5f5f5",
      padding: 30,
      fontFamily: "Poppins",
    },

    section: {
      alignSelf: "center",
      marginTop: 20,
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      height: 40,
      width: 40,
      backgroundColor: "#E4E4E4",
      alignSelf: "center",
      borderRadius: "50%",
    },
    graph: {
      height: 180,
      marginTop: 20,
      backgroundColor: "#ffffff",
    },
    topPosts: {
      width: 120,
      height: 200,
      marginTop: 20,
      marginRight: 10,
    },
    twoImageContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    topPostsContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Poppins",
      fontWeight: "bold",
      marginBottom: "15px",
      paddingBottom: 4,
      borderBottom: "1px solid #D5DDE0",
    },
    pageName: {
      alignSelf: "center",
      fontSize: 15,
      fontFamily: "Poppins",
      fontWeight: 400,
      marginTop: "10px",
      paddingBottom: 4,
      borderBottom: "1px solid #D5DDE0",
    },
    graphTitle: {
      fontSize: 10,
      fontFamily: "Poppins",
    },
    likeCommentCardSection: {
      padding: "0px 40px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    likeCommentCard: {
      width: 180,
      height: 70,
      marginBottom: 10,
    },
    socialMediaCardLabels: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: 200,
      height: 100,
      marginBottom: 10,
      padding: "10px 10px 10px 10px",
      border: "1px solid #D5DDE0",
      borderRadius: "3px",
      fontFamily: "Poppins",
      backgroundColor: "#ffffff",
    },
    socialMediaCardLabelTitleText: {
      fontSize: "10px",
    },
    socialMediaCardLabelFilterText: {
      fontSize: "8px",
    },
    socialMediaCardLabelIcon: {
      width: 15,
      height: 15,
      marginLeft: "auto",
    },
    socialMediaPostsCard: {
      fontFamily: "Poppins",
      width: 230,
      padding: 8,
      margin: 10,
      border: "1px solid #D5DDE0",
      backgroundColor: "#ffffff",
    },
    socialMediaCardTopSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    socialMediaPostPageTitle: {
      fontSize: 10,
      marginLeft: 5,
      marginRight: 10,
    },
    socialMediaPostDate: {
      fontSize: 8,
    },
    socialMediaPostMidSection: {
      fontSize: 9,
      marginBottom: 8,
    },
    socialMediaCardLink: {
      color: "#0645AD",
      marginBottom: 8,
      marginTop: 8,
      whiteSpace: "no-wrap",
    },
    socialMediaCardImage: {
      borderRadius: "5",
    },
    socialMediaCardImageContainer: {
      width: 210,
      height: 180,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    socialMediaPostBottomSection: {
      display: "flex",
      flexDirection: "column",
    },
    socialMediaCardPageLogo: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      marginRight: 5,
    },
    socialMediaPostCardEngagementsTitle: {
      fontSize: "10px",
      color: "rgb(117, 117, 117)",
      marginBottom: 2,
    },
    socialMediaPostCardEngagementsNumber: {
      fontSize: "8px",
      fontWeight: 600,
    },
    socialMediaPostCardEngagementsNumberRight: {
      fontSize: "8px",
      fontWeight: 600,
    },
    engagementRow: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 8,
      marginTop: 8,
    },
    engagementColumn: {
      display: "flex",
      flexDirection: "column",
    },
    interactionsper1k: {
      float: "right",
      fontSize: 8,
      marginTop: "10px",
    },
    totalEngagements: {
      marginBottom: 8,
      marginTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    socialMediaPostSocialLogo: {
      width: 15,
      height: 15,
      marginLeft: 10,
    },

    feedIcon: {
      width: 12,
      height: 12,
    },
  });

  const feedTypeIcon = (type) => {
    if (type.toLowerCase() === "image" || type.toLowerCase() === "photo") {
      return <Image style={stylesPdf.feedIcon} src={cameraIcon} />;
    }
    if (type.toLowerCase() === "video") {
      return <Image style={stylesPdf.feedIcon} src={videoIcon} />;
    }
    if (type.toLowerCase() === "link") {
      return <Image style={stylesPdf.feedIcon} src={linkIcon} />;
    }
    if (type.toLowerCase() === "album") {
      return <Image style={stylesPdf.feedIcon} src={photoAlbumIcon} />;
    }
    if (type.toLowerCase() === "sidecar") {
      return <Image style={stylesPdf.feedIcon} src={photoAlbumIcon} />;
    }
    return <Image style={stylesPdf.feedIcon} src={commentIcon} />;
  };

  function removeEmojis(string) {
    var regex =
      /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?|[\u20E3]|[\u26A0-\u3000]|\uD83E[\udd00-\uddff]|[\u00A0-\u269F]/g;
    return string.replace(regex, "");
  }

  return (
    <View key={topPost.id} wrap={false} style={stylesPdf.socialMediaPostsCard}>
      <View style={stylesPdf.socialMediaCardTopSection}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Image
              style={stylesPdf.socialMediaCardPageLogo}
              src={formatImage(
                activeSocialMediaType,
                subdomain,
                topPost.profile_info.page_picture
              )}
            />
          </View>
          <View>
            <Text style={stylesPdf.socialMediaPostPageTitle}>
              {topPost.profile_info.page_name}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginRight: 5 }}>
                {feedTypeIcon(topPost.feed_type)}
              </Text>
              <Text style={stylesPdf.socialMediaPostDate}>
                {user && topPost.feed_created_date_utc
                  ? `${moment(topPost.feed_created_date_utc)
                      .tz(user.timezone)
                      .format("DD/MM/YYYY HH:mm")} ${user.timezone}`
                  : ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Link src={topPost.feed_link}>
            <Image
              style={stylesPdf.socialMediaPostSocialLogo}
              src={
                activeSocialMediaType === "facebook" ? fbLogo : InstagramLogo
              }
            />
          </Link>
        </View>
      </View>
      <View style={stylesPdf.socialMediaPostMidSection}>
        <Text>
          {removeEmojis(topPost.caption).length < 100
            ? removeEmojis(topPost.caption)
            : `${removeEmojis(topPost.caption.slice(0, 100))}...`}
        </Text>
        {/* <Text style={stylesPdf.socialMediaCardLink}>
            "testing all asdasdasdasdasdasdasdasdshdfjkshdfhjdf"
          </Text> */}
      </View>
      <View style={stylesPdf.socialMediaCardImageContainer}>
        {topPost.feed_type.toLowerCase() === "video" ? (
          <>
            <Image
              style={stylesPdf.socialMediaCardImage}
              src={topPost.thumbnail ? topPost.thumbnail : topPost.postImg}
            />
            <Image
              style={{ height: 30, width: 30, position: "absolute" }}
              src={playArrowIcon}
            />
          </>
        ) : (
          <Image
            style={stylesPdf.socialMediaCardImage}
            src={
              topPost.attachment
                ? formatImage(
                    activeSocialMediaType,
                    subdomain,
                    topPost.attachment
                  )
                : formatImage(activeSocialMediaType, subdomain, topPost.postImg)
            }
          />
        )}
      </View>
      <View style={stylesPdf.interactionsper1k}>
        <Text>
          {" "}
          Interactions per 1k Fans:{" "}
          {numbersFormat(topPost.avg_interaction_per_1k_fans)}
        </Text>
      </View>
      <View>
        <View style={stylesPdf.totalEngagements}>
          <Text style={{ fontSize: "10px" }}>Total Engagements</Text>
          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "3px",
            }}
          >
            {numbersFormat(topPost.total_engagement)}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {activeSocialMediaType === "facebook" ? (
              <View style={(stylesPdf.engagementColumn, { marginRight: 20 })}>
                <Text style={stylesPdf.socialMediaPostCardEngagementsTitle}>
                  Reactions
                </Text>
                <Text style={stylesPdf.socialMediaPostCardEngagementsNumber}>
                  {numbersFormat(
                    topPost.feed_like_count +
                      topPost.feed_haha_count +
                      topPost.feed_love_count +
                      topPost.feed_wow_count
                  )}
                </Text>
              </View>
            ) : (
              <View style={(stylesPdf.engagementColumn, { marginRight: 20 })}>
                <Text style={stylesPdf.socialMediaPostCardEngagementsTitle}>
                  Likes
                </Text>
                <Text style={stylesPdf.socialMediaPostCardEngagementsNumber}>
                  {numbersFormat(topPost.feed_like_count)}
                </Text>
              </View>
            )}

            <View style={(stylesPdf.engagementColumn, { marginRight: 20 })}>
              <Text style={stylesPdf.socialMediaPostCardEngagementsTitle}>
                Comments
              </Text>
              <Text style={stylesPdf.socialMediaPostCardEngagementsNumberRight}>
                {" "}
                {numbersFormat(topPost.feed_comment_count)}
              </Text>
            </View>
          </View>

          {activeSocialMediaType === "facebook" && (
            <View style={stylesPdf.engagementRow}>
              <View style={stylesPdf.engagementColumn}>
                <Text style={stylesPdf.socialMediaPostCardEngagementsTitle}>
                  Shares
                </Text>
                <Text style={stylesPdf.socialMediaPostCardEngagementsNumber}>
                  {numbersFormat(topPost.feed_share_count)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
