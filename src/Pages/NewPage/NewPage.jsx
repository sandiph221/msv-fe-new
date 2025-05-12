import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AddCircleOutline,
  CancelOutlined,
  CloudUpload,
} from "@mui/icons-material";
import Buttons from "../../Components/Buttons/Buttons";
import { useCallback, useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import Layout from "../../Components/Layout";
import Styles from "./Styles";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  ...Styles(theme),
  fileUploadWrapper: {
    position: "relative",
    width: "100%",
    marginTop: 8,
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    width: "100%",
    padding: "12px",
    border: "2px dashed #ccc",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#f4d45f",
      backgroundColor: "rgba(0, 0, 0, 0.01)",
    },
  },
  previewImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    marginTop: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  uploadIcon: {
    fontSize: "32px",
    color: "#f4d45f",
    marginBottom: "8px",
  },
  uploadText: {
    color: theme.palette.text.secondary,
    marginBottom: "4px",
  },
  uploadSubtext: {
    color: theme.palette.text.disabled,
    fontSize: "12px",
  },
  imagePreviewWrapper: {
    position: "relative",
    display: "inline-block",
  },
  removeImageButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "2px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
}));

function NewPage({ history, match }) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [sections, setSections] = useState([
    {
      title: "",
      subtitle: "",
      description: "",
      image: "",
      imagePreview: "",
    },
  ]);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/pages/${match.params.id}`);
        console.log("Fetch Page", response.data);
        const data = response.data.data;
        setPageTitle(data.description.pageName);
        setSections([...data.description.sections]);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [match.params.id]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        subtitle: "",
        description: "",
        image: "",
        imagePreview: "",
      },
    ]);
  };

  const removeSection = (index) => {
    setSections([...sections.slice(0, index), ...sections.slice(index + 1)]);
  };

  const handleImageUpload = useCallback(
    (e, index) => {
      const file = e.target.files?.[0];

      if (!file) return;

      // File validation
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size should not exceed 1MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }

      // Cleanup previous preview URL
      if (sections[index].imagePreview) {
        URL.revokeObjectURL(sections[index].imagePreview);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSections((prevSections) => {
          const newSections = [...prevSections];
          newSections[index] = {
            ...newSections[index],
            image: reader.result,
            imagePreview: URL.createObjectURL(file),
          };
          return newSections;
        });
      };
      reader.readAsDataURL(file);
    },
    [sections]
  );

  const removeImage = (index) => {
    setSections([
      ...sections.slice(0, index),
      {
        ...sections[index],
        image: "",
        imagePreview: "",
      },
      ...sections.slice(index + 1),
    ]);
  };

  const cleanupImagePreviews = useCallback(() => {
    sections.forEach((section) => {
      if (section.imagePreview) {
        URL.revokeObjectURL(section.imagePreview);
      }
    });
  }, [sections]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => cleanupImagePreviews();
  }, [cleanupImagePreviews]);

  const saveChanges = async () => {
    try {
      if (match.params.id) {
        await axios.put(`/pages/${match.params.id}`, {
          description: {
            pageName: pageTitle,
            sections: sections.map((section) => ({
              title: section.title,
              subtitle: section.subtitle,
              description: section.description,
              image: section.image,
            })),
          },
        });
        toast.success("Page updated successfully");
        history.push("/cms");
        return;
      }
      // Validate required fields
      if (!pageTitle.trim()) {
        toast.error("Please enter a page title");
        return;
      }

      if (
        !sections.length ||
        !sections[0].title.trim() ||
        !sections[0].description.trim()
      ) {
        toast.error("Please add at least one complete section");
        return;
      }

      const data = {
        pageName: pageTitle.trim(),
        sections: sections.map((section) => ({
          title: section.title.trim(),
          subtitle: section.subtitle.trim(),
          description: section.description.trim(),
          image: section.image,
        })),
      };

      let slug = pageTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const response = await axios.put(`/pages/${slug}`, { description: data });
      if (response.status === 200) {
        // Reset form
        setPageTitle("");
        setSections([
          {
            title: "",
            subtitle: "",
            description: "",
            image: "",
            imagePreview: "",
          },
        ]);
        cleanupImagePreviews();
        toast.success("Page saved successfully");
        history.push(`/cms`);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save page"
      );
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
            <Typography style={{ fontSize: 20, fontWeight: 600 }}>
              Add New Page
            </Typography>
            <Buttons
              variant="contained"
              startIcon={<AddCircleOutline />}
              className={classes.addSection}
              onClick={saveChanges}
            >
              Save Changes
            </Buttons>
          </div>

          <div className={classes.pageHeader}>
            <Typography style={{ fontSize: 14, fontWeight: 500 }}>
              Page Title
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter Page Title"
              size="small"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              fullWidth
            />
          </div>

          <Typography
            style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}
          >
            Details
          </Typography>

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

              <div className={classes.pageDetail}>
                <div className={classes.pageDetailInner}>
                  <Typography style={{ fontSize: 14, fontWeight: 500 }}>
                    Section Title
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={item.title}
                    onChange={(e) =>
                      setSections([
                        ...sections.slice(0, index),
                        { ...item, title: e.target.value },
                        ...sections.slice(index + 1),
                      ])
                    }
                    placeholder="Enter Section Title"
                    size="small"
                    fullWidth
                  />

                  <Typography
                    style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}
                  >
                    Subtitle
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={item.subtitle}
                    onChange={(e) =>
                      setSections([
                        ...sections.slice(0, index),
                        { ...item, subtitle: e.target.value },
                        ...sections.slice(index + 1),
                      ])
                    }
                    placeholder="Enter Subtitle"
                    size="small"
                    fullWidth
                  />

                  <Typography
                    style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}
                  >
                    Image
                  </Typography>
                  <div className={classes.fileUploadWrapper}>
                    <input
                      type="file"
                      id={`image-upload-${index}`}
                      className={classes.fileInput}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                    {!item.imagePreview && !item.image ? (
                      <label
                        htmlFor={`image-upload-${index}`}
                        className={classes.uploadButton}
                      >
                        <CloudUpload className={classes.uploadIcon} />
                        <Typography className={classes.uploadText}>
                          Click to upload image
                        </Typography>
                        <Typography className={classes.uploadSubtext}>
                          PNG, JPG up to 5MB
                        </Typography>
                      </label>
                    ) : (
                      <div className={classes.imagePreviewWrapper}>
                        <img
                          src={item.imagePreview || item.image}
                          alt="Preview"
                          className={classes.previewImage}
                        />
                        <CancelOutlined
                          className={classes.removeImageButton}
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={classes.pageDetailInner}>
                  <Typography style={{ fontSize: 14, fontWeight: 500 }}>
                    Section Detail
                  </Typography>
                  <Editor
                    style={{ minHeight: "260px" }}
                    value={item.description}
                    onChange={(e) =>
                      setSections([
                        ...sections.slice(0, index),
                        { ...item, description: e.target.value },
                        ...sections.slice(index + 1),
                      ])
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
            Add New Section
          </Buttons>
        </div>
      </Grid>
    </Layout>
  );
}

export default NewPage;
