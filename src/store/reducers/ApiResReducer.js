const initState = {
    apiRes: {
        requestFrom: '',
        response: ''
    }
}


const ApiResReducer = (state = initState, action) => {
    switch (action.type) {
        case "apiRes":
            return {
                ...state,
                apiRes: action.payload,
            };
        case "CHANGE_PASSWORD":
            return {
                ...state,
                apiRes: action.payload
            }
            
        default:
            return state;
    }
};

export default ApiResReducer;