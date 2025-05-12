import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Grid,
  makeStyles,
  useTheme,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  AddCircleOutline,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  Link as LinkIcon,
  CheckCircle as ActiveIcon,
} from "@mui/icons-material";
import Layout from "../../Components/Layout";
import Styles from "./Styles";
import Buttons from "../../Components/Buttons/Buttons";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  ...Styles(theme),
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "none",
    border: "1px solid rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    "&:hover $statValue": {
      color: "#f4d45f",
    },
  },
  statValue: {
    fontSize: 24,
    fontWeight: 600,
    color: "#FBE281",
  },
  statLabel: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  tableContainer: {
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.1)",
    marginBottom: 24,
  },
  expandedRow: {
    backgroundColor: theme.palette.action.hover,
  },
  sectionTable: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  chip: {
    margin: "0 4px",
  },
  addButton: {
    borderRadius: 8,
    padding: "8px 24px",
    textTransform: "none",
    fontWeight: 500,
  },
  statusIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  expandButton: {
    transition: "transform 0.2s",
    "&.expanded": {
      transform: "rotate(180deg)",
    },
  },
  lastModified: {
    color: theme.palette.text.secondary,
    fontSize: 12,
  },
  divider: {
    margin: "24px 0",
  },
}));

const ExpandableRow = ({ page }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${classes.expandButton} ${
              isExpanded ? "expanded" : ""
            }`}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{page.id}</TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <ActiveIcon
              className={classes.statusIcon}
              style={{ color: "#4caf50" }}
            />
            {page.description.pageName}
          </Box>
        </TableCell>
        <TableCell>
          <Chip
            label={`${page?.description?.sections?.length} Sections`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Edit Page">
            <IconButton
              href={`/cms/page/${page?.slug}/edit`}
              size="small"
              className={classes.actionButton}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow className={isExpanded ? classes.expandedRow : ""}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box marginY={2}>
              <div className={classes.sectionHeader}>
                <Typography variant="h6" component="div">
                  Page Sections
                </Typography>
              </div>
              <TableContainer className={classes.sectionTable}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 500 }}>
                        Section Title
                      </TableCell>
                      <TableCell style={{ fontWeight: 500 }}>
                        Subtitle
                      </TableCell>
                      <TableCell style={{ fontWeight: 500 }}>
                        Description
                      </TableCell>
                      <TableCell align="right" style={{ fontWeight: 500 }}>
                        Image
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {page.description.sections.map((section) => (
                      <TableRow key={section.id} hover>
                        <TableCell>{section.title}</TableCell>
                        <TableCell>{section.subtitle}</TableCell>
                        <TableCell>{section.description}</TableCell>
                        <TableCell align="right">
                          {section.image ? (
                            <img
                              src={section.image}
                              alt=""
                              style={{ width: "36px", height: "36px" }}
                            />
                          ) : (
                            <i style={{ color: "#757575" }}>
                              Image Not Available
                            </i>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ContentManagement = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Today");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios(`/pages`);
        const data = response.data;
        setPages(data.data);
        setLastUpdated(
          data.data.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          )[0].updated_at
        );
      } catch (error) {
        console.error(error);
        toast("Error fetching pages", { type: "error" });
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    const fetchFaqSections = async () => {
      try {
        const data = await axios.get(`/faqs`);
        setFaqs(data.data.data);
        setLastUpdated(
          data.data.data.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          )[0].updated_at
        );
      } catch (error) {
        console.error(error);
        toast("Error fetching faq sections", { type: "error" });
      }
    };
    fetchFaqSections();
  }, []);

  const stats = [
    { label: "Total Pages", value: pages.length },
    {
      label: "Total Sections",
      value:
        pages.length > 0
          ? pages.reduce(
              (acc, page) => acc + (page.description.sections?.length || 0),
              0
            )
          : 0,
    },
    { label: "Total Faqs", value: faqs?.length ?? 0 },
    {
      label: "Last Updated",
      value: new Date(lastUpdated).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <Grid container className={classes.root}>
        <div
          style={{
            marginTop: 100,
            marginBottom: 30,
            width: "100%",
            padding: "8px 50px",
            marginInline: "auto",
          }}
        >
          <div className={classes.headerContainer}>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              Content Management Dashboard
            </Typography>
          </div>

          <div className={classes.statsContainer}>
            {stats.map((stat, index) => (
              <Paper key={index} className={classes.statCard}>
                <Typography className={classes.statValue}>
                  {stat.value}
                </Typography>
                <Typography className={classes.statLabel}>
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </div>

          <div className={classes.headerContainer}>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              Site Pages
            </Typography>
            <a href="/cms/page/new" style={{ textDecoration: "none" }}>
              <Buttons
                variant="contained"
                startIcon={<AddCircleOutline />}
                className={classes.addSection}
              >
                Add New Page
              </Buttons>
            </a>
          </div>
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell style={{ fontWeight: 500 }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>Page Title</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>Sections</TableCell>
                  <TableCell style={{ fontWeight: 500 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.length > 0 ? (
                  pages
                    .sort((a, b) => a.id - b.id)
                    .map((page) => <ExpandableRow key={page.id} page={page} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        No pages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={classes.headerContainer}>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              Frequently Asked Questions
            </Typography>
            <a href="/cms/faq/new" style={{ textDecoration: "none" }}>
              <Buttons
                variant="contained"
                startIcon={<AddCircleOutline />}
                className={classes.addSection}
              >
                Add New FAQ
              </Buttons>
            </a>
          </div>
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 500 }}>S No</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>Title</TableCell>
                  <TableCell style={{ fontWeight: 500 }}>Description</TableCell>
                  <TableCell style={{ fontWeight: 500 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <TableRow key={faq.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{faq.title}</TableCell>
                      <TableCell
                        style={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {faq.description}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit FAQ">
                          <IconButton
                            href={`/cms/faq/${faq.id}/edit`}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        No FAQs found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Layout>
  );
};

export default ContentManagement;
