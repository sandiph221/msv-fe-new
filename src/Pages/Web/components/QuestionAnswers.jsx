import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  accordion: {
    margin: "16px 0",
    borderRadius: "12px !important",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: "16px 0",
    },
    transition: "all 0.3s ease",
    border: "none",
    overflow: "hidden",
  },
  accordionExpanded: {
    backgroundColor: "rgba(63, 81, 181, 0.04)",
  },
  heading: {
    fontWeight: 600,
    fontSize: "1.1rem",
    color: theme.palette.primary.main,
  },
  accordionSummary: {
    padding: "8px 24px",
    "&.Mui-expanded": {
      minHeight: "64px",
      borderBottom: `1px solid rgba(63, 81, 181, 0.12)`,
    },
    "& .MuiAccordionSummary-content": {
      margin: "16px 0",
    },
  },
  expandIcon: {
    color: theme.palette.primary.main,
    fontSize: "1.5rem",
    transition: "transform 0.3s ease",
  },
  accordionDetails: {
    display: "block",
    padding: "24px 32px",
    backgroundColor: "rgba(63, 81, 181, 0.02)",
  },
  answerText: {
    color: "#424242",
    lineHeight: 1.7,
    fontSize: "1rem",
  },
}));

export const QuestionAnswers = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqData = [
    {
      id: "panel1",
      question: "What is Lorem by Ipsum?",
      answer: "Lorem by Ipsum (LBI) is a critical process where individuals can gain citizenship by investing in a country. The process involves applying to a government-approved program, undergoing a background check, and, if approved, making an economic contribution and receiving citizenship. The specifics of CBI programs vary by country."
    },
    {
      id: "panel2",
      question: "Can I get a new account and keep my current one?",
      answer: "Lorem by Ipsum (LBI) is a critical process where individuals can gain citizenship by investing in a country. The process involves applying to a government-approved program, undergoing a background check, and, if approved, making an economic contribution and receiving citizenship. The specifics of CBI programs vary by country."
    },
    {
      id: "panel3",
      question: "What platforms are supported by MSV?",
      answer: "Lorem by Ipsum (LBI) is a critical process where individuals can gain citizenship by investing in a country. The process involves applying to a government-approved program, undergoing a background check, and, if approved, making an economic contribution and receiving citizenship. The specifics of CBI programs vary by country."
    },
    {
      id: "panel4",
      question: "What are the minimum requirements?",
      answer: "Lorem by Ipsum (LBI) is a critical process where individuals can gain citizenship by investing in a country. The process involves applying to a government-approved program, undergoing a background check, and, if approved, making an economic contribution and receiving citizenship. The specifics of CBI programs vary by country."
    },
    {
      id: "panel5",
      question: "How fast is the process of getting a subscription?",
      answer: "Lorem by Ipsum (LBI) is a critical process where individuals can gain citizenship by investing in a country. The process involves applying to a government-approved program, undergoing a background check, and, if approved, making an economic contribution and receiving citizenship. The specifics of CBI programs vary by country."
    }
  ];

  return (
    <Box className={classes.root}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        style={{ 
          marginBottom: "40px", 
          fontWeight: 600,
          color: "#333"
        }}
      >
        Frequently Asked Questions
      </Typography>
      
      {faqData.map((faq) => (
        <Accordion
          key={faq.id}
          expanded={expanded === faq.id}
          onChange={handleChange(faq.id)}
          className={`${classes.accordion} ${expanded === faq.id ? classes.accordionExpanded : ''}`}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon className={classes.expandIcon} />
            }
            aria-controls={`${faq.id}-content`}
            id={`${faq.id}-header`}
            className={classes.accordionSummary}
          >
            <Typography className={classes.heading}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <Typography className={classes.answerText}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
