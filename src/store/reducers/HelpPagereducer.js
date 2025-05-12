const initState = {
  faqList: [],
  searchArticles: [],
  searchArticlesLoader: false,
  howToDocList: [],
  videoList: [],
  howToDocListLoader: false,
  faqListLoader: false,
  videoListLoader: false,
  contactSupportListLoader: false,
  contactSupportList: [],
  searchQuery: ''
};

const HelpPageReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_FAQ_LIST_LOADER_START":
      return {
        ...state,
        faqListLoader: true
      }
    case "GET_FAQ_LIST":
      return {
        ...state,
        faqList: action.payload,
        faqListLoader: false
      };

    case "GET_HOW_TO_DOC_LIST_LOADER_START":
      return {
        ...state,
        howToDocListLoader: true
      }
    case "GET_HOW_TO_DOC_LIST":
      return {
        ...state,
        howToDocList: action.payload,
        howToDocListLoader: false
      }

    case "GET_VIDEO_LIST_LOADER_START":
      return {
        ...state,
        videoListLoader: true
      }
    case "GET_VIDEO_LIST":
      return {
        ...state,
        videoListLoader: false,
        videoList: action.payload
      }

    case "GET_SEARCH_ARTICLE_LOADER_START":
      return {
        ...state,
        searchArticlesLoader: true
      }
    case "GET_SEARCH_ARTICLE":
      return {
        ...state,
        searchArticlesLoader: false,
        searchArticles: action.payload
      }
    case "GET_SUPPORT_LIST_LOADER_START":
      return {
        ...state,
        contactSupportListLoader: true
      }
    case "GET_SUPPORT_LIST":
      return {
        ...state,
        contactSupportListLoader: false,
        contactSupportList: action.payload
      }

    case "SET_HELP_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload
      }

    case "CLEAR_SEARCH_ARTICLE":
      return {
        ...state,
        searchArticlesLoader: false,
        searchArticles: []
      }

    default:
      return state;
  }
};

export default HelpPageReducer;
