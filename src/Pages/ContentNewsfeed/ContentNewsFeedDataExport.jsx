import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  const exportToExcel = () => {
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
      [
        "pages name",
        "",
        `${selectedData ? selectedData.map((data) => data.name) : ""}`,
      ],
      [
        "search keywords",
        "",
        `${chipData ? chipData.map((data) => data.label) : ""}`,
      ],
      [
        "feed types",
        "",
        `${selectedPostTypes ? selectedPostTypes.map((data) => data) : ""}`,
      ],
    ];

    const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);

    // Apply styles to overview sheet (bold for headers)
    overviewWs["A1"] = { t: "s", v: "Overview", s: { font: { bold: true } } };
    overviewWs["A3"] = { t: "s", v: "Time Range", s: { font: { bold: true } } };
    overviewWs["A5"] = { t: "s", v: "pages name", s: { font: { bold: true } } };
    overviewWs["A6"] = {
      t: "s",
      v: "search keywords",
      s: { font: { bold: true } },
    };
    overviewWs["A7"] = { t: "s", v: "feed types", s: { font: { bold: true } } };

    XLSX.utils.book_append_sheet(wb, overviewWs, "overview");

    // Create most engaging posts sheet
    if (profileTopPostExcellData.length > 0) {
      const columns = profileTopPostExcellData[0].columns.map(
        (col) => col.title
      );
      const data = profileTopPostExcellData[0].data.map((row) =>
        row.map((cell) => cell.value)
      );

      const postsData = [columns, ...data];
      const postsWs = XLSX.utils.aoa_to_sheet(postsData);

      XLSX.utils.book_append_sheet(wb, postsWs, "most_engaging_post_overview");
    }

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Content Newsfeed.xlsx");
  };

  return (
    <div>
      <Typography
        onClick={() => {
          showDownloadSnackBar(true);
          setTimeout(() => {
            showDownloadSnackBar(false);
          }, 2000);
          exportToExcel();
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
    </div>
  );
};
