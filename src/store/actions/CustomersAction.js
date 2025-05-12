import axios from 'axios';
import { toast } from 'react-toastify';
import * as constant from '../../utils/constant';

export const CreateCustomer = (customer) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    const data = {
      subdomain: customer.brandName,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      role: 'customer-admin',
      contact_number: customer.phoneNumber,
    };
    if (!customer.brandName) {
      delete data.subdomain;
    }
    if (customer.userAccountsLimt) {
      data.user_accounts_limit = customer.userAccountsLimt;
    }
    if (customer.socialMediaProfilesLimt) {
      data.social_media_profiles_limit = customer.socialMediaProfilesLimt;
    }
    if (customer.employeeNumber) {
      data.employee_number = customer.employeeNumber;
    }
    if (customer.position) {
      data.position = customer.position;
    }
    if (customer.logo) {
      data.logo = customer.logo;
    }
    if (customer.logo) {
      data.logo = customer.logo;
    }
    if (customer.featured_image) {
      data.featured_image = customer.featured_image;
    }
    if (customer.role === constant.CUSTOMER_VIEWER_NAME) {
      data.role = customer.role;
    }
    if (customer.role === constant.SUPER_ADMIN_NAME) {
      data.role = customer.role;
    }
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }
    dispatch({
      type: 'CREATE_CUSTOMER_REQUEST',
    });
    /* api call to create customer */
    axios
      .post('/create-users', formData)
      .then((response) => {
        resolve(response);
        dispatch(GetCustomer());
      })
      .catch((error) => {
        reject(error);
      });
  });

export const GetCustomer = () => (dispatch) => {
  dispatch({
    type: 'GET_CUSTOMER_REQUEST',
  });

  axios
    .get('/users')
    .then((response) => {
      dispatch({
        type: 'GET_CUSTOMERS',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch(CustomerFailed());
    });
};

export const SearchCustomer = (page, query) => (dispatch) => {
  dispatch({
    type: 'GET_CUSTOMER_REQUEST',
  });

  axios
    .get('/users', {
      params: {
        page,
        query,
      },
    })
    .then((response) => {
      dispatch({
        type: 'GET_CUSTOMERS',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch(CustomerFailed());
    });
};

export const PaginateCustomer = (page) => (dispatch) => {
  dispatch({
    type: 'GET_CUSTOMER_REQUEST',
  });

  axios
    .get('/users', {
      params: {
        page,
        limit: 5,
      },
    })
    .then((response) => {
      dispatch({
        type: 'APPEND_GET_CUSTOMERS',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch(CustomerFailed());
    });
};

export const UpdateCustomer = (customer, response) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    const data = {
      subdomain: customer.brandName,
      user_id: customer.id,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      contact_number: customer.phoneNumber,
      user_accounts_limit: customer.userAccountsLimt,
      social_media_profiles_limit: customer.socialMediaProfilesLimt,
      employee_number: customer.employeeNumber,
      position: customer.position,
      // active: customer.active,
    };

    if (customer.logo) {
      data.logo = customer.logo;
    }

    if (customer.featured_image) {
      data.featured_image = customer.featured_image;
    }

    if (customer.role) {
      data.role = customer.role;
    }

    var regex =
      /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    if (regex.test(customer.logo)) {
      delete data.logo;
    }

    if (regex.test(customer.featured_image)) {
      delete data.featured_image;
    }

    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }
    /* api call to update customer */
    axios
      .put(`/users/${customer.id}/update`, formData)
      .then((response) => {
        // dispatch(GetCustomer());
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const UpdateCustomerBanner = (customer, response) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    const data = {
      logo: customer.logo,
      featured_image: customer.featured_image,
    };

    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }

    axios
      .put('/customer-logo-banners', formData)
      .then((response) => {
        toast.success(response.data.message);
        dispatch({
          type: 'UPDATE_LOGO_AND_BANNER',
          payload: {
            logo: response.data.data.logo,
            feature_image: response.data.data.feature_image,
          },
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const DeleteCustomer = (user_id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    axios
      .delete(`/users/${user_id}/delete`)
      .then((response) => {
        toast.success(response.data.message);
        dispatch(GetCustomer());
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

const CustomerFailed = (store, error) => {
  return {
    type: 'CUSTOMER_FAILED',
  };
};

export const linkSocialPlatform = (accessToken) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    axios
      .post('/integration', { accessToken, platform: 'facebook' })
      .then((response) => {
        // dispatch({
        //   type: "UPDATE_LOGO_AND_BANNER",
        //   payload: {

        //   },
        // });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
