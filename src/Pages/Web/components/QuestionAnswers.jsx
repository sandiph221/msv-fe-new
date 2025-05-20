import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    CircularProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

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
    loaderContainer: {
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
        padding: "20px",
    },
}));

const fetchFaqs = async () => {
    try {
        const response = await axios.get("/faqs");
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        throw error;
    }
};

export const QuestionAnswers = () => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFaqs = async () => {
            try {
                setLoading(true);
                const result = await fetchFaqs();

                if (result.status && result.data) {
                    // Transform the data into the format needed for FAQs
                    const formattedFaqs = result.data.map((item) => ({
                        id: `panel${item.id}`,
                        question: item.title,
                        answer: item.description
                    }));

                    setFaqs(formattedFaqs);
                } else {
                    setError("Failed to load FAQs");
                }
            } catch (err) {
                setError("Error loading FAQs. Please try again later.");
                console.error("Error in getFaqs:", err);
            } finally {
                setLoading(false);
            }
        };

        getFaqs();
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (loading) {
        return (
            <Box className={classes.loaderContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.errorMessage}>
                    {error}
                </Typography>
            </Box>
        );
    }

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

            {faqs.length > 0 ? (
                faqs.map((faq) => (
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
                            <Typography
                                className={classes.answerText}
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography align="center">No FAQs available at the moment.</Typography>
            )}
        </Box>
    );
};
