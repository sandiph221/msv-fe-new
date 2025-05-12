import {
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
  ListItem,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardActions,
  styled,
  FormHelperText,
  Container,
  CardContent,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Layout from "../../Components/Layout";
import SearchIcon from "@mui/icons-material/Search";
import HelpSectionList from "../../Components/HelpSectionList/HelpSectionList";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import * as constant from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Buttons from "../../Components/Buttons/Buttons";
import CkEditor from "../../Components/CkEditor/CkEditor";
import {
  createArticle,
  getFaqList,
  getHelpVideoList,
  getHowToDocList,
  getSectionList,
  updateArticle,
  setSearchQuery,
  clearSearchArticle,
  deleteArticle,
} from "../../store/actions/HelpPageAction";
import JoditEditor from "jodit-react";
import AddModalForm from "../../Components/AddModalForm/AddModalForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CreateIcon from "@mui/icons-material/Create";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpIcon from "@mui/icons-material/Help";
import Spinner from "../../Components/Spinner";
import InfoIcon from "@mui/icons-material/Info";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { HelpPageArticle } from "../../Components/HelpPageArticle/HelpPageArticle";
import { useNavigate, useLocation } from "react-router-dom";
import { HelpPageBannerSection } from "../../Components/HelpPageBannerSection/HelpPageBannerSection";
import parse from "html-react-parser";
import { deleteConfirmation } from "../../utils/functions";

/* styled components */
const StyledTextField = styled(TextField)(({ backgroundColor }) => ({
  color: "#000",
  marginTop: constant.SUPER_ADMIN_NAME ? 0 : 20,
  marginBottom: constant.SUPER_ADMIN_NAME ? 0 : 20,
  width: constant.SUPER_ADMIN_NAME ? "100%" : 520,
  height: 65,
  "& .MuiOutlinedInput-root": {
    "& input": {
      zIndex: 9999,
    },
    "& fieldset": {
      borderRadius: 12,
      backgroundColor: backgroundColor ? "#fff" : "transparent",
    },
  },
}));

const StyledTextFieldForm = styled(TextField)({
  width: "100%",
  borderRadius: 15,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 12,
    },
  },
});

const StyledAccordion = styled(Accordion)({
  width: "100%",
});

// Styled components for the rest of the styles
const Row = styled(Grid)({
  // Add styles from classes.row if needed
});

// const Sidebar = styled(Grid)(({ theme }) => ({
// }));

const AsideTop = styled("div")(({ theme }) => ({
  // Add styles from classes.asideTop if needed
}));

const UserContainer = styled("div")(({ theme }) => ({
  // Add styles from classes.userContainer if needed
}));

const UserType = styled(Typography)(({ theme }) => ({
  // Add styles from classes.userType if needed
}));

const FormContainer = styled(Grid)(({ theme }) => ({
  // Add styles from classes.formContainer if needed
}));

const ArticleCard = styled(Card)(({ theme }) => ({
  // Add styles from classes.articleCard if needed
}));

const HelpList = styled("div")(({ theme }) => ({
  // Add styles from classes.helpList if needed
}));

const HelpIconList = styled("div")(({ theme }) => ({
  // Add styles from classes.helpIconList if needed
}));

const ImgError = styled(Typography)(({ theme }) => ({
  // Add styles from classes.imgError if needed
}));

