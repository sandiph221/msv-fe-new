import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const useStyles = makeStyles((theme) => ({
  carouselContainer: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  carouselContent: {
    display: "flex",
    transition: "transform 0.5s ease",
  },
  carouselItem: {
    flex: "0 0 100%",
    width: "100%",
  },
  navigationButton: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  nextButton: {
    backgroundColor: "var(--primary)",
    color: "var(--background)",
    "&:hover": {
      backgroundColor: "var(--primary-80)",
      color: "var(--background)",
    },
  },
}));

export const Testimonial = () => {
  const classes = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [1, 2, 3]; // Number of testimonials

  const handlePrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <div className="space-y-2.5 pb-8">
        <h3 className="text-3xl font-medium">What our clients have to say</h3>
        <div className="flex gap-4">
          <p className="mr-auto max-w-lg font-light">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
          <IconButton
            className={`${classes.navigationButton} h-10 w-10 rounded-md`}
            onClick={handlePrevious}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            className={`${classes.nextButton} h-10 w-10 rounded-md`}
            onClick={handleNext}
          >
            <ChevronRight size={20} />
          </IconButton>
        </div>
      </div>

      <div className={classes.carouselContainer}>
        <div
          className={classes.carouselContent}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((_, index) => (
            <div key={index} className={classes.carouselItem}>
              <TestimonialItem />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialItem = () => {
  return (
    <div className="grid grid-cols-6 gap-6">
      <div className="col-span-2 rounded-3xl bg-primary/20"></div>
      <div className="col-span-4 space-y-8 rounded-3xl bg-primary/20 p-6 lg:p-8">
        <div className="flex text-primary">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="size-5" fill="currentColor" />
          ))}
        </div>
        <div className="space-y-4">
          <p className="text-3xl">"Revitalized my work approach"</p>
          <p className="text-lg font-light text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <p className="flex items-center gap-2">
          Stephanie Powell
          <span className="text-sm text-muted-foreground">
            | VP of Sales at SalesForce
          </span>
        </p>
      </div>
    </div>
  );
};
