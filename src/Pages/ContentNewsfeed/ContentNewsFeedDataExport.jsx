import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactExport from "react-data-export";
import { useSelector } from "react-redux";
import { totalEngagementPerKFans } from "utils/functions.js";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export const ContentNewsFeedDataExport = ({
  timeRange,
  showDownloadSnackBar,
  xlsxLogo,
  selectProfiles,
  selectedPostTypes,
}) => {
  const [profileTopPostCount, setProfileTopPostCount] = useState([]);
  const [profileTopPostExcellData, setProfileTopPostExcellData] = useState([]);

  const {
    contentNewsFeed,
    activeSocialMediaType,
    selectedProfilesListToComapre,
    customDateRangeRed,
    addedProfileList,
    chipData,
  } = useSelector((state) => state.socialMediaProfileListReducer);

  const selectedData = addedProfileList.filter((list) =>
    selectProfiles.includes(list.id)
  );

  useEffect(() => {
    const { feeds, pages } = contentNewsFeed ? contentNewsFeed : "";
    setProfileTopPostCount([]);
    if (feeds) {
      for (let i = 0; i < feeds.length; ++i) {
        if (feeds[i]) {
          let data = [
            { value: i },
            { value: feeds[i].feed_created_date },
            { value: feeds[i].profile_info.page_name },
            { value: feeds[i].feed_link },
            { value: feeds[i].feed_type },
            { value: feeds[i].caption },
            // { value: feeds[i].attachment },
            { value: feeds[i].feed_comment_count },
            { value: feeds[i].feed_like_count },
            { value: feeds[i].feed_share_count },
            { value: feeds[i].total_engagement },
            {
              value: feeds[i].avg_interaction_per_1k_fans,
            },
          ];
          setProfileTopPostCount((prevState) => [...prevState, data]);
        }
      }
    }
  }, [contentNewsFeed]);

  useEffect(() => {
    if (profileTopPostCount) {
      setProfileTopPostExcellData([
        {
          columns: [
            { title: "#" },
            { title: "Date" },
            { title: "Page name" },
            { title: "URL" },
            { title: "Post type" },
            { title: "Caption" },
            // { title: "Post URL" },
            { title: "Comment" },
            { title: "Like" },
            { title: "Share" },
            { title: "Total engagement" },
            { title: "Engagement per 1k fans" },
          ],
          data: profileTopPostCount,
        },
      ]);
    }
  }, [profileTopPostCount]);

  const overviewDataSet = [
    {
      columns: [
        { title: "Overview", style: { font: { bold: true } } },
        { title: "", style: { alignment: { vertical: "center" } } },
        {
          title: `${activeSocialMediaType} overview`,
          style: { alignment: { vertical: "center" } },
        },
      ],
      data: [
        [{ value: " " }, { value: "" }, { value: "" }],
        [
          { value: "Time Range ", style: { font: { bold: true } } },
          { value: "" },
          {
            value: `${new Date(
              customDateRangeRed[0].startDate
            ).toDateString()} to ${new Date(
              customDateRangeRed[0].endDate
            ).toDateString()} `,
          },
        ],
        [{ value: " " }, { value: "" }, { value: "" }],
        [
          { value: "pages name", style: { font: { bold: true } } },
          { value: " " },
          {
            value: `${
              selectedData ? selectedData.map((data) => data.name) : ""
            }`,
          },
        ],
        [
          { value: "search keywords", style: { font: { bold: true } } },
          { value: " " },
          { value: `${chipData ? chipData.map((data) => data.label) : ""}` },
        ],
        [
          { value: "feed types", style: { font: { bold: true } } },
          { value: " " },
          {
            value: `${
              selectedPostTypes ? selectedPostTypes.map((data) => data) : ""
            }`,
          },
        ],
      ],
    },
  ];

  return (
    <div>
      <ExcelFile
        filename="Content Newsfeed"
        element={
          <Typography
            onClick={() => {
              showDownloadSnackBar(true);
              setTimeout(() => {
                showDownloadSnackBar(false);
              }, 2000);
            }}
            style={{ fontSize: 15, cursor: "pointer" }}
          >
            <img
              style={{ width: 20, height: 20, marginRight: 5 }}
              alt="xlsx logo"
              src={xlsxLogo}
            />{" "}
            Export xlsx
          </Typography>
        }
      >
        <ExcelSheet dataSet={overviewDataSet} name="overview" />

        <ExcelSheet
          dataSet={profileTopPostExcellData}
          name="most_engaging_post_overview "
        />
      </ExcelFile>
    </div>
  );
};
