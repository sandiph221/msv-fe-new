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
import ChangePasswordFromMail from "./Pages/ChangePasswordFromMail/ChangePasswordFromMail";

// Main Pages
import DashboardPage from "./Pages/DashboardPage/DashboardPage";
import ProfilePage from "./Pages/Profile/Profile";
import ContentNewsFeedPage from "./Pages/ContentNewsfeed/ContentNewsFeed";
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
import CustomerAdminUserMgmt from "./Pages/UserManagement/CustomerAdminUserMgmt";
import SuperAdminUserMgmt from "./Pages/UserManagement/SuperAdminUserMgmt";
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
import PrivateLayout from "./Components/Layouts/PrivateLayout";
import AdminLayout from "./Components/Layouts/AdminLayout";

// Store & Utils
import { ChangePassword } from "./store/actions/AuthAction";
import PublicLayout from "./Components/Layouts/PublicLayout";
import PricingPage from "./Pages/Web/components/PricingPage";
import Homepage from "./Pages/Web/components/Homepage";
import AboutPage from "./Pages/Web/components/AboutPage";
import FAQPage from "./Pages/Web/components/FaqPage";
import { Contact } from "./Pages/Web/components/ContactPage";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import SubdomainLogin from "./Components/SubdomainLogin/SubdomainLogin";
import { EditorProvider } from "react-simple-wysiwyg";

// Web Pages

function App() {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Homepage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/subdomain-login" element={<SubdomainLogin />} />
                <Route path="/payment/verify" element={<PaymentVerifyPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Route>


            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Analytics />} />
                <Route path="dashboard/old" element={<AdminDashboardPage />} />
                <Route path="user-activity" element={<UserActivity />} />
                <Route path="user-management" element={<SuperAdminUserMgmt />} />
                {/* <Route path="analytics" element={<Analytics />} /> */}
                <Route
                    path="subscription-management"
                    element={<SubscriptionSetting />}
                />

                <Route path="cms" element={<ContentManagement />} />
                <Route path="cms/page/new" element={<NewPage />} />
                <Route path="cms/page/:id/edit" element={<NewPage />} />
                <Route path="cms/faq/new" element={<FAQ />} />
                <Route path="cms/faq/:id/edit" element={<FAQ />} />
                <Route path="plan/create" element={<CreatePlan />} />
                <Route path="plan/:id" element={<EditPlan />} />
                <Route path="contact-support" element={<ContactSupport />} />

            </Route>





            {/* Protected Routes (customeradmin routes) */}
            <Route path="/user" element={<PrivateLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="brand-overview" element={<ProfileOverview />} />
                <Route path="comparision" element={<ProfileListingPage />} />
                <Route path="profile-comparison" element={<ComparisonPage />} />
                <Route path="user-management" element={<CustomerAdminUserMgmt />} />
                <Route path="social-listening" element={<SocialListeningPage />} />
                <Route path="content-newsfeed" element={<ContentNewsFeedPage />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="account-management" element={<AccountManagement />} />

                <Route
                    path="change-password-from-mail"
                    element={<ChangePasswordFromMail />}
                />
                <Route path="upgrade" element={<UpgradePlan />} />
                <Route
                    path="customer-admin-setting"
                    element={<CustomerAdminSetting />}
                />
                <Route path="help" element={<Help />} />
                <Route path="help/faq" element={<HelpPageFaq />} />
                <Route path="help/how-to-document" element={<HelpPageDoucment />} />
                <Route path="help/videos" element={<HelpPageVideo />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
export { default as AdminDashboardPage } from "./Admin/Pages/AdminDashboardPage";
