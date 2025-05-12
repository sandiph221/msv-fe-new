
import { Footer } from "../Footer/Footer";
import Navbar from "../Navbar";
const Layout = ({
  children
}) => {
  return (
    <div style={{
      minHeight: "100vh",
      display:"flex",
      flexDirection:"column" }}
      >
      <Navbar />
      <div style={{flexGrow: 1}}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
