import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { totalEngagementPerKFans } from "utils/functions.js";

export const DashboardExport = ({
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
  const [profileTopPostCount, setProfileTopPostCount] = useState([]);
  const [profileTopPostExcellData, setProfileTopPostExcellData] = useState([]);

  const {
    addedProfileList,
    activeSocialMediaType,
    fansGrowth,
    interactionData,
    profileTopPost,
    customDateRangeRed,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  //setting value for interactions data for excell export
  useEffect(() => {
    if (
      interactionData &&
      interactionDateFilter &&
      activeSocialMediaType &&
      timeRange
    ) {
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
  }, [
    interactionData,
    interactionDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

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
  }, [interactionDataCount]);

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
  }, [
    fansGrowth,
    fanGrowthDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

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
  }, [fanGrowthDataCount]);

  //setting profile top post data for excell export
  useEffect(() => {
    if (profileTopPost && activeSocialMediaType) {
      const { feeds } = profileTopPost ? profileTopPost : "";
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
              feeds[i].attachment ? feeds[i].attachment : "null",
              feeds[i].feed_comment_count,
              feeds[i].feed_like_count,
              feeds[i].feed_share_count,
              feeds[i].other_engagement,
              feeds[i].total_engagement,
              feeds[i].avg_interaction_per_1k_fans,
            ];
            setProfileTopPostCount((prevState) => [...prevState, data]);
          }
        }
      }
    }
  }, [profileTopPost, customDateRangeRed, activeSocialMediaType]);

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
          "Post URL",
          "Comment",
          "Like",
          "Share",
          "Other engagement",
          "Total engagement",
          "Engagement per 1k fans",
        ],
        data: profileTopPostCount,
      });
    }
  }, [profileTopPostCount]);

  const generateExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create overview sheet
    const overviewData = [
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
      ["pages name", `${addedProfileList.map((data) => data.name)}`, ""],
    ];

    const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWs, "overview");

    // Create interactions sheet
    if (interactionExcellData.data && interactionExcellData.data.length > 0) {
      const interactionWs = XLSX.utils.aoa_to_sheet([
        interactionExcellData.headers,
        ...interactionExcellData.data,
      ]);
      XLSX.utils.book_append_sheet(
        wb,
        interactionWs,
        "total_number_of_interactions"
      );
    }

    // Create fan growth sheet
    if (fanGrowthExcellData.data && fanGrowthExcellData.data.length > 0) {
      const fanGrowthWs = XLSX.utils.aoa_to_sheet([
        fanGrowthExcellData.headers,
        ...fanGrowthExcellData.data,
      ]);
      XLSX.utils.book_append_sheet(wb, fanGrowthWs, "fan_growth");
    }

    // Create top posts sheet
    if (
      profileTopPostExcellData.data &&
      profileTopPostExcellData.data.length > 0
    ) {
      const topPostWs = XLSX.utils.aoa_to_sheet([
        profileTopPostExcellData.headers,
        ...profileTopPostExcellData.data,
      ]);
      XLSX.utils.book_append_sheet(
        wb,
        topPostWs,
        "most_engaging_post_overview"
      );
    }

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert binary string to ArrayBuffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // Save file
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "competitor_dashboard.xlsx"
    );
  };

  return (
    <div>
      <Typography
        onClick={() => {
          showDownloadSnackBar(true);
          generateExcel();
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
