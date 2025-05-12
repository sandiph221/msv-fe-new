import { useEffect } from "react";
import { makeStyles } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider, List, ListItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import parse from "html-react-parser";
import Highlighter from "react-highlight-words";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  header: {
    padding: "20px 40px 20px 20px",
    "& .MuiAccordionSummary-content": {
      margin: 0,
    },
  },
}));

const concatHTML = (textArray, text = "") => {
  if (!textArray) return text;

  if (Array.isArray(textArray)) {
    textArray.forEach((ta) => {
      if (ta && ta.props) {
        text = concatHTML(ta.props.children, text);
      } else if (ta) {
        text = text + ta;
      }
    });
  } else if (typeof textArray === "string") {
    return text + textArray;
  }

  return text;
};

const getRenderedHtml = (html) => {
  if (!html || html === "") return "";

  try {
    const output = parse(html);

    if (Array.isArray(output)) {
      return concatHTML(output);
    } else if (output.props && output.props.children) {
      return concatHTML(output.props.children);
    }

    return String(output);
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return "";
  }
};

export default function HelpSectionList({ searchQuery, sectionList }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (sectionList.length !== 0) {
      setExpanded(sectionList[0].id);
    }
  }, [sectionList]);

  // This function is simplified since html-react-parser handles HTML differently
  const parseHtmlForHighlighting = (html) => {
    if (!html || html === "") return "";

    try {
      const parsed = parse(html);
      if (typeof parsed === "string") {
        return parsed;
      } else {
        // For complex HTML structures, we might need to extract text
        // This is a simplified approach
        return String(parsed);
      }
    } catch (error) {
      console.error("Error parsing HTML for highlighting:", error);
      return "";
    }
  };

  return (
    <div className={classes.root}>
      {sectionList.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded === section.id}
          onChange={handleChange(section.id)}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className={classes.header}
            style={{
              backgroundColor: expanded === section.id ? "#FBE281" : "#fff",
            }}
          >
            <Typography
              style={{
                flexGrow: 1,
                fontSize: 18,
                color: expanded === section.id ? "#fff" : "#323132",
                fontWeight: 400,
              }}
            >
              {section.title}
            </Typography>
            {expanded === section.id ? (
              <RemoveIcon style={{ color: "#fff" }} />
            ) : (
              <AddIcon style={{ color: "#323132" }} />
            )}
          </AccordionSummary>
          <Divider />
          <List>
            <AccordionDetails>
              <ListItem style={{ cursor: "pointer" }}>
                <Typography>
                  {searchQuery ? (
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[searchQuery]}
                      textToHighlight={parseHtmlForHighlighting(
                        section.description
                      )}
                    />
                  ) : (
                    parse(section.description)
                  )}
                </Typography>
              </ListItem>
            </AccordionDetails>
          </List>
        </Accordion>
      ))}
    </div>
  );
}
