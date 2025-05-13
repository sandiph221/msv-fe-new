import { Cta } from "./Cta";
import { Newsletter } from "./Newsletter";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Information } from "./Information";

const Homepage = () => {
  return (
    <div className="container">
      <Hero />
      <Information />
      <Features />
      <Pricing />
      <Cta />
      <Newsletter />
    </div>
  );
};
export default Homepage;
