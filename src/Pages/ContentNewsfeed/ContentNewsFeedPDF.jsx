import { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Link,
  Canvas,
  Font,
  pdf,
} from "@react-pdf/renderer";
import FacebookRoundLogo from "../../assets/images/facebook.png";
import InstagramLogo from "../../assets/images/instagram.png";

import domtoimage from "dom-to-image";
import defaultLogo from "../../assets/images/msvfooterLogo.png";
import {
  formatImage,
  numbersFormat,
  totalEngagementPerKFans,
} from "utils/functions.js";
import fbLogo from "../../assets/images/facebook.png";
import PoppinsFont from "../../assets/fonts/Poppins-Medium.ttf";
import cameraIcon from "../../assets/images/cameraIcon.png";
import videoIcon from "../../assets/images/videoIcon.png";
import commentIcon from "../../assets/images/commentIcon.png";
import linkIcon from "../../assets/images/linkIcon.png";
import photoAlbumIcon from "../../assets/images/photoAlbumIcon.png";
import * as moment from "moment-timezone";
import { PdfTopPostComponent } from "Pages/DashboardPage/PdfComponent/PdfTopPostComponent";

//Registering font for PDF

Font.register({ family: "Poppins", src: PoppinsFont });

const ContentNewsFeedPDF = (props) => {
  const {
    activeSocialMediaType,
    addedProfileList,
    profile_feeds,
    page_fan_count,
    selectedProfilesList,
    topFilterData,
    postType,
    keyWords,
    pageNumber,
    totalPages,
    user,
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
    posts: {
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
    postsContainer: {
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
      marginTop: 5,
    },
    engagementColumn: {
      display: "flex",
      flexDirection: "column",
    },
    interactionsper1k: {
      float: "right",
      fontSize: 8,
      marginLeft: "auto",
    },
    totalEngagements: {
      marginTop: 8,
      display: "flex",
      flexDirection: "row",
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
    keywordsDisplay: {
      fontSize: 10,
      marginBottom: 20,
    },
    feedIcon: {
      width: 12,
      height: 12,
    },
  });

  let SelectedProfileDetails = addedProfileList.filter((data) =>
    selectedProfilesList.includes(data.id)
  );

  return (
    <Document>
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View style={stylesPdf.section}>
          {activeSocialMediaType === "instagram" ? (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={InstagramLogo} />
              <Text> Content Newsfeed</Text>
            </View>
          ) : (
            <View style={stylesPdf.overviewTitle}>
              <Image style={stylesPdf.socialMainLogo} src={FacebookRoundLogo} />
              <Text>Content Newsfeed</Text>
            </View>
          )}
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
            <View style={{ marginTop: 40, marginBottom: 20 }}>
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
                      @{profile.username}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            {keyWords.length > 0 && (
              <View style={stylesPdf.keywordsDisplay}>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>
                  KeyWords Selected:
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {keyWords.map((value) => {
                    return (
                      <Text style={{ color: "#2980b9" }}>{value.label}, </Text>
                    );
                  })}
                </View>
              </View>
            )}
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

      <Page wrap={false} size="A4" style={stylesPdf.postsPage}>
        <View>
          {profile_feeds.length > 0 && (
            <View wrap={true} style={stylesPdf.section}>
              <Text style={stylesPdf.sectionTitle}>
                {" "}
                Posts Showing page {pageNumber} of {totalPages}{" "}
              </Text>
              <View style={stylesPdf.postsContainer}>
                {profile_feeds && profile_feeds.length !== 0
                  ? profile_feeds.map((post, index) => (
                      <PdfTopPostComponent
                        key={index}
                        topPost={post}
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

      {/* Metrics Page */}
      <Page wrap={true} size="A4" style={stylesPdf.page}>
        <View wrap={true}>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>
            <View>Metrics Overview</View>
          </Text>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 1. Search Keywords </View>
            </Text>

            <Text>
              <View>
                These are the keywords that you use to filter the posts. If one
                of your keywords is 'Football'. Posts related to football are
                shown.
              </View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 2. Post Type </View>
            </Text>

            <Text>
              <View>Post type maybe all, photo, video, album, status etc.</View>
            </Text>
          </View>
          <View style={[stylesPdf.metricText]}>
            <Text>
              <View> 3. Page Numbers (Total, Current Page) </View>
            </Text>

            <Text>
              <View>
                The page you are currently on is rendered in PDF, posts title
                shows which page you are on and total number of pages.
              </View>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContentNewsFeedPDF;
