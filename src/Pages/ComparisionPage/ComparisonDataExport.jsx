import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Component, useEffect, useState } from "react";
import ReactExport from "react-data-export";
import { useSelector } from "react-redux";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
  }, [interactionData, selectedProfilesListToComapre]);

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
  }, [fansGrowth, fanGrowthDateFilter, activeSocialMediaType, timeRange]);

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

  //setting value of distributions of interaction data for excell export

  useEffect(() => {
    if (interactionDistributions && selectedProfilesListToComapre) {
      setDistributionInteractionDataCount([]);

      //setting interaction distribution values in state
      for (let i = 0; i < interactionDistributions.length; ++i) {
        if (interactionDistributions[i]) {
          let profileDetails = [
            { value: interactionDistributions[i].page_name },
            { value: interactionDistributions[i].total_shares },
            { value: interactionDistributions[i].total_comments },
            { value: interactionDistributions[i].total_reactions },
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
      setDistributionInteractionExcellData([
        {
          columns: [
            { title: "Page Name" },
            { title: "Shares" },
            { title: "Comments" },
            { title: "Reactions" },
          ],
          data: distributionInteractionDataCount,
        },
      ]);
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
                { value: label },
                { value: dataset.label },
                { value: dataset.data[labelsIndex] },
              ];
              //setting the data for excell data
              // setInteractionExcellData((prevState) => [...prevState, data]);
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
      setpostsDataMultipleExcellData([
        {
          columns: [
            { title: "Labels" },
            { title: "Page name" },
            { title: "Multiple data post count" },
          ],
          data: postsDataMultipleDataCount,
        },
      ]);
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
        { title: "", style: { alignment: { vertical: "center" } } },
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
            value: `${selectedProfilesListToComapre.map((data) => data.name)}`,
          },
        ],
      ],
    },
  ];

  return (
    <div>
      <ExcelFile
        filename="comparison-page"
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
              alt="pdf logo"
              src={xlsxLogo}
            />{" "}
            Export xlsx
          </Typography>
        }
      >
        <ExcelSheet dataSet={overviewDataSet} name="overview" />
        <ExcelSheet
          dataSet={interactionExcellData}
          name="total_number_of_interactions"
        />
        <ExcelSheet dataSet={fanGrowthExcellData} name="fan_growth " />
        <ExcelSheet
          dataSet={postsDataMultipleExcellData}
          name="top_post_type_overview"
        />
        <ExcelSheet
          dataSet={distributionInteractionExcellData}
          name="Distribution of interactions"
        />
        <ExcelSheet
          dataSet={profileTopPostExcellData}
          name="most_engaging_post_overview "
        />
      </ExcelFile>
    </div>
  );
};

export default ComparisonDataExport;
