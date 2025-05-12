
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import FacebookRoundLogo from "../../assets/images/facebook.png";
import InstagramLogo from "../../assets/images/instagram.png";
import defaultLogo from "../../assets/images/msvfooterLogo.png";
import cameraIcon from "../../assets/images/cameraIcon.png";
import videoIcon from "../../assets/images/videoIcon.png";
import commentIcon from "../../assets/images/commentIcon.png";
import linkIcon from "../../assets/images/linkIcon.png";
import photoAlbumIcon from "../../assets/images/photoAlbumIcon.png";

import {
  formatImage,
  numbersFormat,
  totalEngagementPerKFans,
} from "utils/functions.js";
import fbLogo from "../../assets/images/facebook.png";
import PoppinsFont from "../../assets/fonts/Poppins-Medium.ttf";
import * as moment from "moment-timezone";
import { PdfTopPostComponent } from "./PdfComponent/PdfTopPostComponent";

//Registering font for PDF

Font.register({ family: "Poppins", src: PoppinsFont });

const DashboardPDF = (props) => {
  const {
    activeSocialMediaType,
    addedProfileList,
    feeds,
    interactionAddedProfiles,
    topPostPageName,
    page_picture,
    user,
    feedLimit,
    customDateRangeRed,
  } = props;
  let subdomain = user.CustomerSubdomain.subdomain;
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
      marginBottom: 8,
    },
    socialMediaCardLink: {
      color: "#0645AD",
      marginBottom: 8,
      marginTop: 8,
      whiteSpace: "no-wrap",
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
    graphSection: {
      marginBottom: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      border: "1px solid #f4f4f4",
      alignItems: "center",
      paddingRight: 10,
      paddingTop: 10,
    },
    graphContents: {
      display: "flex",
      flexDirection: "column-reverse",
      justifyContent: "space-between",
    },
    feedIcon: {
      width: 12,
      height: 12,
    },
    date: {
      alignSelf: "center",
      marginTop: 10,
      fontSize: 12,
    },
  });

  let SelectedProfileDetails = addedProfileList.filter((data) =>
    interactionAddedProfiles.includes(data.id)
  );

  function removeEmojis(string) {
    var regex =
      /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?|[\u20E3]|[\u26A0-\u3000]|\uD83E[\udd00-\uddff]|[\u00A0-\u269F]/g;
    return string.replace(regex, "");
  }

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

  return (
    <Document>
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View style={stylesPdf.section}>
          {activeSocialMediaType === "instagram" ? (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={InstagramLogo} />
              <Text> Dashboard Overview</Text>
            </View>
          ) : (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={FacebookRoundLogo} />
              <Text>Dashboard Overview</Text>
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
            <Text
              style={{
                fontSize: 14,
                display: "flex",
                justifyContent: "center",
              }}
            >
              Selected Pages
            </Text>
            <View style={{ marginTop: 40 }}>
              {SelectedProfileDetails.map((profile) => (
                <View
                  key={profile.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 10,
                    borderLeft: `3px solid ${profile.color}`,
                    paddingLeft: 10,
                  }}
                >
                  <Image
                    style={stylesPdf.profileImg}
                    src={formatImage(
                      activeSocialMediaType,
                      subdomain,
                      profile.picture
                    )}
                  />
                  <View style={{ alignSelf: "center", marginLeft: 20 }}>
                    <Text style={{ fontSize: 10 }}>{profile.page_name} </Text>

                    <Text style={{ fontSize: 8, color: "#323134" }}>
                      @{profile.username}{" "}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTop: "1px solid #D5DDE0",
            padding: "15 30 0 30",
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
      <Page wrap={true} size="A4" style={stylesPdf.graphPage}>
        <View wrap={false} style={stylesPdf.section}>
          <View
            style={{
              padding: 10,
              backgroundColor: "#ffffff",
              border: "1px solid #f4f4f4",
            }}
          >
            <View style={stylesPdf.graphSection}>
              <Text style={stylesPdf.graphTitle}>
                Follower growth (By{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {props.fanGrowthDateFilter}
                </Text>
                )
              </Text>
              <View style={stylesPdf.graphContents}>
                <View
                  style={{
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "#ffffff",
                    marginBottom: "15px",
                    marginRight: "30px",
                  }}
                >
                  <Image style={stylesPdf.graph} src={props.chart1} />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: 15,
                  }}
                >
                  {SelectedProfileDetails.map((profile) => (
                    <View
                      key={profile.id}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 5,
                        marginRight: 10,
                        borderLeft: `3px solid ${profile.color}`,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    >
                      <Image
                        style={stylesPdf.profileImgSelected}
                        src={formatImage(
                          activeSocialMediaType,
                          subdomain,
                          profile.picture
                        )}
                      />
                      <View style={{ alignSelf: "center", marginLeft: 10 }}>
                        {/* <Text style={{ fontSize: 8 }}>{profile.name} </Text> */}

                        {/* <Text
                                  style={{ fontSize: 8, marginTop: 10, color: "#323134" }}
                                >
                                  {profile.page_username}{" "}
                                </Text> */}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={stylesPdf.graphSection}>
              <Text style={stylesPdf.graphTitle}>
                Interactions (By{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {props.interactionDateFilter}
                </Text>
                )
              </Text>
              <View style={stylesPdf.graphContents}>
                <View
                  style={{
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "#ffffff",
                    marginBottom: "15px",
                    marginRight: "30px",
                  }}
                >
                  <Image style={stylesPdf.graph} src={props.chart2} />
                </View>
                <View
                  style={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: 10,
                  }}
                >
                  {SelectedProfileDetails.map((profile) => (
                    <View
                      key={profile.id}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 5,
                        marginRight: 10,
                        borderLeft: `3px solid ${profile.color}`,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    >
                      <Image
                        style={stylesPdf.profileImgSelected}
                        src={formatImage(
                          activeSocialMediaType,
                          subdomain,
                          profile.picture
                        )}
                      />
                      <View style={{ alignSelf: "center", marginLeft: 5 }}>
                        {/* <Text style={{ fontSize: 8 }}>{profile.name} </Text> */}

                        {/* <Text
                                  style={{ fontSize: 8, marginTop: 10, color: "#323134" }}
                                >
                                  {profile.page_username}{" "}
                                </Text> */}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
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
                <Text style={stylesPdf.sectionTitle}>
                  {topPostPageName} Top Posts{" "}
                </Text>
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
              <View> 1. Fan's growth </View>
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
              <View> 2. Top Posts </View>
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
              <View> 3. Interactions </View>
            </Text>

            <Text>
              <View>
                The colorful bar chart displays interactions (Reactions,
                Comments and Shares) count of page during selected time range.
              </View>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DashboardPDF;
