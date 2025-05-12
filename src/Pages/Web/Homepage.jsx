import { Cta } from "./components/Cta";
import { Newsletter } from "./components/Newsletter";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { Information } from "./components/Information";
const Homepage = () => {
  return (
    <div className="container">
      HELLO FROM HERLL
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
