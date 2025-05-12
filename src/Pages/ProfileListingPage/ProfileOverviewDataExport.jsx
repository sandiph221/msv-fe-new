import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactExport from "react-data-export";
import { useSelector } from "react-redux";
import { totalEngagementPerKFans } from "utils/functions.js";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
  const [interactionExcellData, setInteractionExcellData] = useState([]);
  const [interactionDataCount, setInteractionDataCount] = useState([]);
  const [fanGrowthExcellData, setFansGrowthExcellData] = useState([]);
  const [fanGrowthDataCount, setFanGrowthDataCount] = useState([]);
  const [postsDataExcellData, setPostsDataExcellData] = useState([]);
  const [postsDataCount, setPostsDataCount] = useState([]);
  const [profileTopPostCount, setProfileTopPostCount] = useState([]);
  const [profileTopPostExcellData, setProfileTopPostExcellData] = useState([]);
  const [overviewCount, setOverviewCount] = useState([]);

  const {
    interactionData,
    postsData,
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

  //setting value for interactions data for excell export
  useEffect(() => {
    if (
      interactionData &&
      interactionDateFilter &&
      activeSocialMediaType &&
      customDateRangeRed
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
                { value: date.end },
                { value: dataset.label },
                { value: dataset.data[timelineIndex] },
                { value: "" },
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
    activeSocialMediaType,
    customDateRangeRed,
  ]);

  useEffect(() => {
    if (interactionDataCount) {
      setInteractionExcellData([
        {
          columns: [
            { title: "Date" },
            { title: "Page name" },
            {
              title: interaction1kPerFans
                ? "1k per interactions data"
                : "Interactions data",
            },
            { title: `Filter_by: ${interactionDateFilter}` },
          ],
          data: interactionDataCount,
        },
      ]);
    }
  }, [interactionDataCount]);

  //setting value for fan growth data for excell export
  useEffect(() => {
    if (
      fansGrowth &&
      fanGrowthDateFilter &&
      activeSocialMediaType &&
      customDateRangeRed
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
                { value: date.end },
                { value: dataset.label },
                { value: dataset.data[timelineIndex] },
                { value: "" },
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
    activeSocialMediaType,
    customDateRangeRed,
  ]);

  useEffect(() => {
    if (fanGrowthDataCount) {
      setFansGrowthExcellData([
        {
          columns: [
            { title: "Date" },
            { title: "Page name" },
            {
              title: "Fan growth data",
            },
            { title: `Filter_by: ${fanGrowthDateFilter}` },
          ],
          data: fanGrowthDataCount,
        },
      ]);
    }
  }, [fanGrowthDataCount]);

  //setting value for published posts content breakdown data for excell export
  useEffect(() => {
    if (
      postsData &&
      postTypeDateFilter &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      setPostsDataCount([]);
      const { timeline, datasets } = postsData;

      for (const timelineIndex in timeline) {
        if (Object.hasOwnProperty.call(timeline, timelineIndex)) {
          const date = timeline[timelineIndex];

          //finding label for this date
          for (const key in datasets) {
            if (Object.hasOwnProperty.call(datasets, key)) {
              const dataset = datasets[key];
              let profileDetails = [
                { value: date.end },
                { value: dataset.label },
                { value: dataset.data[timelineIndex] },
                { value: "" },
              ];
              setPostsDataCount((prevState) => [...prevState, profileDetails]);
            }
          }
        }
      }
    }
  }, [
    postsData,
    postTypeDateFilter,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

  useEffect(() => {
    if (postsDataCount) {
      setPostsDataExcellData([
        {
          columns: [
            { title: "Date" },
            { title: "labels" },
            { title: "Post content breakdown" },
            { title: `Filter_by: ${postTypeDateFilter}` },
          ],
          data: postsDataCount,
        },
      ]);
    }
  }, [postsDataCount]);

  //setting profile top post data for excell export

  useEffect(() => {
    if (profileTopPost && activeSocialMediaType) {
      const { feeds } = profileTopPost ? profileTopPost : "";
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
              { value: feeds[i].attachment ? feeds[i].attachment : "null" },
              { value: feeds[i].feed_comment_count },
              { value: feeds[i].feed_like_count },
              { value: feeds[i].feed_share_count },
              { value: feeds[i].other_engagement },
              { value: feeds[i].total_engagement },
              {
                value: feeds[i].avg_interaction_per_1k_fans,
              },
            ];
            setProfileTopPostCount((prevState) => [...prevState, data]);
          }
        }
      }
    }
  }, [profileTopPost, customDateRangeRed, activeSocialMediaType]);

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
            { title: "Post URL" },
            { title: "Comment" },
            { title: "Like" },
            { title: "Share" },
            { title: "Other engagement" },
            { title: "Total engagement" },
            { title: "Engagement per 1k fans" },
          ],
          data: profileTopPostCount,
        },
      ]);
    }
  }, [profileTopPostCount]);

  //set evulution of interaction date filter wise
  useEffect(() => {
    if (
      profileShares &&
      profileComments &&
      profileLikes &&
      profileBasic &&
      customDateRangeRed &&
      activeSocialMediaType
    ) {
      let data = [
        [
          { value: profileBasic.page_name },
          { value: profileLikes.filter_type },
          { value: profileLikes.total_likes_count },
          { value: profileComments.total_comments_count },
          {
            value:
              activeSocialMediaType === "facebook"
                ? profileShares.total_shares_count
                : "0",
          },
          { value: profileGrowthFollowers.followers_growth },
          { value: profileAbsInteraction.total_interaction_count },
        ],
      ];
      setOverviewCount([
        {
          columns: [
            { title: "PageName" },
            { title: "Date filter type" },
            { title: "Likes" },
            { title: "Comments" },
            { title: "Shares" },
            { title: "followers" },
            { title: "Interactions" },
          ],
          data: data,
        },
      ]);
    }
  }, [
    profileShares,
    profileShares,
    profileLikes,
    profileBasic,
    profileAbsInteraction,
    profileGrowthFollowers,
    customDateRangeRed,
    activeSocialMediaType,
  ]);

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
          { value: `${profileBasic ? profileBasic.page_name : ""}` },
        ],
      ],
    },
  ];

  return (
    <div>
      <ExcelFile
        filename="profile-overview"
        element={
          <Typography
            onClick={() => {
              onClick();

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
        <ExcelSheet dataSet={overviewCount} name="evolution_of_interactions" />
        <ExcelSheet
          dataSet={interactionExcellData}
          name="total_number_of_interactions"
        />
        <ExcelSheet dataSet={fanGrowthExcellData} name="fan_growth " />
        <ExcelSheet
          dataSet={postsDataExcellData}
          name="posts_content_break_down"
        />
        <ExcelSheet
          dataSet={profileTopPostExcellData}
          name="most_engaging_post_overview "
        />
      </ExcelFile>
    </div>
  );
};
