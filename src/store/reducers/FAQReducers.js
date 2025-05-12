const initialState = {
  faqs: [],
  loading: false,
  error: null
};

export const faqReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FAQS_REQUEST:
    case CREATE_FAQ_REQUEST:
    case UPDATE_FAQ_REQUEST:
    case DELETE_FAQ_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_FAQS_SUCCESS:
      return {
        ...state,
        faqs: action.payload.faqs,
        loading: false
      };

    case CREATE_FAQ_SUCCESS:
      return {
        ...state,
        faqs: [...state.faqs, action.payload.faq],
        loading: false
      };

    case UPDATE_FAQ_SUCCESS:
      return {
        ...state,
        faqs: state.faqs.map(faq =>
          faq.id === action.payload.faq.id ? action.payload.faq : faq
        ),
        loading: false
      };

    case DELETE_FAQ_SUCCESS:
      return {
        ...state,
        faqs: state.faqs.filter(faq => faq.id !== action.payload),
        loading: false
      };

    case GET_FAQS_FAILURE:
    case CREATE_FAQ_FAILURE:
    case UPDATE_FAQ_FAILURE:
    case DELETE_FAQ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};


export const GET_FAQS_REQUEST = 'GET_FAQS_REQUEST';
export const GET_FAQS_SUCCESS = 'GET_FAQS_SUCCESS';
export const GET_FAQS_FAILURE = 'GET_FAQS_FAILURE';

export const CREATE_FAQ_REQUEST = 'CREATE_FAQ_REQUEST';
export const CREATE_FAQ_SUCCESS = 'CREATE_FAQ_SUCCESS';
export const CREATE_FAQ_FAILURE = 'CREATE_FAQ_FAILURE';

export const UPDATE_FAQ_REQUEST = 'UPDATE_FAQ_REQUEST';
export const UPDATE_FAQ_SUCCESS = 'UPDATE_FAQ_SUCCESS';
export const UPDATE_FAQ_FAILURE = 'UPDATE_FAQ_FAILURE';

export const DELETE_FAQ_REQUEST = 'DELETE_FAQ_REQUEST';
export const DELETE_FAQ_SUCCESS = 'DELETE_FAQ_SUCCESS';
export const DELETE_FAQ_FAILURE = 'DELETE_FAQ_FAILURE';

