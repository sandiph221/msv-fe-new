const initialState = {
  pagesInfoLoading: false,
  pagesInfo: [],
  deletePageLoading: false,
  updatePagesInfo: true
};

export const SuperAdminDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PAGES_INFO_START":
      return {
        ...state,
        pagesInfoLoading: true,
      };
    case "GET_PAGES_INFO":
      return {
        ...state,
        pagesInfo: action.payload,
        pagesInfoLoading: false,
      };
      case "UPDATE_PAGES_INFO_START":
          return {
              ...state,
            updatePagesInfo: true
          }
          case "UPDATE_PAGES_INFO":
          return {
              ...state,
            updatePagesInfo: false
          }
    case "DELETE_PAGES_START":
      return {
        ...state,
        deletePageLoading: true,
      };
      case "DELETE_PAGES":
      return {
        ...state,
        deletePageLoading: false,
      };
    default:
      return state;
  }
};
