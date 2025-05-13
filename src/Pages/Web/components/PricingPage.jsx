import { Cta } from "./Cta";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { Plans } from "./Plans";

const PricingPage = () => {
  return (
    <div className="container space-y-20 pt-14">
      <Hero />
      <Plans />
      <Cta />
      <Newsletter />
    </div>
  );
};

export default PricingPage;
