const initState = {
  loading: false,
  changePasswordLoading: false,
  isAuth:
    localStorage.getItem('userInfo') &&
    localStorage.getItem('userInfo') != 'undefined'
      ? true
      : false,

  token:
    localStorage.getItem('userInfo') &&
    localStorage.getItem('userInfo') != 'undefined'
      ? JSON.parse(localStorage.getItem('userInfo')).access_token
      : null,

  user:
    localStorage.getItem('userInfo') &&
    localStorage.getItem('userInfo') != 'undefined'
      ? JSON.parse(localStorage.getItem('userInfo')).user
      : null,
  password: null,
};

const AuthReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SIGNIN_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'CHANGE_PASSWORD_REQUEST':
      return {
        ...state,
        changePasswordLoading: true,
      };
    case 'SIGNIN':
      return {
        ...state,
        loading: false,
        isAuth: true,
        user: action.payload.user,
        token: action.payload.access_token,
      };

    case 'CHANGE_PASSWORD':
      return {
        ...state,
        changePasswordLoading: false,
        password: action.payload,
      };
    case 'CHANGE_PASSWORD_FAILED':
      return {
        ...state,
        changePasswordLoading: false,
        errorMessage: action.payload.old_password,
      };

    case 'SIGNIN_FAILED':

    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        changePasswordLoading: false,
        loading: false,
        isAuth: false,
        user: null,
        token: null,
      };
    case 'GET_SIGN_IN_USER':
      return {
        ...state,
        isAuth: true,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
