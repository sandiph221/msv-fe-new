import { useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
  Svg,
  Path,
} from "@react-pdf/renderer";
import FacebookRoundLogo from "../../assets/images/facebook.png";
import InstagramLogo from "../../assets/images/instagram.png";
import FavIcon from "../../assets/images/heart.png";
import defaultLogo from "../../assets/images/msvfooterLogo.png";
import FollowerGrowthIcons from "../../assets/images/followers.png";
import {
  formatImage,
  numbersFormat,
  totalEngagementPerKFans,
} from "utils/functions.js";
import fbLogo from "../../assets/images/facebook.png";
import PoppinsFont from "../../assets/fonts/Poppins-Medium.ttf";
import CommentIcon from "../../assets/images/comments.png";
import ShareIcon from "../../assets/images/next.png";
import FollowersIcon from "../../assets/images/follow.png";
import cameraIcon from "../../assets/images/cameraIcon.png";
import videoIcon from "../../assets/images/videoIcon.png";
import commentIcon from "../../assets/images/commentIcon.png";
import linkIcon from "../../assets/images/linkIcon.png";
import photoAlbumIcon from "../../assets/images/photoAlbumIcon.png";
import * as moment from "moment-timezone";
import { PdfTopPostComponent } from "Pages/DashboardPage/PdfComponent/PdfTopPostComponent";

//Registering font for PDF

Font.register({ family: "Poppins", src: PoppinsFont });