const Help = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [article, setArticle] = useState({
    section: "",
    title: "",
    body: "",
  });
  const [editInfo, setEditInfo] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [errors, setErrors] = React.useState({});
  const { user } = useSelector((state) => state.auth);
  const {
    sectionList,
    faqList,
    faqListLoader,
    howToDocList,
    howToDocListLoader,
    videoList,
    videoListLoader,
    searchQuery,
  } = useSelector((state) => state.helpReducer);

  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, []);

  const handleSearch = (event) => {
    if (event.target.value === "") {
      dispatch(clearSearchArticle());
    }
    // searching articles section
    dispatch(setSearchQuery(event.target.value));
  };

  const handleChange = (event) => {
    setArticle((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const getArticles = (article) => {
    // getting article details from child component
    setArticle((prevState) => ({
      ...prevState,
      body: article,
    }));
  };

  const submitArticle = async () => {
    // on submitting articles

    let formErrors = {};

    // Check for empty value

    if (!article.section) {
      formErrors.section = "Field is required";
    }

    if (!article.title) {
      formErrors.title = "Title is required";
    }
    if (!article.title) {
      formErrors.body = "Field is required";
    }
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setFormLoader(true);
      if (Object.keys(editInfo).length === 0) {
        try {
          const response = await dispatch(createArticle(article));
          if (response.data.status_code === 200) {
            setFormLoader(false);
            setErrors({});
            setArticle({
              section: "",
              title: "",
              body: "",
            });
          }
        } catch (error) {
          if (error) {
            setFormLoader(false);
          }
        }
      } else {
        try {
          const response = await dispatch(
            updateArticle({
              ...article,
              id: editInfo.id,
            })
          );
          if (response.data.status_code === 200) {
            setFormLoader(false);
            setErrors({});
            setArticle({
              section: "",
              title: "",
              body: "",
            });
            setEditInfo({});
          }
        } catch (error) {
          if (error) {
            setFormLoader(false);
          }
        }
      }
    }
  };

  const fetchArticlesFromApi = () => {
    if (article.section === "faq") {
      dispatch(getFaqList());
    }
    if (article.section === "documentation") {
      dispatch(getHowToDocList());
    }

    if (article.section === "videos") {
      dispatch(getHelpVideoList());
    }
  };

  useEffect(() => {
    //get articles list
    setErrors({});
    setEditInfo({});
    setArticle((prevState) => ({
      ...prevState,
      title: "",
      body: "",
    }));
    if (user && user.role === constant.SUPER_ADMIN_NAME) {
      fetchArticlesFromApi();
    }
  }, [article.section]);

  const accordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDelete = () => {
    dispatch(deleteArticle({ ...article, ...editInfo }));
    setEditInfo({});
    setArticle({ section: article.section });

    fetchArticlesFromApi();
  };

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    toolbarButtonSize: "big",
    uploader: { insertImageAsBase64URI: true },
  };

  useEffect(() => {
    if (Object.keys(editInfo).length > 0) {
      setArticle((prevState) => ({
        ...prevState,
        title: editInfo.title,
        body: editInfo.description,
      }));
    }
  }, [editInfo]);

  const handleCancel = () => {
    // reseting form
    setArticle({
      section: "",
      title: "",
      body: "",
    });
    setEditInfo({});
  };

  const menuProps = {
    borderRadius: "12px",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
      borderRadius: 12,
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  return (
    <Layout>
      <Row container>
        {user && user.role !== constant.SUPER_ADMIN_NAME ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: "16px",
            }}
          >
            <HelpPageBannerSection
              searchQuery={searchQuery}
              handleKeyPress={() => navigate("/help/faq")}
              handleSearch={handleSearch}
            />
            <Container sx={{ marginTop: 100, marginBottom: 60 }}>
              {/* <HelpSectionList sectionList={sectionList}/> */}
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} sx={{ width: "100%" }}>
                  <HelpList onClick={() => navigate("/help/faq")}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <HelpIconList sx={{ backgroundColor: "#ff91571a" }}>
                        <HelpIcon sx={{ color: "#ff9157", fontSize: 21 }} />
                      </HelpIconList>
                      <p> FAQs </p>
                    </div>
                  </HelpList>
                </Grid>
                <Grid item sm={12} md={6} sx={{ width: "100%" }}>
                  <HelpList onClick={() => navigate("/help/how-to-document")}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <HelpIconList sx={{ backgroundColor: "#19a96e1a" }}>
                        <InfoIcon sx={{ color: "#19a96e" }} />
                      </HelpIconList>
                      <p> How to Documents? </p>
                    </div>
                  </HelpList>
                </Grid>
                <Grid item sm={12} md={6} sx={{ width: "100%" }}>
                  <AddModalForm />
                </Grid>
                <Grid item sm={12} md={6} sx={{ width: "100%" }}>
                  <HelpList onClick={() => navigate("/help/videos")}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <HelpIconList sx={{ backgroundColor: "#ff00001a" }}>
                        <YouTubeIcon sx={{ color: "#ff0000" }} />
                      </HelpIconList>
                      <p> Help videos </p>
                    </div>
                  </HelpList>
                </Grid>
              </Grid>
            </Container>
          </div>
        ) : (
          <div>
            <Grid container>
              <Grid xl={3} lg={4} md={5} sm={12} xs={12} item>
                <Sidebar>
                  <AsideTop>
                    <UserContainer>
                      <UserType>
                        <strong>Help Center</strong>
                      </UserType>
                      {/* <AddModalForm /> */}
                    </UserContainer>
                    <StyledTextField
                      fullWidth
                      hinttext="Search by Name"
                      variant="outlined"
                      placeholder="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#323132" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </AsideTop>
                  <List>
                    {article && article.section === "faq" ? (
                      faqListLoader ? (
                        <Spinner size={24} />
                      ) : faqList ? (
                        faqList.map((item, index) => (
                          <ListItem key={index}>
                            <ArticleCard>
                              <CardContent>
                                <Typography> {item.title} </Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        ""
                      )
                    ) : article.section === "documentation" ? (
                      howToDocListLoader ? (
                        <Spinner size={24} />
                      ) : howToDocList ? (
                        howToDocList.map((item, index) => (
                          <ListItem key={index}>
                            <ArticleCard>
                              <CardContent>
                                <Typography> {item.title} </Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        ""
                      )
                    ) : article.section === "videos" ? (
                      videoListLoader ? (
                        <Spinner size={24} />
                      ) : videoList ? (
                        videoList.map((item, index) => (
                          <ListItem key={index}>
                            <ArticleCard>
                              <CardContent>
                                <Typography> {item.title} </Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}

                    <ListItem>
                      {/* getCustomersLoading && <div className={classes.userItem}></div> */}
                    </ListItem>
                  </List>
                </Sidebar>
              </Grid>
              <FormContainer
                xl={9}
                lg={8}
                md={7}
                sm={12}
                xs={12}
                item
                spacing={2}
              >
                {Object.keys(editInfo).length === 0 ? (
                  <UserType>
                    <strong>New Article</strong>
                  </UserType>
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <UserType>
                      <strong>Update Article</strong>
                    </UserType>
                    <Buttons
                      onClick={() =>
                        deleteConfirmation(
                          "Are you sure?",
                          "You are about to delete this article."
                        ).then((isConfirm) => {
                          if (isConfirm) {
                            handleDelete();
                          }
                        })
                      }
                      sx={{
                        backgroundColor: "#F44336",
                        borderColor: "#F44336",
                        color: "#fff",
                      }}
                    >
                      Delete Article
                    </Buttons>
                  </div>
                )}

                <form container style={{ marginTop: "20px" }}>
                  {" "}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: "100%" }} variant="outlined">
                        <Select
                          sx={{
                            width: "100%",
                            borderRadius: 12,
                            color: "rgba(0, 0, 0, 0.5)",
                          }}
                          aria-label="role"
                          name="section"
                          value={article.section ? article.section : ""}
                          onChange={handleChange}
                          MenuProps={menuProps}
                          displayEmpty
                          defaultValue="customer-admin"
                        >
                          <MenuItem value="" disabled>
                            Choose section
                          </MenuItem>

                          <MenuItem value="faq">FAQ</MenuItem>
                          <MenuItem value="documentation">
                            Documentation
                          </MenuItem>
                          <MenuItem value="videos">Video</MenuItem>
                        </Select>
                        {errors.section && (
                          <FormHelperText error>
                            Field is Required
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextFieldForm
                        type="text"
                        id="title"
                        label="Title*"
                        variant="outlined"
                        name="title"
                        title="Title"
                        value={article.title}
                        onChange={handleChange}
                        error={errors.title ? true : false}
                        helperText={errors && errors.title}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <JoditEditor
                        id="text-editor"
                        ref={editor}
                        value={article.body}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) =>
                          setArticle((prevState) => ({
                            ...prevState,
                            body: newContent,
                          }))
                        } // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                      {errors.body && <ImgError>{errors.body}</ImgError>}
                    </Grid>
                    <Grid item xs={12}>
                      {Object.keys(editInfo).length !== 0 && (
                        <Buttons
                          onClick={handleCancel}
                          sx={{
                            backgroundColor: "#49fcea",
                            borderColor: "#49fcea",
                            marginRight: 30,
                          }}
                        >
                          Cancel
                        </Buttons>
                      )}
                      <Buttons onClick={submitArticle} disabled={formLoader}>
                        {formLoader && <Spinner size={24} />}
                        {Object.keys(editInfo).length === 0
                          ? "Save"
                          : "Update"}{" "}
                      </Buttons>
                    </Grid>
                  </Grid>
                </form>
              </FormContainer>
            </Grid>
          </div>
        )}
      </Row>
    </Layout>
  );
};

export default Help;
