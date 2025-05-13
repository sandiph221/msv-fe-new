import { Outlet } from "react-router-dom";
import MarketingLayout from "../../Pages/Web/components/MarketingLayout";

const PublicLayout = () => {
  return (
    <div className="container">
      <MarketingLayout>
        <Outlet />
      </MarketingLayout>
    </div>
  );
};

export default PublicLayout;
