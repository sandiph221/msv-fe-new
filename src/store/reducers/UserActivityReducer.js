const initialState = {
  subdomainList: {
    loading: true,
    success: false,
    data: [],
    error: []
  },
  userLoginActivity: {
    loading: true,
    success: false,
    data: [],
    error: []
  },
  userReportDownloadActivityCreate: {
    loading: false,
    success: false,
    data: [],
    error: []
  },
  userReportDownloadActivity: {
    loading: true,
    success: false,
    data: [],
    error: []
  }
};

const userActivityReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'GET_SUBDOMAIN_LIST':
      return {
        ...state,
        subdomainList: {
          ...state.subdomainList,
          loading: true,
          success: false
        }
      }

    case 'GET_SUBDOMAIN_LIST_SUCCESS':
      return {
        ...state,
        subdomainList: {
          ...state.subdomainList,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'GET_SUBDOMAIN_LIST_ERROR':
      return {
        ...state,
        subdomainList: {
          ...state.subdomainList,
          loading: false,
          success: false,
          error: payload
        }
      }

    case 'GET_USER_LOGIN_ACTIVITY':
      return {
        ...state,
        userLoginActivity: {
          ...state.userLoginActivity,
          loading: true,
          success: false
        }
      }

    case 'GET_USER_LOGIN_ACTIVITY_SUCCESS':
      return {
        ...state,
        userLoginActivity: {
          ...state.userLoginActivity,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'GET_USER_LOGIN_ACTIVITY_ERROR':
      return {
        ...state,
        userLoginActivity: {
          ...state.userLoginActivity,
          loading: false,
          success: false,
          error: payload
        }
      }

    case 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY':
      return {
        ...state,
        userReportDownloadActivityCreate: {
          ...state.userReportDownloadActivityCreate,
          loading: true,
          success: false
        }
      }

    case 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY_SUCCESS':
      return {
        ...state,
        userReportDownloadActivityCreate: {
          ...state.userReportDownloadActivityCreate,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY_ERROR':
      return {
        ...state,
        userReportDownloadActivityCreate: {
          ...state.userReportDownloadActivityCreate,
          loading: false,
          success: false,
          error: payload
        }
      }

    case 'GET_USER_REPORT_DOWNLOAD_ACTIVITY':
      return {
        ...state,
        userReportDownloadActivity: {
          ...state.userReportDownloadActivity,
          loading: true,
          success: false
        }
      }

    case 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_SUCCESS':
      return {
        ...state,
        userReportDownloadActivity: {
          ...state.userReportDownloadActivity,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_ERROR':
      return {
        ...state,
        userReportDownloadActivity: {
          ...state.userReportDownloadActivity,
          loading: false,
          success: false,
          error: payload
        }
      }

    default:
      return state;
  }
}

export default userActivityReducer;