const ProfileOverViewPDF = (props) => {
  const {
    profileBasic,
    profileLikes,
    profileComments,
    profileShares,
    profileGrowthFollowers,
    pdf1,
    pdf2,
    pdf3,
    feeds,
    activeSocialMediaType,
    interactionDateFilter,
    fanGrowthDateFilter,
    user,
    postTypeDateFilter,
    profileAbsInteraction,
    customDateRangeRed,
  } = props;

  const stylesPdf = StyleSheet.create({
    page: {
      backgroundColor: "#f5f5f5",
      padding: 30,
      fontFamily: "Poppins",
    },
    postsPage: {
      backgroundColor: "#f5f5f5",
      padding: 30,
    },
    section: {
      alignSelf: "center",
      marginTop: 20,
      alignItems: "center",
      marginBottom: 40,
    },
    date: {
      alignSelf: "center",
      marginTop: 10,
      fontSize: 12,
    },
    logo: {
      height: 40,
      width: 40,
      backgroundColor: "#E4E4E4",
      alignSelf: "center",
      borderRadius: "50%",
    },
    graph: {
      height: 140,
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
      width: 200,
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
    },
    socialMediaPostDate: {
      fontSize: 8,
    },
    socialMediaPostMidSection: {
      fontSize: 9,
      overflow: "hidden",
      marginBottom: 8,
    },
    socialMediaCardLink: {
      color: "#0645AD",
      marginBottom: 8,
      marginTop: 8,
    },
    socialMediaCardImage: {
      width: 180,
      height: 180,
      borderRadius: "5",
    },
    socialMediaCardImageContainer: {
      width: 180,
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
      marginLeft: "auto",
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
      marginTop: 10,
      marginBottom: 10,
    },
    totalEngagements: {
      marginBottom: 8,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    socialMediaPostSocialLogo: {
      width: 15,
      height: 15,
    },
    socialMainLogo: {
      width: 25,
      height: 25,
      marginRight: 10,
    },
    overviewTitle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontFamily: "Poppins",
    },
    metricText: {
      fontSize: 10,
      fontWeight: 400,
      lineHeight: "1.5 px",
      marginBottom: 8,
    },
    feedIcon: {
      width: 12,
      height: 12,
    },
    labelIcon: {
      height: 30,
      width: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
    },
  });

  let subdomain = user.CustomerSubdomain.subdomain;

  const mediaCardGrowthCard = (growth) => {
    if (parseInt(growth) === 0) {
      return (
        <Svg height="10" width="10" viewBox="0 0 24 24">
          <Path fill="#1877f2" d="M19 13H5v-2h14v2z" />
        </Svg>
      );
    }
    if (parseInt(growth) < 0) {
      return (
        <Svg height="10" width="10" viewBox="0 0 24 24">
          <Path
            fill="#FF3434"
            d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"
          />
        </Svg>
      );
    }
    if (parseInt(growth) > 0) {
      return (
        <Svg height="10" width="10" viewBox="0 0 24 24">
          <Path
            fill="#19A96E"
            d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"
          />
        </Svg>
      );
    }
  };

  return (
    <Document>
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View style={stylesPdf.section}>
          {activeSocialMediaType === "instagram" ? (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={InstagramLogo} />
              <Text>Brand Overview</Text>
            </View>
          ) : (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={FacebookRoundLogo} />
              <Text>Brand Overview</Text>
            </View>
          )}
          <Text style={stylesPdf.date}>
            {" "}
            {`${
              new Date(customDateRangeRed[0].startDate)
                .toDateString()
                .split(" ")[1]
            } ${
              new Date(customDateRangeRed[0].startDate)
                .toDateString()
                .split(" ")[2]
            } ${
              new Date(customDateRangeRed[0].startDate)
                .toDateString()
                .split(" ")[3]
            } - ${
              new Date(customDateRangeRed[0].endDate)
                .toDateString()
                .split(" ")[1]
            } ${
              new Date(customDateRangeRed[0].endDate)
                .toDateString()
                .split(" ")[2]
            } ${
              new Date(customDateRangeRed[0].endDate)
                .toDateString()
                .split(" ")[3]
            }`}
          </Text>
        </View>
        <View wrap={true} style={stylesPdf.section}>
          <View>
            <Image
              src={
                profileBasic.page_picture
                  ? formatImage(
                      activeSocialMediaType,
                      "Dummy",
                      profileBasic.page_picture
                    )
                  : null
              }
              style={stylesPdf.logo}
            />
            <Text style={stylesPdf.pageName}> {profileBasic.page_name}</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{ alignSelf: "center", marginTop: 20, fontSize: 10 }}
                >
                  {" "}
                  {numbersFormat(profileBasic.page_fan_count)} Followers
                  {"      "}
                  {numbersFormat(profileBasic.total_feeds_count)} Posts
                  {"      "}
                </Text>
              </View>
              <View>
                {activeSocialMediaType === "instagram" && profileBasic ? (
                  <Text
                    style={{ alignSelf: "center", marginTop: 20, fontSize: 10 }}
                  >
                    {" "}
                    {numbersFormat(profileBasic.page_following)} Followers{" "}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View wrap={true} style={stylesPdf.likeCommentCardSection}>
          <View style={stylesPdf.socialMediaCardLabels}>
            <View style={{ display: "flex", marginRight: 10 }}>
              <View>
                <Text style={stylesPdf.socialMediaCardLabelTitleText}>
                  Likes{" "}
                  <Text style={stylesPdf.socialMediaCardLabelFilterText}>
                    ({profileLikes.filter_type}){" "}
                  </Text>
                </Text>
              </View>

              <View>
                <Text style={{ marginTop: 10 }}>
                  {numbersFormat(profileLikes.total_likes_count)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  {mediaCardGrowthCard(profileLikes.growth)}

                  <Text
                    style={{
                      color:
                        parseInt(profileLikes.growth) == 0
                          ? "#1877f2"
                          : parseInt(profileLikes.growth) < 0
                          ? "#FF3434"
                          : "#19A96E",
                      marginRight: "5px",
                      fontSize: 10,
                    }}
                  >
                    {profileLikes.growth
                      ? `${parseInt(profileLikes.growth)}%`
                      : "0%"}
                  </Text>
                  <Text style={{ fontSize: 8 }}>Absolute Growth</Text>
                </View>
              </View>
            </View>

            <View
              style={[
                stylesPdf.labelIcon,
                { backgroundColor: "rgba(255, 52, 52, 0.1)" },
              ]}
            >
              <Svg height="15" width="15" viewBox="0 0 24 24">
                <Path
                  fill="#FF3434"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </Svg>
            </View>
          </View>

          <View style={stylesPdf.socialMediaCardLabels}>
            <View style={{ display: "flex", marginRight: 10 }}>
              <View>
                <Text style={stylesPdf.socialMediaCardLabelTitleText}>
                  Comments{" "}
                  <Text style={stylesPdf.socialMediaCardLabelFilterText}>
                    ({profileComments.filter_type}){" "}
                  </Text>
                </Text>
              </View>

              <View>
                <Text style={{ marginTop: 10 }}>
                  {numbersFormat(profileComments.total_comments_count)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  {mediaCardGrowthCard(profileComments.growth)}
                  <Text
                    style={{
                      color:
                        parseInt(profileComments.growth) == 0
                          ? "#1877f2"
                          : parseInt(profileComments.growth) < 0
                          ? "#FF3434"
                          : "#19A96E",
                      marginRight: "5px",
                      fontSize: 10,
                    }}
                  >
                    {profileComments.growth
                      ? `${parseInt(profileComments.growth)}%`
                      : "0%"}
                  </Text>
                  <Text style={{ fontSize: 8 }}>Absolute Growth</Text>
                </View>
              </View>
            </View>

            <View
              style={[
                stylesPdf.labelIcon,
                { backgroundColor: "rgba(11, 102, 112, 0.1)" },
              ]}
            >
              <Svg height="15" width="15" viewBox="0 0 24 24">
                <Path
                  fill="#0B6670"
                  d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"
                />
              </Svg>
            </View>
          </View>

          {activeSocialMediaType === "facebook" && (
            <View style={stylesPdf.socialMediaCardLabels}>
              <View style={{ display: "flex", marginRight: 10 }}>
                <View>
                  <Text style={stylesPdf.socialMediaCardLabelTitleText}>
                    Share{" "}
                    <Text style={stylesPdf.socialMediaCardLabelFilterText}>
                      ({profileShares.filter_type}){" "}
                    </Text>
                  </Text>
                </View>

                <View>
                  <Text style={{ marginTop: 10 }}>
                    {numbersFormat(profileShares.total_shares_count)}
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    {mediaCardGrowthCard(profileShares.growth)}

                    <Text
                      style={{
                        color:
                          parseInt(profileShares.growth) == 0
                            ? "#1877f2"
                            : parseInt(profileShares.growth) < 0
                            ? "#FF3434"
                            : "#19A96E",
                        marginRight: "5px",
                        fontSize: 10,
                      }}
                    >
                      {profileShares.growth
                        ? `${parseInt(profileShares.growth)}%`
                        : "0%"}
                    </Text>
                    <Text style={{ fontSize: 8 }}>Absolute Growth</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  stylesPdf.labelIcon,
                  { backgroundColor: "rgba(248, 193, 68, 0.2)" },
                ]}
              >
                <Svg height="15" width="15" viewBox="0 0 24 24">
                  <Path
                    fill="#F8C144"
                    d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"
                  />
                </Svg>
              </View>
            </View>
          )}

          <View style={stylesPdf.socialMediaCardLabels}>
            <View style={{ display: "flex", marginRight: 10 }}>
              <View>
                <Text style={stylesPdf.socialMediaCardLabelTitleText}>
                  Followers{" "}
                  <Text style={stylesPdf.socialMediaCardLabelFilterText}>
                    ({profileGrowthFollowers.filter_type}){" "}
                  </Text>
                </Text>
              </View>

              <View>
                <Text style={{ marginTop: 10 }}>
                  {numbersFormat(profileGrowthFollowers.followers_growth)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  {mediaCardGrowthCard(profileGrowthFollowers.absolute_growth)}

                  <Text
                    style={{
                      color:
                        parseInt(profileGrowthFollowers.absolute_growth) == 0
                          ? "#1877f2"
                          : parseInt(profileGrowthFollowers.absolute_growth) < 0
                          ? "#FF3434"
                          : "#19A96E",
                      marginRight: "5px",
                      fontSize: 10,
                    }}
                  >
                    {profileGrowthFollowers.absolute_growth
                      ? `${parseInt(profileGrowthFollowers.absolute_growth)}%`
                      : "0%"}
                  </Text>
                  <Text style={{ fontSize: 8 }}>Absolute Growth</Text>
                </View>
              </View>
            </View>

            <View
              style={[
                stylesPdf.labelIcon,
                { backgroundColor: "rgba(164, 39, 255, 0.1)" },
              ]}
            >
              <Svg height="15" width="15" viewBox="0 0 24 24">
                <Path
                  fill="#A427FF"
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                />
              </Svg>
            </View>
          </View>

          <View style={stylesPdf.socialMediaCardLabels}>
            <View style={{ display: "flex", marginRight: 10 }}>
              <View>
                <Text style={stylesPdf.socialMediaCardLabelTitleText}>
                  Interactions{" "}
                  <Text style={stylesPdf.socialMediaCardLabelFilterText}>
                    ({profileAbsInteraction.filter_type}){" "}
                  </Text>
                </Text>
              </View>

              <View>
                <Text style={{ marginTop: 10 }}>
                  {numbersFormat(profileAbsInteraction.total_interaction_count)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  {mediaCardGrowthCard(profileAbsInteraction.growth)}

                  <Text
                    style={{
                      color:
                        parseInt(profileAbsInteraction.growth) == 0
                          ? "#1877f2"
                          : parseInt(profileAbsInteraction.growth) < 0
                          ? "#FF3434"
                          : "#19A96E",
                      marginRight: "5px",
                      fontSize: 10,
                    }}
                  >
                    {profileAbsInteraction.growth
                      ? `${parseInt(profileAbsInteraction.growth)}%`
                      : "0%"}
                  </Text>
                  <Text style={{ fontSize: 8 }}>Absolute Growth</Text>
                </View>
              </View>
            </View>

            <View
              style={[
                stylesPdf.labelIcon,
                { backgroundColor: "rgba(11, 102, 112, 0.1)" },
              ]}
            >
              <Svg height="15" width="15" viewBox="0 0 24 24">
                <Path
                  fill="#1877f2"
                  d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"
                />
              </Svg>
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTop: "1px solid #D5DDE0",
            paddingTop: 15,
            position: "absolute",
            bottom: 10,
            left: 30,
            width: "100%",
          }}
          fixed
        >
          <Text style={{ fontSize: 10, color: "#323132" }}>Overview</Text>
          <Text
            style={{
              fontSize: 10,
              color: "#D5DDE0",
            }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
          <Image src={defaultLogo} style={{ height: 20, width: 120 }} />
        </View>
      </Page>
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View wrap={false} style={stylesPdf.section}>
          <View
            style={{
              alignItems: "center",
              padding: 10,
              backgroundColor: "#ffffff",
              border: "1px solid #f4f4f4",
            }}
          >
            <View
              style={{
                alignItems: "center",
                padding: 10,
                backgroundColor: "#ffffff",
                marginBottom: "15px",
                border: "1px solid #f4f4f4",
              }}
            >
              <Text style={stylesPdf.graphTitle}>
                Interactions (By{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {interactionDateFilter}
                </Text>{" "}
                )
              </Text>
              <Image style={stylesPdf.graph} src={pdf1} />
            </View>
            <View
              style={{
                alignItems: "center",
                padding: 10,
                backgroundColor: "#ffffff",
                marginBottom: "15px",
                border: "1px solid #f4f4f4",
              }}
            >
              <Text style={stylesPdf.graphTitle}>
                Follower Growth (By{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {fanGrowthDateFilter}
                </Text>
                )
              </Text>
              <Image style={stylesPdf.graph} src={pdf2} />
            </View>
            <View
              style={{
                alignItems: "center",
                padding: 10,
                backgroundColor: "#ffffff",
                border: "1px solid #f4f4f4",
              }}
            >
              <Text style={stylesPdf.graphTitle}>
                Published Posts Content Breakdown (By{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {postTypeDateFilter}
                </Text>
                )
              </Text>
              <Image style={stylesPdf.graph} src={pdf3} />
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTop: "1px solid #D5DDE0",
            paddingTop: 15,
            position: "absolute",
            bottom: 10,
            left: 30,
            width: "100%",
          }}
          fixed
        >
          <Text style={{ fontSize: 10, color: "#323132" }}>Overview</Text>
          <Text
            style={{
              fontSize: 10,
              color: "#D5DDE0",
            }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
          <Image src={defaultLogo} style={{ height: 20, width: 120 }} />
        </View>
      </Page>
      {feeds.length > 0 && (
        <Page wrap={false} size="A4" style={stylesPdf.postsPage}>
          <View>
            {feeds.length > 0 && (
              <View wrap={true} style={stylesPdf.section}>
                <View style={stylesPdf.topPostsContainer}>
                  {feeds && feeds.length !== 0
                    ? feeds.map((topPost, index) => (
                        <PdfTopPostComponent
                          key={index}
                          topPost={topPost}
                          activeSocialMediaType={activeSocialMediaType}
                          subdomain={subdomain}
                          user={user}
                        />
                      ))
                    : ""}
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderTop: "1px solid #D5DDE0",
              paddingTop: 15,
              position: "absolute",
              bottom: 10,
              left: 30,
              width: "100%",
            }}
            fixed
          >
            <Text style={{ fontSize: 10, color: "#323132" }}>Overview</Text>
            <Text
              style={{
                fontSize: 10,
                color: "#D5DDE0",
              }}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
            <Image src={defaultLogo} style={{ height: 20, width: 120 }} />
          </View>
        </Page>
      )}

      {/* Metrics Page */}
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View wrap={true}>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>
            <View>Metrics Overview</View>
          </Text>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 1. Interactions </View>
            </Text>

            <Text>
              <View>
                The colorful bar chart displays interactions (Reactions,
                Comments and Shares) count of page during selected time range.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 2. Top posts </View>
            </Text>

            <Text>
              <View>
                This shows the distribution of the Post Types by the average
                Interactions per 1000 fans metric or by the average Interactions
                per post metric during the selected time range.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 3. Total Followers </View>
            </Text>

            <Text>
              <View>
                This chart shows the information regarding the growth of
                followers of your pages withing selected time period. The
                negative value shows decrease in followers whereas positive
                value shows increase in followers.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 4. Reactions </View>
            </Text>

            <Text>
              <View>
                This card shows the growth or decline in reactions (Like, Love,
                Haha, Angry) within last 31 days.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 6. Share </View>
            </Text>

            <Text>
              <View>
                This card shows the growth or decline in page posts shared
                within last 31 days.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 7. Published Posts content breakdown </View>
            </Text>

            <Text>
              <View>
                This line chart shows the rate of posts shared within selected
                time range. The post may be album, photo, status or video and
                can be recognized with color as shown in chart.
              </View>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProfileOverViewPDF;
