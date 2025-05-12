import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, CancelOutlined } from "@mui/icons-material";
import Buttons from "../../Components/Buttons/Buttons";
import { useState } from "react";
import Editor from "react-simple-wysiwyg";
import Layout from "../../Components/Layout";
import Styles from "./Styles";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  ...Styles(theme),
  removeSection: {
    color: "#f44336",
    borderColor: "#f44336",
    textTransform: "none",
    backgroundColor: "#fff",
    marginTop: "-2.25rem",
    "&:hover": {
      backgroundColor: "#f44336",
      color: "#fff",
    },
    marginLeft: "auto",
    "& svg": {
      height: "16px",
      width: "16px",
      marginRight: "4px",
    },
  },
  questionWrapper: {
    marginBottom: 16,
  },
  editorWrapper: {
    marginTop: 16,
    overflow: "hidden",
    "& .rsw-editor": {
      minHeight: 150,
      backgroundColor: theme.palette.background.paper,
    },
    "& .rsw-ce:focus": {
      outline: "1px solid rgba(0, 0, 0, 0.23)",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionCount: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
}));

function FAQ({ history, match }) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [sections, setSections] = useState([
    {
      title: "",
      description: "",
    },
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeSection = (index) => {
    setSections([...sections.slice(0, index), ...sections.slice(index + 1)]);
  };

  const handleTitleChange = (index, value) => {
    setSections([
      ...sections.slice(0, index),
      { ...sections[index], title: value },
      ...sections.slice(index + 1),
    ]);
  };

  const handleDescriptionChange = (index, value) => {
    setSections([
      ...sections.slice(0, index),
      { ...sections[index], description: value },
      ...sections.slice(index + 1),
    ]);
  };

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(`/faqs/${match.params.id}`);
        console.log("Fetch Page", response.data);
        const data = response.data.data;
        setSections([{ title: data.title, description: data.description }]);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
      }
    };

    fetchFaqData();
  }, [match.params.id]);

  const saveChanges = async () => {
    try {
      if (match.params.id) {
        await axios.put(`/faqs/${match.params.id}`, {
          title: sections[0].title,
          description: sections[0].description,
        });
        toast.success("FAQs updated successfully");
        history.push("/cms");
        return;
      }
      const filteredSections = sections.filter(
        (section) => section.title.trim() || section.description.trim()
      );

      if (!filteredSections.length) {
        toast.error(
          "Please add at least one complete section with a title or description."
        );
        return;
      }

      const data = filteredSections.map((section) => ({
        title: section.title.trim(),
        description: section.description.trim(),
      }));

      const responses = await Promise.all(
        data.map((item) => axios.post("/faqs", item))
      );

      if (responses.every((response) => response.status === 200)) {
        toast.success("FAQs updated successfully");
        setSections([]);
        history.push("/cms");
      } else {
        toast.error("Some FAQs failed to update.");
      }
    } catch (error) {
      console.error("Error updating FAQs:", error);
      toast.error("Failed to update FAQs. Please try again.");
    }
  };

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div
          style={{
            marginTop: 25,
            marginBottom: 30,
            width: "100%",
            padding: "8px 50px",
            marginInline: "auto",
          }}
        >
          <div className={classes.headerContainer}>
            <div className={classes.header}>
              <div>
                <Typography
                  style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}
                >
                  Frequently Asked Questions
                </Typography>
                <Typography className={classes.sectionCount}>
                  {sections.length} Question{sections.length !== 1 ? "s" : ""}
                </Typography>
              </div>
            </div>
            <Buttons
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={saveChanges}
              className={classes.addSection}
            >
              Save Changes
            </Buttons>
          </div>

          {sections.map((item, index) => (
            <Grid
              key={index}
              className={classes.pageDetailWrapper}
              component={Paper}
            >
              {sections.length > 1 && (
                <Button
                  className={classes.removeSection}
                  variant="outlined"
                  onClick={() => removeSection(index)}
                >
                  <CancelOutlined style={{ width: 14, height: 14 }} />
                  Remove Section
                </Button>
              )}

              <div className={classes.questionWrapper}>
                <Typography
                  style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}
                >
                  Question
                </Typography>
                <TextField
                  variant="outlined"
                  value={item.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder="Enter your question here"
                  size="small"
                  fullWidth
                />
              </div>

              <div>
                <Typography
                  style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}
                >
                  Answer
                </Typography>
                <div className={classes.editorWrapper}>
                  <Editor
                    value={item.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  />
                </div>
              </div>
            </Grid>
          ))}

          <Buttons
            variant="contained"
            className={classes.addSection}
            onClick={addSection}
          >
            <AddCircleOutline />
            Add New Question
          </Buttons>
        </div>
      </Grid>
    </Layout>
  );
}

export default FAQ;
