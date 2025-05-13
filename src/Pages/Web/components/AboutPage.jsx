import { Cta } from "./Cta";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { Testimonial } from "./Testimonial";
import { Story } from "./Story";

const AboutPage = () => {
  return (
    <div className="space-y-20">
      <Hero />
      <Story />
      <Testimonial />
      <Cta />
      <Newsletter />
    </div>
  );
};
export default AboutPage;
