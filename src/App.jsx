import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import RegisterPage from "./Pages/Register/Register";
import CardDetailPage from "./Pages/Register/CardDetail";
import ChangePasswordFromMail from "./Pages/ChangePasswordFromMail/ChangePasswordFromMail";
// import DashboardPage from "./Pages/DashboardPage/DashboardPage";
import ProfilePage from "./Pages/Profile/Profile";
// import ContentNewsFeedPage from "./Pages/ContentNewsfeed/ContentNewsFeed";
import UserManagementPage from "./Pages/UserManagement/UserManagement";
import SubscriptionSetting from "./Pages/SubscriptionManagementSetting/SubscriptionSetting";
import CreatePlan from "./Pages/SubscriptionManagementSetting/CreatePlan";
import EditPlan from "./Pages/SubscriptionManagementSetting/EditPlan";
import SubscriptionDetail from "./Pages/SubscriptionManagementSetting/SubscriptionDetail";
import UpgradePlan from "./Pages/SubscriptionManagementSetting/Upgrade";
import AccountManagement from "./Pages/AccountManagement/AccountManagement";
import CustomerAdminSetting from "./Pages/CustomerAdminSetting/CustomerAdminSetting";
import ContentManagement from "./Pages/ContentManagement/ContentManagement";
// import NewPage from "./Pages/NewPage/NewPage";
// import FAQ from "./Pages/FAQ/FAQ";
// import SocialListeningPage from "./Pages/SocialListeningPage/SocialListeningPage";
// import ComparisonPage from "./Pages/ComparisionPage/ComparisonPage";
// import ProfileListingPage from "./Pages/ProfileListingPage/ProfileListingPage";
// import ProfileOverview from "./Pages/ProfileListingPage/ProfileOverview";
import PaymentVerifyPage from "./Pages/PaymentPage/VerificationPage";
// import PaymentCancelPage from "./Pages/PaymentPage/CancellationPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
// import Help from "./Pages/Help/Help";
// import HelpPageDoucment from "./Pages/Help/HelpPageDoucment";
// import HelpPageFaq from "./Pages/Help/HelpPageFaq";
// import HelpPageVideo from "./Pages/Help/HelpPageVideo";
// import AdminDashboardPage from "./Admin/Pages/AdminDashboardPage";
// import Analytics from "./Admin/Pages/Analytics/Analytics";
// import { ContactSupport } from "./Admin/Pages/ContactSupport/ContactSupport";
// import UserActivity from "./Admin/Pages/UserActivity/UserActivity";
import Homepage from "./Pages/Web/Homepage";
import { ChangePassword } from "./store/actions/AuthAction";

function Home() {
  return <h1 className="underline">THis still is Home Page</h1>;
}

function About() {
  return <h1 className="underline">About Page</h1>;
}

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
