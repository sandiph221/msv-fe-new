import logoImg from "../../assets/images/msvfooterLogo.png";
import bannerImg from "../../assets/images/msv-default-banner.png";

const initState = {
  pages: [],
  logoURL: logoImg,
  hasPaid: false,
  bannerURL: bannerImg,
  subdomainID: null,
  logoBannerDataLoaded: false,
};

const SettingsReducer = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_LOGO_AND_BANNER":
      let logoURL = action.payload
        ? action.payload.logo
          ? action.payload.logo
          : logoImg
        : logoImg;
      let bannerURL = action.payload
        ? action.payload.feature_image
          ? action.payload.feature_image
          : bannerImg
        : bannerImg;
      let subdomainID = action.payload
        ? action.payload.id
          ? action.payload.id
          : null
        : null;

      return {
        ...state,
        logoURL: logoURL,
        bannerURL: bannerURL,
        subdomainID,
        hasPaid: !!action.payload.has_paid,
        logoBannerDataLoaded: true,
      };

    default:
      return state;
  }
};

export default SettingsReducer;
