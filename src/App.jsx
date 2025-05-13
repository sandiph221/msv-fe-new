import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Admin Pages
import AdminDashboardPage from "./Admin/Pages/AdminDashboardPage";
import Analytics from "./Admin/Pages/Analytics/AnalyticalComponent";
import { ContactSupport } from "./Admin/Pages/ContactSupport/ContactSupport";
import UserActivity from "./Admin/Pages/UserActivity/UserActivity";

// Auth Pages
import Login from "./Pages/Login/Login";
import RegisterPage from "./Pages/Register/Register";
import CardDetailPage from "./Pages/Register/CardDetail";
import ChangePasswordFromMail from "./Pages/ChangePasswordFromMail/ChangePasswordFromMail";

// Main Pages
import DashboardPage from "./Pages/DashboardPage/DashboardPage";
import ProfilePage from "./Pages/Profile/Profile";
import ContentNewsFeedPage from "./Pages/ContentNewsfeed/ContentNewsFeed";
import UserManagementPage from "./Pages/UserManagement/UserManagement";
import SocialListeningPage from "./Pages/SocialListeningPage/SocialListeningPage";
import ComparisonPage from "./Pages/ComparisionPage/ComparisonPage";
import ProfileListingPage from "./Pages/ProfileListingPage/ProfileListingPage";
import ProfileOverview from "./Pages/ProfileListingPage/ProfileOverview";

// Subscription Pages
import SubscriptionSetting from "./Pages/SubscriptionManagementSetting/SubscriptionSetting";
import CreatePlan from "./Pages/SubscriptionManagementSetting/CreatePlan";
import EditPlan from "./Pages/SubscriptionManagementSetting/EditPlan";
import SubscriptionDetail from "./Pages/SubscriptionManagementSetting/SubscriptionDetail";
import UpgradePlan from "./Pages/SubscriptionManagementSetting/Upgrade";

// Management Pages
import AccountManagement from "./Pages/AccountManagement/AccountManagement";
import CustomerAdminSetting from "./Pages/CustomerAdminSetting/CustomerAdminSetting";
import ContentManagement from "./Pages/ContentManagement/ContentManagement";
import NewPage from "./Pages/NewPage/NewPage";
import FAQ from "./Pages/FAQ/FAQ";

// Payment Pages
import PaymentVerifyPage from "./Pages/PaymentPage/VerificationPage";
import PaymentCancelPage from "./Pages/PaymentPage/CancellationPage";

// Help & Policy Pages
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import Help from "./Pages/Help/Help";
import HelpPageDoucment from "./Pages/Help/HelpPageDoucment";
import HelpPageFaq from "./Pages/Help/HelpPageFaq";
import HelpPageVideo from "./Pages/Help/HelpPageVideo";

// Components
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import AdminRoute from "./Components/PrivateRoute/AdminRoutes";

// Store & Utils
import { ChangePassword } from "./store/actions/AuthAction";

// Web Pages
import Homepage from "./Pages/Web/Homepage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/card-details" element={<CardDetailPage />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/change-password-from-mail"
        element={<ChangePasswordFromMail />}
      />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="user-activity" element={<UserActivity />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="/contact-support" element={<AdminRoute />}>
        <Route index element={<ContactSupport />} />
      </Route>

      {/* Payment Routes */}
      <Route path="/payment/verify" element={<PaymentVerifyPage />} />
      <Route path="/payment/cancel" element={<PaymentCancelPage />} />

      {/* Public Routes */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/web" element={<Homepage />} />

      {/* Protected Routes */}
      <Route path="/user" element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="brand-overview" element={<ProfileOverview />} />
        <Route path="comparision" element={<ProfileListingPage />} />
        <Route path="profile-comparison" element={<ComparisonPage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="social-listening" element={<SocialListeningPage />} />
        <Route path="content-newsfeed" element={<ContentNewsFeedPage />} />

        {/* Subscription Routes */}
        <Route path="subscription-details" element={<SubscriptionDetail />} />
        <Route
          path="subscription-management"
          element={<SubscriptionSetting />}
        />
        <Route path="upgrade" element={<UpgradePlan />} />
        <Route path="plan">
          <Route path="create" element={<CreatePlan />} />
          <Route path=":id" element={<EditPlan />} />
        </Route>

        {/* Management Routes */}
        <Route path="account-management" element={<AccountManagement />} />
        <Route
          path="customer-admin-setting"
          element={<CustomerAdminSetting />}
        />
        <Route path="cms" element={<ContentManagement />} />
        <Route path="cms/page">
          <Route path="new" element={<NewPage />} />
          <Route path=":id/edit" element={<NewPage />} />
        </Route>
        <Route path="cms/faq">
          <Route path="new" element={<FAQ />} />
          <Route path=":id/edit" element={<FAQ />} />
        </Route>

        {/* Help Routes */}
        <Route path="help" element={<Help />} />
        <Route path="help/faq" element={<HelpPageFaq />} />
        <Route path="help/how-to-document" element={<HelpPageDoucment />} />
        <Route path="help/videos" element={<HelpPageVideo />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
export { default as AdminDashboardPage } from "./Admin/Pages/AdminDashboardPage";
