import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontWeight: 500,
  },
  accordionDetails: {
    display: "block",
  },
}));

export const QuestionAnswers = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={`${classes.root} w-full`}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        className="border-b"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="py-4"
        >
          <Typography className={classes.heading}>
            What is Lorem by Ipsum?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className="text-gray-700">
            Lorem by Ipsum (LBI) is a critical process where individuals can
            gain citizenship by investing in a country. The process involves
            applying to a government-approved program, undergoing a background
            check, and, if approved, making an economic contribution and
            receiving citizenship. The specifics of CBI programs vary by
            country.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
        className="border-b"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          className="py-4"
        >
          <Typography className={classes.heading}>
            Can I get a new account and keep my current one?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className="text-gray-700">
            Lorem by Ipsum (LBI) is a critical process where individuals can
            gain citizenship by investing in a country. The process involves
            applying to a government-approved program, undergoing a background
            check, and, if approved, making an economic contribution and
            receiving citizenship. The specifics of CBI programs vary by
            country.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        className="border-b"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          className="py-4"
        >
          <Typography className={classes.heading}>
            What platforms are supported by MSV?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className="text-gray-700">
            Lorem by Ipsum (LBI) is a critical process where individuals can
            gain citizenship by investing in a country. The process involves
            applying to a government-approved program, undergoing a background
            check, and, if approved, making an economic contribution and
            receiving citizenship. The specifics of CBI programs vary by
            country.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
        className="border-b"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
          className="py-4"
        >
          <Typography className={classes.heading}>
            What are the minimum requirements?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className="text-gray-700">
            Lorem by Ipsum (LBI) is a critical process where individuals can
            gain citizenship by investing in a country. The process involves
            applying to a government-approved program, undergoing a background
            check, and, if approved, making an economic contribution and
            receiving citizenship. The specifics of CBI programs vary by
            country.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
        className="border-b"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
          className="py-4"
        >
          <Typography className={classes.heading}>
            How fast is the process of getting a subscription?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography className="text-gray-700">
            Lorem by Ipsum (LBI) is a critical process where individuals can
            gain citizenship by investing in a country. The process involves
            applying to a government-approved program, undergoing a background
            check, and, if approved, making an economic contribution and
            receiving citizenship. The specifics of CBI programs vary by
            country.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
