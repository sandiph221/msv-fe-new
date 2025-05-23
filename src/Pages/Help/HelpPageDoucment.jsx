import { Container, Grid, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { HelpPageBannerSection } from "../../Components/HelpPageBannerSection/HelpPageBannerSection";
import Layout from "../../Components/Layout/index";
import Styles from "./Styles";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getHowToDocList,
  searchArticle,
} from "../../store/actions/HelpPageAction";
import parse from "html-react-parser";
import Spinner from "../../Components/Spinner";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => Styles(theme));

const HelpPageDoucment = ( ) => {
    const classes = useStyles();
    const navigate= useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const {
    howToDocList,
    howToDocListLoader,
    searchArticlesLoader,
    searchArticles,
  } = useSelector((state) => state.helpReducer);

  //destructuring search articles list
  const { howToDocs } = searchArticles ? searchArticles : [];

  useEffect(() => {
    dispatch(getHowToDocList());
  }, []);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    dispatch(searchArticle(event.target.value, "how-to-docs"));
  };

  return (
    <Layout>
      <Grid className={classes.row} container>
        <div
          style={{
            marginTop: "16px",
          }}
        ></div>
        <HelpPageBannerSection handleSearch={handleSearch} />
        <Container style={{ marginTop: 55, marginBottom: 55 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: 60,
            }}
            onClick={() => navigate("/help")}
          >
            <KeyboardBackspaceIcon style={{ fontSize: 26, marginRight: 10 }} />
            <Typography style={{ fontSize: 20, fontWeight: 600 }}>
              Go Back
            </Typography>
          </div>
          <Container style={{ position: "relative" }}>
            {searchValue && searchValue !== "" && searchArticlesLoader ? (
              <Spinner />
            ) : searchValue &&
              searchValue !== "" &&
              howToDocs &&
              howToDocs.length === 0 ? (
              <Typography style={{ textAlign: "center" }}>
                No result found
              </Typography>
            ) : (
              searchValue &&
              searchValue !== "" &&
              howToDocs &&
              howToDocs.map((data) => {
                return parse(data.description);
              })
            )}
            {searchValue === "" && howToDocListLoader ? (
              <Spinner />
            ) : (
              searchValue === "" &&
              howToDocList &&
              howToDocList.map((data) => {
                return parse(data.description);
              })
            )}
          </Container>
        </Container>
      </Grid>
    </Layout>
  );
};

export default HelpPageDoucment;
