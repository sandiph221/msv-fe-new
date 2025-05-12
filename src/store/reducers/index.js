import { combineReducers } from "redux";
import ApiResReducer from "./ApiResReducer";
import AuthReducer from "./AuthReducer";
import DashboardReducer from "./DashboardReducer";
import ComparisonReducer from "./ComparisonReducer";
import SettingsReducer from "./SettingsReducer";
import SocialListeningReducer from "./SocialListeningReducer";
import ToastReducer from "./ToastReducer";
import CustomerReducer from "./CustomerReducer";
import SocialMediaProfileListReducer from "./SocialMediaProfilesList";
import HelpPageReducer from "./HelpPagereducer";
import { SuperAdminDashboardReducer } from "./SuperAdminDashboardReducer";

import UserActivityReducer from "./UserActivityReducer";

export const reducers = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  comparison: ComparisonReducer,
  settings: SettingsReducer,
  social: SocialListeningReducer,
  toast: ToastReducer,
  customerInfo: CustomerReducer,
  apiResReducer: ApiResReducer,
  socialMediaProfileListReducer: SocialMediaProfileListReducer,
  helpReducer: HelpPageReducer,
  adminDashboardReducer: SuperAdminDashboardReducer,
  userActivityReducer: UserActivityReducer,


});
