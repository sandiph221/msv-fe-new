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
            // ✅ Handle different sources of UPDATE_LOGO_AND_BANNER action
            const isFromSubdomainLoad = action.payload && (action.payload.id !== undefined || action.payload.has_paid !== undefined);

            let logoURL = logoImg;
            let bannerURL = bannerImg;
            let subdomainID = state.subdomainID;
            let hasPaid = state.hasPaid; // ✅ Preserve existing hasPaid state

            if (action.payload) {
                // Handle logo
                if (action.payload.logo) {
                    logoURL = action.payload.logo;
                } else if (action.payload.logoURL) {
                    logoURL = action.payload.logoURL;
                }

                // Handle banner - check both property names
                if (action.payload.feature_image) {
                    bannerURL = action.payload.feature_image;
                } else if (action.payload.featured_image) {
                    bannerURL = action.payload.featured_image;
                } else if (action.payload.bannerURL) {
                    bannerURL = action.payload.bannerURL;
                }

                // ✅ Only update these if they exist (from subdomain load)
                if (isFromSubdomainLoad) {
                    subdomainID = action.payload.id || null;
                    hasPaid = !!action.payload.has_paid;
                }
            }

            return {
                ...state,
                logoURL,
                bannerURL,
                subdomainID,
                hasPaid, // ✅ Only update hasPaid from subdomain load, not from banner upload
                logoBannerDataLoaded: true,
            };

        default:
            return state;
    }
};

export default SettingsReducer;
