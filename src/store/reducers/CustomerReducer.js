const initState = {
  getCustomersLoading: false,
  createCustomersLoading: false,
  deleteCustomersLoading: false,
  customers: {},
};

const CustomerReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_CUSTOMER_REQUEST":
      return {
        ...state,
        getCustomersLoading: true,
      };
    case "CREATE_CUSTOMER_REQUEST":
      return {
        ...state,
        createCustomersLoading: true,
      };
    case "DELETE_CUSTOMER_REQUEST":
      return {
        ...state,
        deleteCustomersLoading: true,
      };

    case "SEARCH_CUSTOMERS":
      return {
        ...state,
        getCustomersLoading: false,
        customers: {
          totalUsers: action.payload.totalUsers,
          users: action.payload.users,
        },
      };
    case "CREATE_CUSTOMER":
      return {
        ...state,
        createCustomersLoading: false,
        customers: {
          users: [
            action.payload,
            ...(state.customers && state.customers.users),
          ],
        },
      };

    case "UPDATE_CUSTOMERS":
      return {
        ...state,
        createCustomersLoading: false,
        customers: {
          totalUsers: state.customers && state.customers.totalUsers,
          users: state.customers.users.map((customer) => {
            if (customer.id === action.payload.id) {
              return action.payload;
            }
            return customer;
          }),
        },
      };

    case "GET_CUSTOMERS":
      return {
        ...state,
        getCustomersLoading: false,
        customers: action.payload,
      };
    case "APPEND_GET_CUSTOMERS":
      return {
        ...state,
        getCustomersLoading: false,
        customers: {
          ...action.payload,
          users: [...state.customers.users, ...action.payload.users],
        },
      };

    case "DELETE_CUSTOMERS":
      return {
        ...state,
        deleteCustomersLoading: false,
        customers: {
          totalUsers: state.customers && state.customers.totalUsers,
          users: state.customers.users.filter(
            (customer) => customer.id !== action.payload
          ),
        },
      };

    case "CUSTOMER_FAILED":
      return {
        ...state,
        getCustomersLoading: false,
        createCustomersLoading: false,
        deleteCustomersLoading: false,
      };

    default:
      return state;
  }
};

export default CustomerReducer;
