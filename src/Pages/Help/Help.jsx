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
    Box,
    Paper,
  } from "@material-ui/core";
  import React, { useEffect, useRef, useState } from "react";
  import Layout from "../../Components/Layout";
  import SearchIcon from '@material-ui/icons/Search';
  import HelpSectionList from "../../Components/HelpSectionList/HelpSectionList";
  import PersonAddIcon from '@material-ui/icons/PersonAdd';
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
  import VisibilityIcon from '@material-ui/icons/Visibility';
  import CreateIcon from '@material-ui/icons/Create';
  import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
  import ExpandLessIcon from '@material-ui/icons/ExpandLess';
  import HelpIcon from '@material-ui/icons/Help';
  import Spinner from "../../Components/Spinner";
  import InfoIcon from '@material-ui/icons/Info';
  import MailOutlineIcon from '@material-ui/icons/MailOutline';
  import YouTubeIcon from '@material-ui/icons/YouTube';
  import DeleteIcon from '@material-ui/icons/Delete';
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
      "&:hover fieldset": {
        borderColor: "#19a96e",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#19a96e",
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
      "&:hover fieldset": {
        borderColor: "#19a96e",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#19a96e",
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#19a96e",
    },
  });
  
  const StyledAccordion = styled(Accordion)({
    width: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    borderRadius: "12px !important",
    marginBottom: "16px",
    "&:before": {
      display: "none",
    },
    "& .MuiAccordionSummary-root": {
      borderRadius: "12px",
    },
  });
  
  const Row = styled(Grid)({
    width: "100%",
  });
  
  const AsideTop = styled("div")({
    padding: "20px 16px",
    borderBottom: "1px solid #f0f0f0",
  });
  
  const UserContainer = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  });
  
  const UserType = styled(Typography)({
    fontSize: "20px",
    fontWeight: 500,
    color: "#323132",
    marginBottom: "16px",
  });
  
  const FormContainer = styled(Grid)({
    padding: "24px",
    backgroundColor: "#fff",
  });
  
  const ArticleCard = styled(Card)({
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
    "& .MuiCardContent-root": {
      padding: "16px",
    },
    "& .MuiCardActions-root": {
      padding: "8px 16px",
      justifyContent: "flex-end",
    },
  });
  
  const HelpList = styled(Paper)({
    padding: "24px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "16px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
    "& p": {
      margin: 0,
      marginLeft: "16px",
      fontSize: "16px",
      fontWeight: 500,
    },
  });
  
  const HelpIconList = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  });
  
  const ImgError = styled(Typography)({
    color: "#f44336",
    fontSize: "12px",
    marginTop: "4px",
  });
  
  const StyledSelect = styled(Select)({
    width: "100%",
    borderRadius: 12,
    color: "rgba(0, 0, 0, 0.7)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: 12,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#19a96e",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#19a96e",
    },
  });
  
  const ActionButton = styled(Buttons)({
    borderRadius: "8px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
    "&:hover": {
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
  });
  
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
      if (!article.body) {
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
      height: 400,
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
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
      getContentAnchorEl: null,
      PaperProps: {
        style: {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    };
  
    return (
      <Layout>
        <Row container>
          {user && user.role !== constant.SUPER_ADMIN_NAME ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                backgroundColor: "#f9f9f9",
              }}
            >
              <HelpPageBannerSection
                searchQuery={searchQuery}
                handleKeyPress={() => navigate("/help/faq")}
                handleSearch={handleSearch}
              />
              <Container style={{ marginTop: 60, marginBottom: 60 }}>
                <Grid container spacing={3}>
                  <Grid item sm={12} md={6}>
                    <HelpList onClick={() => navigate("/help/faq")}>
                      <Box style={{ display: "flex", alignItems: "center" }}>
                        <HelpIconList style={{ backgroundColor: "#ff91571a" }}>
                          <HelpIcon style={{ color: "#ff9157", fontSize: 21 }} />
                        </HelpIconList>
                        <p> FAQs </p>
                      </Box>
                    </HelpList>
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <HelpList onClick={() => navigate("/help/how-to-document")}>
                      <Box style={{ display: "flex", alignItems: "center" }}>
                        <HelpIconList style={{ backgroundColor: "#19a96e1a" }}>
                          <InfoIcon style={{ color: "#19a96e" }} />
                        </HelpIconList>
                        <p> How to Documents? </p>
                      </Box>
                    </HelpList>
                  </Grid>
                  <Grid item sm={12} md={6}>
                  <HelpList>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <HelpIconList style={{ backgroundColor: "#4a86e81a" }}>
                        <MailOutlineIcon style={{ color: "#4a86e8" }} />
                      </HelpIconList>
                      <AddModalForm />
                    </Box>
                  </HelpList>
                </Grid>
                <Grid item sm={12} md={6}>
                  <HelpList onClick={() => navigate("/help/videos")}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <HelpIconList style={{ backgroundColor: "#ff00001a" }}>
                        <YouTubeIcon style={{ color: "#ff0000" }} />
                      </HelpIconList>
                      <p> Help videos </p>
                    </Box>
                  </HelpList>
                </Grid>
              </Grid>
            </Container>
          </Box>
        ) : (
          <Box style={{ width: "100%" }}>
            <Grid container>
              <Grid xl={3} lg={4} md={5} sm={12} xs={12} item>
                <Box
                  style={{
                    backgroundColor: "#fff",
                    height: "100%",
                    borderRight: "1px solid #f0f0f0",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <AsideTop>
                    <UserContainer>
                      <UserType>
                        <strong>Help Center</strong>
                      </UserType>
                    </UserContainer>
                    <StyledTextField
                      fullWidth
                      hinttext="Search by Name"
                      variant="outlined"
                      placeholder="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ color: "#323132" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </AsideTop>
                  <List style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", padding: "8px" }}>
                    {article && article.section === "faq" ? (
                      faqListLoader ? (
                        <Box style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                          <Spinner size={24} />
                        </Box>
                      ) : faqList && faqList.length > 0 ? (
                        faqList.map((item, index) => (
                          <ListItem key={index} style={{ padding: "8px" }}>
                            <ArticleCard>
                              <CardContent>
                                <Typography style={{ fontWeight: 500 }}>{item.title}</Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  style={{ cursor: "pointer", color: "#19a96e" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        <Box style={{ padding: "20px", textAlign: "center" }}>
                          <Typography style={{ color: "#666" }}>No FAQs found</Typography>
                        </Box>
                      )
                    ) : article.section === "documentation" ? (
                      howToDocListLoader ? (
                        <Box style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                          <Spinner size={24} />
                        </Box>
                      ) : howToDocList && howToDocList.length > 0 ? (
                        howToDocList.map((item, index) => (
                          <ListItem key={index} style={{ padding: "8px" }}>
                            <ArticleCard>
                              <CardContent>
                                <Typography style={{ fontWeight: 500 }}>{item.title}</Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  style={{ cursor: "pointer", color: "#19a96e" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        <Box style={{ padding: "20px", textAlign: "center" }}>
                          <Typography style={{ color: "#666" }}>No documentation found</Typography>
                        </Box>
                      )
                    ) : article.section === "videos" ? (
                      videoListLoader ? (
                        <Box style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                          <Spinner size={24} />
                        </Box>
                      ) : videoList && videoList.length > 0 ? (
                        videoList.map((item, index) => (
                          <ListItem key={index} style={{ padding: "8px" }}>
                            <ArticleCard>
                              <CardContent>
                                <Typography style={{ fontWeight: 500 }}>{item.title}</Typography>
                              </CardContent>
                              <CardActions>
                                <CreateIcon
                                  style={{ cursor: "pointer", color: "#19a96e" }}
                                  onClick={() => setEditInfo(item)}
                                />
                              </CardActions>
                            </ArticleCard>
                          </ListItem>
                        ))
                      ) : (
                        <Box style={{ padding: "20px", textAlign: "center" }}>
                          <Typography style={{ color: "#666" }}>No videos found</Typography>
                        </Box>
                      )
                    ) : (
                      <Box style={{ padding: "20px", textAlign: "center" }}>
                        <Typography style={{ color: "#666" }}>Select a section to view content</Typography>
                      </Box>
                    )}
                  </List>
                </Box>
              </Grid>
              <FormContainer
                xl={9}
                lg={8}
                md={7}
                sm={12}
                xs={12}
                item
              >
                <Paper style={{ padding: "24px", borderRadius: "12px", boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)" }}>
                  {Object.keys(editInfo).length === 0 ? (
                    <UserType>
                      <strong>New Article</strong>
                    </UserType>
                  ) : (
                    <Box
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px"
                      }}
                    >
                      <UserType style={{ margin: 0 }}>
                        <strong>Update Article</strong>
                      </UserType>
                      <ActionButton
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
                        style={{
                          backgroundColor: "#F44336",
                          borderColor: "#F44336",
                          color: "#fff",
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete Article
                      </ActionButton>
                    </Box>
                  )}

                  <form style={{ marginTop: "20px" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl style={{ width: "100%" }} variant="outlined">
                          <StyledSelect
                            name="section"
                            value={article.section ? article.section : ""}
                            onChange={handleChange}
                            MenuProps={menuProps}
                            displayEmpty
                            variant="outlined"
                            error={errors.section ? true : false}
                          >
                            <MenuItem value="" disabled>
                              Choose section
                            </MenuItem>
                            <MenuItem value="faq">FAQ</MenuItem>
                            <MenuItem value="documentation">Documentation</MenuItem>
                            <MenuItem value="videos">Video</MenuItem>
                          </StyledSelect>
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
                        <Box style={{ border: errors.body ? "1px solid #f44336" : "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden" }}>
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
                        </Box>
                        {errors.body && <ImgError>{errors.body}</ImgError>}
                      </Grid>
                      <Grid item xs={12}>
                        <Box style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                          {Object.keys(editInfo).length !== 0 && (
                            <ActionButton
                              onClick={handleCancel}
                              style={{
                                backgroundColor: "#f5f5f5",
                                borderColor: "#e0e0e0",
                                color: "#666",
                                marginRight: "16px",
                              }}
                            >
                              Cancel
                            </ActionButton>
                          )}
                          <ActionButton 
                            onClick={submitArticle} 
                            disabled={formLoader}
                            style={{
                              backgroundColor: "#19a96e",
                              borderColor: "#19a96e",
                              color: "#fff",
                            }}
                          >
                            {formLoader ? <Spinner size={24} /> : Object.keys(editInfo).length === 0 ? "Save" : "Update"}
                          </ActionButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </FormContainer>
            </Grid>
          </Box>
        )}
      </Row>
    </Layout>
  );
};

export default Help;
