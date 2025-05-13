import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ProfileOverviewDataExport = ({
  timeRange,
  interaction1kPerFans,
  interactionDateFilter,
  fanGrowthDateFilter,
  postTypeDateFilter,
  showDownloadSnackBar,
  xlsxLogo,
  onClick,
}) => {
  const [interactionData, setInteractionData] = useState([]);
  const [fanGrowthData, setFanGrowthData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [profileTopPostData, setProfileTopPostData] = useState([]);
  const [overviewData, setOverviewData] = useState([]);

  const {
    interactionData: interactionDataRedux,
    postsData: postsDataRedux,
    profileTopPost,
    activeSocialMediaType,
    profileComments,
    profileShares,
    profileLikes,
    profileBasic,
    fansGrowth,
    customDateRangeRed,
    profileGrowthFollowers,
    profileAbsInteraction,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  // Process interaction data
  useEffect(() => {
    if (
      interactionDataRedux &&
      interactionDateFilter &&
      activeSocialMediaType &&
      customDateRangeRed
    ) {
      const { timeline, datasets } = interactionDataRedux;
      const processedData = [];

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              processedData.push({
                Date: date.end,
                "Page name": dataset.label,
                [interaction1kPerFans
                  ? "1k per interactions data"
                  : "Interactions data"]: dataset.data[timelineIndex],
                [`Filter_by: ${interactionDateFilter}`]: "",
              });
            }
          }
        }
      }
      setInteractionData(processedData);
    }
  }, [
    interactionDataRedux,
    interactionDateFilter,
    activeSocialMediaType,
    customDateRangeRed,
    interaction1kPerFans,
  ]);

  // Process fan growth data
  useEffect(() => {
    if (
      fansGrowth &&
      fanGrowthDateFilter &&
      activeSocialMediaType &&
      customDateRangeRed
    ) {
      const { timeline, datasets } = fansGrowth;
      const processedData = [];

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              processedData.push({
                Date: date.end,
                "Page name": dataset.label,
                "Fan growth data": dataset.data[timelineIndex],
                [`Filter_by: ${fanGrowthDateFilter}`]: "",
              });
            }
          }
        }
      }
      setFanGrowthData(processedData);
    }
  }, [
    fansGrowth,
    fanGrowthDateFilter,
    activeSocialMediaType,
    customDateRangeRed,
  ]);

  // Process posts content breakdown data
  useEffect(() => {
    if (
      postsDataRedux &&
      postTypeDateFilter &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      const { timeline, datasets } = postsDataRedux;
      const processedData = [];

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              processedData.push({
                Date: date.end,
                labels: dataset.label,
                "Post content breakdown": dataset.data[timelineIndex],
                [`Filter_by: ${postTypeDateFilter}`]: "",
              });
            }
          }
        }
      }
      setPostsData(processedData);
    }
  }, [
    postsDataRedux,
    postTypeDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

  // Process profile top post data
  useEffect(() => {
    if (profileTopPost && activeSocialMediaType) {
      const { feeds } = profileTopPost || {};
      const processedData = [];

      if (feeds) {
        for (let i = 0; i < feeds.length; ++i) {
          if (feeds[i]) {
            processedData.push({
              "#": i,
              Date: feeds[i].feed_created_date,
              "Page name": feeds[i].profile_info.page_name,
              URL: feeds[i].feed_link,
              "Post type": feeds[i].feed_type,
              Caption: feeds[i].caption,
              "Post URL": feeds[i].attachment ? feeds[i].attachment : "null",
              Comment: feeds[i].feed_comment_count,
              Like: feeds[i].feed_like_count,
              Share: feeds[i].feed_share_count,
              "Other engagement": feeds[i].other_engagement,
              "Total engagement": feeds[i].total_engagement,
              "Engagement per 1k fans": feeds[i].avg_interaction_per_1k_fans,
            });
          }
        }
      }
      setProfileTopPostData(processedData);
    }
  }, [profileTopPost, customDateRangeRed, activeSocialMediaType]);

  // Process overview data
  useEffect(() => {
    if (
      profileShares &&
      profileComments &&
      profileLikes &&
      profileBasic &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      const data = [
        {
          PageName: profileBasic.page_name,
          "Date filter type": profileLikes.filter_type,
          Likes: profileLikes.total_likes_count,
          Comments: profileComments.total_comments_count,
          Shares:
            activeSocialMediaType === "facebook"
              ? profileShares.total_shares_count
              : "0",
          followers: profileGrowthFollowers.followers_growth,
          Interactions: profileAbsInteraction.total_interaction_count,
        },
      ];
      setOverviewData(data);
    }
  }, [
    profileShares,
    profileComments,
    profileLikes,
    profileBasic,
    profileAbsInteraction,
    profileGrowthFollowers,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create overview sheet
    const overviewSheet = [
      ["Overview", "", `${activeSocialMediaType} overview`],
      ["", "", ""],
      [
        "Time Range",
        "",
        `${new Date(
          customDateRangeRed[0].startDate
        ).toDateString()} to ${new Date(
          customDateRangeRed[0].endDate
        ).toDateString()}`,
      ],
      ["", "", ""],
      ["pages name", "", profileBasic ? profileBasic.page_name : ""],
    ];
    const overviewWs = XLSX.utils.aoa_to_sheet(overviewSheet);

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, overviewWs, "overview");

    // Add evolution_of_interactions sheet
    if (overviewData.length > 0) {
      const evolutionWs = XLSX.utils.json_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(
        wb,
        evolutionWs,
        "evolution_of_interactions"
      );
    }

    // Add total_number_of_interactions sheet
    if (interactionData.length > 0) {
      const interactionWs = XLSX.utils.json_to_sheet(interactionData);
      XLSX.utils.book_append_sheet(
        wb,
        interactionWs,
        "total_number_of_interactions"
      );
    }

    // Add fan_growth sheet
    if (fanGrowthData.length > 0) {
      const fanGrowthWs = XLSX.utils.json_to_sheet(fanGrowthData);
      XLSX.utils.book_append_sheet(wb, fanGrowthWs, "fan_growth");
    }

    // Add posts_content_break_down sheet
    if (postsData.length > 0) {
      const postsWs = XLSX.utils.json_to_sheet(postsData);
      XLSX.utils.book_append_sheet(wb, postsWs, "posts_content_break_down");
    }

    // Add most_engaging_post_overview sheet
    if (profileTopPostData.length > 0) {
      const topPostWs = XLSX.utils.json_to_sheet(profileTopPostData);
      XLSX.utils.book_append_sheet(
        wb,
        topPostWs,
        "most_engaging_post_overview"
      );
    }

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save file
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "profile-overview.xlsx");

    // Show download notification
    onClick();
    showDownloadSnackBar(true);
    setTimeout(() => {
      showDownloadSnackBar(false);
    }, 2000);
  };

  return (
    <div>
      <Typography
        onClick={exportToExcel}
        style={{ fontSize: 15, cursor: "pointer" }}
      >
        <img
          style={{ width: 20, height: 20, marginRight: 5 }}
          alt="xlsx logo"
          src={xlsxLogo}
        />{" "}
        Export xlsx
      </Typography>
    </div>
  );
};
