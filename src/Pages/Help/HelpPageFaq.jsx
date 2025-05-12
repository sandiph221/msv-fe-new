import { Container, Grid, makeStyles } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { HelpPageBannerSection } from "../../Components/HelpPageBannerSection/HelpPageBannerSection";
import Layout from "../../Components/Layout/index";
import Styles from "./Styles";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import HelpSectionList from "../../Components/HelpSectionList/HelpSectionList";
import { useDispatch, useSelector } from "react-redux";
import {
  getFaqList,
  searchArticle,
  setSearchQuery,
  clearSearchArticle,
} from "../../store/actions/HelpPageAction";
import Spinner from "../../Components/Spinner";

const useStyles = makeStyles((theme) => Styles(theme));

const HelpPageFaq = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    faqList,
    faqListLoader,
    searchArticlesLoader,
    searchArticles,
    searchQuery,
  } = useSelector((state) => state.helpReducer);

  //destructuring search articles list
  const { faqs } = searchArticles ? searchArticles : [];

  useEffect(() => {
    if (searchQuery !== "") {
      dispatch(searchArticle(searchQuery, "faqs"));
    } else {
      dispatch(getFaqList());
    }
  }, []);

  //using debounce to hit the api after user has stopped typing
  let debounceTimer = useRef();
  const debounce = (func, timeout = 500) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(func, timeout);
  };

  const handleSearch = (event) => {
    if (event.target.value === "") {
      dispatch(clearSearchArticle());
    }
    // searching articles section
    dispatch(setSearchQuery(event.target.value));
    debounce(() => dispatch(searchArticle(event.target.value, "faqs")));
  };

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div
          style={{
            marginTop: "16px",
          }}
        ></div>
        <HelpPageBannerSection
          searchQuery={searchQuery}
          handleSearch={handleSearch}
        />
        <Container style={{ marginTop: 55, marginBottom: 55 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: 60,
            }}
            onClick={() => history.push("/help")}
          >
            <KeyboardBackspaceIcon style={{ fontSize: 26, marginRight: 10 }} />
            <Typography style={{ fontSize: 20, fontWeight: 600 }}>
              Go Back
            </Typography>
          </div>
          <Container style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: " 60px 0px",
              }}
            >
              <Typography
                style={{
                  fontSize: 55,
                  fontWeight: 600,
                  color: "#708686",
                  letterSpacing: -1,
                }}
              >
                Faq
              </Typography>
              <Typography
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  marginLeft: 20,
                  color: "#000",
                  opacity: 0.7,
                }}
              >
                Frequently Asked Questions
              </Typography>
            </div>
            {searchQuery && searchQuery !== " " && searchArticlesLoader ? (
              <Spinner />
            ) : searchQuery &&
              searchQuery !== "" &&
              faqs &&
              faqs.length === 0 ? (
              <Typography style={{ textAlign: "center" }}>
                No result found
              </Typography>
            ) : (
              searchQuery &&
              searchQuery !== "" &&
              faqs && (
                <HelpSectionList searchQuery={searchQuery} sectionList={faqs} />
              )
            )}

            {faqListLoader ? (
              <Spinner />
            ) : faqList && !faqs ? (
              <>
                <HelpSectionList sectionList={faqList} />
              </>
            ) : null}
          </Container>
        </Container>
      </Grid>
    </Layout>
  );
};
export default withRouter(HelpPageFaq);
