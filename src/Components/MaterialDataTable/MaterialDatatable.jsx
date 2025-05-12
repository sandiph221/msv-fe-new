import { useState, useEffect, forwardRef } from "react";
import MaterialTable from "@material-table/core";
import {
  Avatar,
  IconButton,
  Typography,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import $ from "jquery";

// Icons
import AddBox from "@mui/icons-material/AddBox";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Redux and utilities
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAddedProfileList } from "../../store/actions/SocialMediaProfileAction";
import Alert from "../AlertBox/Alert";
import * as constant from "../../utils/constant";
import { formatImage, formatNumber } from "../../utils/functions.js";

// Define table icons with forwardRef for compatibility
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// Theme configuration
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  palette: {
    secondary: {
      main: "#0B6670",
    },
  },
});

const MaterialDataTable = ({
  data,
  getSelectedProfileList,
  loader,
  selectedLabels,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { selectedProfilesListToComapre, activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );

  const subdomain = user.CustomerSubdomain.subdomain;

  // Handle profile deletion
  const deleteAddedProfile = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      dispatch(deleteAddedProfileList(itemToDelete.social_page_id));
      setDeleteAlertOpen(false);
    }
  };

  // Update selected profiles when selection changes
  useEffect(() => {
    getSelectedProfileList(selectedRow);
  }, [selectedRow, getSelectedProfileList]);

  // Horizontal scrolling handlers
  const handleScrollRight = (event) => {
    event.preventDefault();
    const newPosition = scrollPosition + 300;
    setScrollPosition(newPosition);
    $("div").animate({ scrollLeft: newPosition }, 200);
  };

  const handleScrollLeft = (event) => {
    event.preventDefault();
    if (scrollPosition > 0) {
      const newPosition = Math.max(0, scrollPosition - 300);
      setScrollPosition(newPosition);
      $("div").animate({ scrollLeft: newPosition }, 200);
    }
  };

  // Navigate to brand overview
  const navigateToBrandOverview = (id) => {
    navigate("/brand-overview", { state: id });
  };

  // Table columns configuration
  const columns = [
    {
      title: "Profile",
      field: "profileName",
      render: (rowData) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: "36vw",
          }}
        >
          {rowData.is_data_downloading && (
            <div
              style={{
                width: 6,
                height: 30,
                backgroundColor: "#FBE281",
                position: "absolute",
                left: 5,
              }}
            />
          )}

          <Avatar
            src={formatImage(
              activeSocialMediaType,
              subdomain,
              rowData.page_picture
            )}
            style={{ marginRight: "16px", border: "1px solid #E0E0E0" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              style={{
                fontWeight: 600,
                textTransform: "capitalize",
                whiteSpace: "break-space",
                fontSize: 15,
                cursor: "pointer",
              }}
              onClick={() => navigateToBrandOverview(rowData.id)}
            >
              {rowData.page_name}
            </Typography>
            <Typography
              style={{
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                fontSize: 13,
                color: "#757575",
              }}
            >
              {rowData.page_username}
            </Typography>
          </div>
        </div>
      ),
      cellStyle: {
        minwidth: "400px",
        position: "sticky",
        zIndex: "500",
        left: 65,
        backgroundColor: "#fafafa",
      },
      headerStyle: {
        width: "20vw",
        position: "sticky",
        zIndex: "500",
        left: 65,
        backgroundColor: "rgb(245, 245, 245)",
      },
    },
    {
      title: "Total Fans",
      field: "page_fan_count",
      render: (rowData) => <div>{formatNumber(rowData.page_fan_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Total Fans"),
    },
    {
      title: "Comment Count",
      field: "page_comments_count",
      render: (rowData) => (
        <div>{formatNumber(rowData.page_comments_count)}</div>
      ),
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Comment Count"),
    },
    {
      title: "Shares",
      field: "page_shares_count",
      render: (rowData) => <div>{formatNumber(rowData.page_shares_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Shares"),
    },
    {
      title: "Post Counts",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Post Counts"),
    },
    {
      title: "Average Interaction per 1k Fans",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find(
        (label) => label === "Average Interaction per 1k Fans"
      ),
    },
    {
      title: "Sum of Posts",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Sum of Posts"),
    },
    {
      title: "Sum of likes",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Sum of likes"),
    },
    {
      title: "Average Interaction",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Average Interaction"),
    },
    {
      title: "Number of Organic Post",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find(
        (label) => label === "Number of Organic Post"
      ),
    },
    {
      title: "Average response time",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find(
        (label) => label === "Average response time"
      ),
    },
    {
      title: "Sum of Page Post",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find((label) => label === "Sum of Page Post"),
    },
    {
      title: "Paid Efficiency Index",
      field: "page_posts_count",
      render: (rowData) => <div>{formatNumber(rowData.page_posts_count)}</div>,
      cellStyle: { width: "5vw" },
      hidden: !selectedLabels.find(
        (label) => label === "Paid Efficiency Index"
      ),
    },
    {
      title: "Delete",
      field: "",
      align: "center",
      render: (rowData) => (
        <div style={{ minWidth: 140 }}>
          {user.role !== constant.CUSTOMER_VIEWER_NAME && (
            <IconButton
              aria-label="delete"
              onClick={() => deleteAddedProfile(rowData)}
            >
              <RemoveCircleOutlineOutlinedIcon color="error" />
            </IconButton>
          )}
        </div>
      ),
      cellStyle: {
        width: "5vw",
        position: "sticky",
        right: 0,
        zIndex: "500",
        backgroundColor: "#fafafa",
      },
      headerStyle: {
        position: "sticky",
        right: 0,
        zIndex: "500",
        textAlign: "center",
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        isLoading={loader}
        components={{
          OverlayLoading: (props) => (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <CircularProgress style={{ color: "#bdbdbd" }} {...props} />
            </div>
          ),
        }}
        style={{
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
        icons={tableIcons}
        columns={columns}
        data={data}
        options={{
          selection: true,
          selectionProps: (rowData) => ({
            disabled: selectedProfilesListToComapre.some(
              (profile) => profile.social_page_id === rowData.social_page_id
            ),
          }),
          search: false,
          paging: false,
          toolbar: false,
          responsive: true,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow.some(
                (row) => row.social_page_id === rowData.social_page_id
              ) ||
              selectedProfilesListToComapre.some(
                (profile) => profile.social_page_id === rowData.social_page_id
              )
                ? "#FFF8DE"
                : "",
          }),
          headerStyle: {
            backgroundColor: "#F5F5F5",
            borderRadius: "4px",
          },
        }}
        onSelectionChange={(rows) => setSelectedRow(rows)}
        localization={{
          body: {
            emptyDataSourceMessage: "No records found",
          },
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <button className="scrollLeft" onClick={handleScrollLeft}>
          Scroll Left
        </button>
        <button className="scrollRight" onClick={handleScrollRight}>
          Scroll Right
        </button>
      </div>

      {/* Alert Dialog for Delete Confirmation */}
      <Alert
        alert={itemToDelete}
        icon={
          <ErrorOutlineIcon
            style={{
              fontSize: "5rem",
              color: "#f50057",
              paddingBottom: 0,
            }}
          />
        }
        title="Are you sure?"
        confirmBtn="DELETE"
        description="You're about to Delete the profile. This process cannot be undone."
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        onConfirm={handleDelete}
      />
    </ThemeProvider>
  );
};

export default MaterialDataTable;
