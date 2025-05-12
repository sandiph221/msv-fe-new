import axios from "axios";
import { Redirect } from "react-router";
import { toast } from "react-toastify";

export const SignIn = (user) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    /* api call to Login User */
    axios
      .post("/sign-in", user)
      .then((response) => {
        if (response.data.status && response.data.data) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.data));
          toast.success("Successful Login");
          console.log("response.data.data", response.data.data);
          dispatch({
            type: "SIGNIN",
            payload: response.data.data,
          });
          resolve(response);
        } else {
          throw new Error(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const FacebookSignIn = (accessToken, user) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    /* api call to Login User */
    axios
      .post(`/facebook/sign-in?access_token=${accessToken}`, user)
      .then((response) => {
        if (response.data.status && response.data.data) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.data));
          toast.success("Successful Login");

          dispatch({
            type: "SIGNIN",
            payload: response.data.data,
          });
          resolve(response);
        } else {
          throw new Error(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const SignOut = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    axios
      .get("/logout")
      .then((response) => {
        dispatch({
          type: "LOGOUT",
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const ForgotPassword = (email, subdomain) => async (dispatch) =>
  new Promise(function (resolve, reject) {
    /* api call to Login User */
    axios
      .post("/forgot-password", { email, subdomain })
      .then((response) => {
        toast.success(response.data.message);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const ChangePassword = (password, confirm_password) => async () =>
  new Promise(function (resolve, reject) {
    /* api call to Login User */
    axios
      .put("/change-password", { password, confirm_password })
      .then((response) => {
        toast.success(response.data.message);

        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const ChangePasswordEmailVerification =
  (authorization, password) => (dispatch) => {
    dispatch({
      type: "CHANGE_PASSWORD_REQUEST",
    });
    axios
      .post(`/change-password-mail`, { authorization, password })
      .then((response) => {
        dispatch({
          type: "CHANGE_PASSWORD",
          payload: response.data,
        });
        toast.success(response.data.message);
      })

      .catch((error) => {
        toast.error(error.response.message);
        dispatch({
          type: "CHANGE_PASSWORD_FAILED",
        });
      });
  };

export const getSignInUser = (userId) => (dispatch) => {
  /* api call made to get sign in user details */
  axios.get(`users/${userId}`).then((response) => {
    dispatch({
      type: "GET_SIGN_IN_USER",
      payload: response.data.data,
    });
  });
};

/* customer update from customer profiles >> decision still to be made  */

export const updateCustomerFromProfile = (customer) => (dispatch) =>
  new Promise(function (resolve, reject) {
    // /* axios call is to be made  */
    const data = {
      first_name: customer.firstName,
      last_name: customer.lastName,
      contact_number: customer.phoneNumber,
      timezone: customer.timezone,
      // active: customer.active,
    };

    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }
    axios
      .put("me/update", data)
      .then((response) => {
        toast.success(response.data.message);
        resolve(response);
        dispatch(getSignInUser(response.data.data.id));
      })
      .catch((error) => {
        reject(error);
      });
  });
