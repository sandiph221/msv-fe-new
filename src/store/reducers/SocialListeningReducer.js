const initialState = {
  status: false,
  userId: "",
  accessToken: "",
  error: "",
  success: false,
};

const SocialIntegrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_INTEGRATION_STATUS_LOADER":
      return {
        ...state,
        integratedStatusLoading: true,
      };
    case "GET_INTEGRATION_STATUS":
      return {
        status: action.payload,
        success: action.payload.success,
        integratedStatusLoading: false,
      };
    case "GET_INTEGRATION_STATUS_ERROR":
      return {
        ...state,
        error: action.payload,
        integratedStatusLoading: false,
      };
    case "SET_USER_ID":
      return {
        ...state,
        userId: action.payload.userId,
        accessToken: action.payload.accessToken,
        integratedStatusLoading: false,
      };

    default:
      return state;
  }
};

export default SocialIntegrationReducer;
