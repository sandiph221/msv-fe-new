import { Footer } from "../Footer/Footer";
import Navbar from "../Navbar";
import PlanWarningBar from "../PlanWarningBar/PlanWarningBar";
const Layout = ({ children }) => {
  return (
      <div className="min-h-screen flex flex-col pt-16">
          <Navbar />
        <PlanWarningBar/>
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;