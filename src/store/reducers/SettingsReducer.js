import logoImg from "../../assets/images/msvfooterLogo.png";
import bannerImg from "../../assets/images/msv-default-banner.png";

const initState = {
    pages: [],
    logoURL: logoImg,
    hasPaid: null, // null = not loaded, true/false = loaded
    bannerURL: bannerImg,
    subdomainID: null,
    logoBannerDataLoaded: false,
    loading: false, // Add loading state
};

const SettingsReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOAD_LOGO_AND_BANNER_REQUEST":
            console.log('state values are ,,,', state)
            return {
                ...state,
                loading: true,
            };

        case "UPDATE_LOGO_AND_BANNER": {
            // ✅ Wrap the case block in curly braces to allow variable declarations
            const isFromSubdomainLoad = action.payload && (action.payload.id !== undefined || action.payload.has_paid !== undefined);

            let logoURL = logoImg;
            let bannerURL = bannerImg;
            let subdomainID = state.subdomainID;
            let hasPaid = state.hasPaid; // Preserve existing hasPaid state

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

                // Only update these if they exist (from subdomain load)
                if (isFromSubdomainLoad) {
                    subdomainID = action.payload.id || null;
                    // Handle the case where API returns false payment status
                    if (action.payload.id === 'false') {
                        hasPaid = false;
                    } else {
                        hasPaid = !!action.payload.has_paid;
                    }
                }
            }

            return {
                ...state,
                logoURL,
                bannerURL,
                subdomainID,
                hasPaid, // Only update hasPaid from subdomain load, not from banner upload
                logoBannerDataLoaded: true,
                loading: false, // Set loading to false when data is loaded
            };
        }

        default:
            return state;
    }
};

export default SettingsReducer;
