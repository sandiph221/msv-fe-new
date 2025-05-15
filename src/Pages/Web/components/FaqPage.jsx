import React from "react";
import { Button, Typography, Box, Container, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import MessageIcon from "@material-ui/icons/Message";
import { Cta } from "./Cta";
import { Newsletter } from "./Newsletter";
import { Hero } from "./Hero";
import { QuestionAnswers } from "./QuestionAnswers";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FAFAFA",
  },
  mainSection: {
    padding: theme.spacing(8, 0),
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    overflow: "hidden",
  },
  sidebarContainer: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(4, 2),
      textAlign: "center",
      alignItems: "center",
    },
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  indicatorText: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: "#333",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "1.125rem",
    fontWeight: 400,
    color: "#666",
    marginBottom: theme.spacing(4),
    lineHeight: 1.5,
  },
  outlineButton: {
    borderRadius: "9999px",
    border: `2px solid ${theme.palette.primary.main}`,
    padding: "12px 28px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    color: theme.palette.primary.main,
    backgroundColor: "white",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    },
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  questionsContainer: {
    padding: theme.spacing(2, 4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(4, 2),
    },
  },
  spacer: {
    marginBottom: theme.spacing(10),
  },
}));

const FAQPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Hero />
      
      <Container maxWidth="lg">
        <Paper elevation={0} className={classes.mainSection}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Box className={classes.sidebarContainer}>
                <div className={classes.indicator}>
                  <div className={classes.indicatorDot}></div>
                  <Typography className={classes.indicatorText}>
                    FAQS
                  </Typography>
                </div>
                
                <Typography variant="h2" className={classes.title}>
                  Questions?<br />We've Got Answers.
                </Typography>
                
                <Typography className={classes.subtitle}>
                  Can't find what you're looking for? We're here to help with any other questions you might have.
                </Typography>
                
                <Link to="/contact" style={{ textDecoration: "none" }}>
                  <Button 
                    variant="outlined" 
                    className={classes.outlineButton}
                    startIcon={<MessageIcon className={classes.buttonIcon} />}
                  >
                    Message Us
                  </Button>
                </Link>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box className={classes.questionsContainer}>
                <QuestionAnswers />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      <div className={classes.spacer}>
        <Cta />
      </div>
      
      <Newsletter />
    </div>
  );
};

export default FAQPage;
