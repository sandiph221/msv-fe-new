import { Typography } from "@material-ui/core";
import { Component, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ComparisonDataExport = ({
  timeRange,
  interaction1kPerFans,
  interactionDateFilter,
  fanGrowthDateFilter,
  showDownloadSnackBar,
  xlsxLogo,
  onClick,
}) => {
  const [interactionExcellData, setInteractionExcellData] = useState([]);
  const [interactionDataCount, setInteractionDataCount] = useState([]);
  const [fanGrowthExcellData, setFansGrowthExcellData] = useState([]);
  const [fanGrowthDataCount, setFanGrowthDataCount] = useState([]);
  const [
    distributionInteractionExcellData,
    setDistributionInteractionExcellData,
  ] = useState([]);
  const [
    distributionInteractionDataCount,
    setDistributionInteractionDataCount,
  ] = useState([]);

  const [postsDataMultipleExcellData, setpostsDataMultipleExcellData] =
    useState([]);
  const [postsDataMultipleDataCount, setPostsDataMultipleDataCount] = useState(
    []
  );
  const [profileTopPostCount, setProfileTopPostCount] = useState([]);
  const [profileTopPostExcellData, setProfileTopPostExcellData] = useState([]);

  const {
    interactionData,
    postsDataMultiple,
    interactionDistributions,
    selectedProfilesListToComapre,
    fansGrowth,
    contentNewsFeed,
    activeSocialMediaType,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  //setting value for interactions data for excell export
  useEffect(() => {
    if (interactionData && selectedProfilesListToComapre) {
      setInteractionDataCount([]);
      const { timeline, datasets } = interactionData;

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          //finding label for this date
          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              let profileDetails = [
                date.end,
                dataset.label,
                dataset.data[timelineIndex],
                "",
              ];
              setInteractionDataCount((prevState) => [
                ...prevState,
                profileDetails,
              ]);
            }
          }
        }
      }
    }
  }, [interactionData, selectedProfilesListToComapre]);

  useEffect(() => {
    if (interactionDataCount) {
      setInteractionExcellData({
        headers: [
          "Date",
          "Page name",
          interaction1kPerFans
            ? "1k per interactions data"
            : "Interactions data",
          `Filter_by: ${interactionDateFilter}`,
        ],
        data: interactionDataCount,
      });
    }
  }, [interactionDataCount, interaction1kPerFans, interactionDateFilter]);

  //setting value for fan growth data for excell export
  useEffect(() => {
    if (
      fansGrowth &&
      fanGrowthDateFilter &&
      activeSocialMediaType &&
      timeRange
    ) {
      setFanGrowthDataCount([]);
      const { timeline, datasets } = fansGrowth;

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          //finding label for this date
          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              let profileDetails = [
                date.end,
                dataset.label,
                dataset.data[timelineIndex],
                "",
              ];
              setFanGrowthDataCount((prevState) => [
                ...prevState,
                profileDetails,
              ]);
            }
          }
        }
      }
    }
  }, [fansGrowth, fanGrowthDateFilter, activeSocialMediaType, timeRange]);

  useEffect(() => {
    if (fanGrowthDataCount) {
      setFansGrowthExcellData({
        headers: [
          "Date",
          "Page name",
          "Fan growth data",
          `Filter_by: ${fanGrowthDateFilter}`,
        ],
        data: fanGrowthDataCount,
      });
    }
  }, [fanGrowthDataCount, fanGrowthDateFilter]);

  //setting value of distributions of interaction data for excell export
  useEffect(() => {
    if (interactionDistributions && selectedProfilesListToComapre) {
      setDistributionInteractionDataCount([]);

      //setting interaction distribution values in state
      for (let i = 0; i < interactionDistributions.length; ++i) {
        if (interactionDistributions[i]) {
          let profileDetails = [
            interactionDistributions[i].page_name,
            interactionDistributions[i].total_shares,
            interactionDistributions[i].total_comments,
            interactionDistributions[i].total_reactions,
          ];
          setDistributionInteractionDataCount((prevState) => [
            ...prevState,
            profileDetails,
          ]);
        }
      }
    }
  }, [interactionDistributions, selectedProfilesListToComapre]);

  useEffect(() => {
    //setting interaction distribution values in state to export data in excell format
    if (distributionInteractionDataCount) {
      setDistributionInteractionExcellData({
        headers: ["Page Name", "Shares", "Comments", "Reactions"],
        data: distributionInteractionDataCount,
      });
    }
  }, [distributionInteractionDataCount]);

  //setting value for multiple post data data for excell export
  useEffect(() => {
    if (postsDataMultiple && selectedProfilesListToComapre) {
      const { labels, datasets } = postsDataMultiple;
      setPostsDataMultipleDataCount([]);
      for (const labelsIndex in labels) {
        if (Object.hasOwnProperty.call(labels, labelsIndex)) {
          const label = labels[labelsIndex];

          //finding label for this date
          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              let profileDetails = [
                label,
                dataset.label,
                dataset.data[labelsIndex],
              ];
              setPostsDataMultipleDataCount((prevState) => [
                ...prevState,
                profileDetails,
              ]);
            }
          }
        }
      }
    }
  }, [postsDataMultiple, selectedProfilesListToComapre]);

  useEffect(() => {
    if (postsDataMultipleDataCount) {
      setpostsDataMultipleExcellData({
        headers: ["Labels", "Page name", "Multiple data post count"],
        data: postsDataMultipleDataCount,
      });
    }
  }, [postsDataMultipleDataCount]);

  //seting top post value for excell data export
  useEffect(() => {
    const { feeds, pages } = contentNewsFeed ? contentNewsFeed : "";
    setProfileTopPostCount([]);
    if (feeds) {
      for (let i = 0; i < feeds.length; ++i) {
        if (feeds[i]) {
          let data = [
            i,
            feeds[i].feed_created_date,
            feeds[i].profile_info.page_name,
            feeds[i].feed_link,
            feeds[i].feed_type,
            feeds[i].caption,
            feeds[i].feed_comment_count,
            feeds[i].feed_like_count,
            feeds[i].feed_share_count,
            feeds[i].total_engagement,
            feeds[i].avg_interaction_per_1k_fans,
          ];
          setProfileTopPostCount((prevState) => [...prevState, data]);
        }
      }
    }
  }, [contentNewsFeed]);

  useEffect(() => {
    if (profileTopPostCount) {
      setProfileTopPostExcellData({
        headers: [
          "#",
          "Date",
          "Page name",
          "URL",
          "Post type",
          "Caption",
          "Comment",
          "Like",
          "Share",
          "Total engagement",
          "Engagement per 1k fans",
        ],
        data: profileTopPostCount,
      });
    }
  }, [profileTopPostCount]);

  const overviewData = {
    headers: ["Overview", "", ""],
    data: [
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
      [
        "pages name",
        "",
        `${selectedProfilesListToComapre.map((data) => data.name)}`,
      ],
    ],
  };

  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add overview sheet
    const overviewWs = XLSX.utils.aoa_to_sheet([
      overviewData.headers,
      ...overviewData.data,
    ]);
    XLSX.utils.book_append_sheet(wb, overviewWs, "overview");

    // Add interactions sheet
    const interactionsWs = XLSX.utils.aoa_to_sheet([
      interactionExcellData.headers,
      ...interactionExcellData.data,
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      interactionsWs,
      "total_number_of_interactions"
    );

    // Add fan growth sheet
    const fanGrowthWs = XLSX.utils.aoa_to_sheet([
      fanGrowthExcellData.headers,
      ...fanGrowthExcellData.data,
    ]);
    XLSX.utils.book_append_sheet(wb, fanGrowthWs, "fan_growth");

    // Add post type overview sheet
    const postTypeWs = XLSX.utils.aoa_to_sheet([
      postsDataMultipleExcellData.headers,
      ...postsDataMultipleExcellData.data,
    ]);
    XLSX.utils.book_append_sheet(wb, postTypeWs, "top_post_type_overview");

    // Add distribution of interactions sheet
    const distributionWs = XLSX.utils.aoa_to_sheet([
      distributionInteractionExcellData.headers,
      ...distributionInteractionExcellData.data,
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      distributionWs,
      "Distribution of interactions"
    );

    // Add most engaging posts sheet
    const engagingPostsWs = XLSX.utils.aoa_to_sheet([
      profileTopPostExcellData.headers,
      ...profileTopPostExcellData.data,
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      engagingPostsWs,
      "most_engaging_post_overview"
    );

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save the file
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "comparison-page.xlsx");
  };

  return (
    <div>
      <Typography
        onClick={() => {
          onClick();
          exportToExcel();
          showDownloadSnackBar(true);
          setTimeout(() => {
            showDownloadSnackBar(false);
          }, 2000);
        }}
        style={{ fontSize: 15, cursor: "pointer" }}
      >
        <img
          style={{ width: 20, height: 20, marginRight: 5 }}
          alt="pdf logo"
          src={xlsxLogo}
        />{" "}
        Export xlsx
      </Typography>
    </div>
  );
};

export default ComparisonDataExport;
