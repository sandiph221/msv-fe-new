const initialState = {
  pages: {
    loading: true,
    success: false,
    data: [],
    error: []
  },
  page: {
    loading: true,
    success: false,
    data: [],
    error: []
  },
  pageUpdate: {
    loading: false,
    success: false,
    data: [],
    error: []
  },
};

const userCmsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'GET_PAGES_LIST':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: true,
          success: false
        }
      }

    case 'GET_PAGES_LIST_SUCCESS':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'GET_PAGE_LIST_ERROR':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: false,
          success: false,
          error: payload
        }
      }

    case 'GET_PAGES_ITEM':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: true,
          success: false
        }
      }

    case 'GET_PAGES_ITEM_SUCCESS':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: false,
          success: true,
          data: payload
        }
      }

    case 'GET_PAGES_ITEM_ERROR':
      return {
        ...state,
        pagesList: {
          ...state.pagesList,
          loading: false,
          success: false,
          error: payload
        }
      }

    default:
      return state;
  }
}

export default userCmsReducer;
