import { Outlet } from "react-router-dom";
import MarketingLayout from "../../Pages/Web/components/MarketingLayout";
import { useSelector } from "react-redux";
import { getSubDomain } from "Functions";
import { Navigate } from "react-router-dom";
const PublicLayout = () => {
      const { isAuth, user } = useSelector((state) => state.auth);
      const subDomain = getSubDomain();
    if (subDomain && user && user.role=== "customer-admin") {
        return <Navigate to="/user" replace />;
    }
  return (
    <div className="container">
      <MarketingLayout>
        <Outlet />
      </MarketingLayout>
    </div>
  );
};

export default PublicLayout;
