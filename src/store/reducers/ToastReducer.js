const initState = {
  open: false,
  message: '',
  variant: 'danger',
};

const ToastReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ToastSuccess':
      return {
        ...state,
        open: true,
        message: action.payload.message,
        variant: action.payload.variant,
      };

    case 'ToastFailed':
      return {
        ...state,
        open: true,
        message: action.payload.message,
        variant: action.payload.variant,
      };
    case 'ClearToast':
      return initState;
    default:
      return state;
  }
};
export default ToastReducer;
