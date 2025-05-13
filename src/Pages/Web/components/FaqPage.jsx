import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Cta } from "./Cta";
import { Newsletter } from "./Newsletter";
import { Hero } from "./Hero";
import { QuestionAnswers } from "./QuestionAnswers";

const useStyles = makeStyles(() => ({
  outlineButton: {
    borderRadius: "9999px",
    border: "1px solid currentColor",
    padding: "10px 20px",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

const FAQPage = () => {
  const classes = useStyles();

  return (
    <div className="space-y-20">
      <Hero />
      <div className="grid space-y-10 md:grid-cols-5">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-primary"></div>
            <p className="text-sm font-light">FAQS</p>
          </div>
          <h3 className="text-3xl font-medium">Questions? Answers.</h3>
          <p className="font-light">Do you have any other question?</p>
          <Link to={"/contact"}>
            <Button variant="outlined" className={classes.outlineButton}>
              Message Us
            </Button>
          </Link>
        </div>
        <div className="col-span-3">
          <QuestionAnswers />
        </div>
      </div>
      <Cta />
      <Newsletter />
    </div>
  );
};
export default FAQPage;
