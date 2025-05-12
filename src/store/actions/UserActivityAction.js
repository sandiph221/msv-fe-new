import axios from 'axios';
import { toast } from 'react-toastify';
import Moment from 'moment';

export const getSubdomainList = () => (dispatch) => {
  dispatch({
    type: 'GET_SUBDOMAIN_LIST',
  });

  axios
    .get(`/dashboard/subdomain-list`)
    .then((response) => {
      dispatch({
        type: 'GET_SUBDOMAIN_LIST_SUCCESS',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: 'GET_SUBDOMAIN_LIST_ERROR',
        payload: error.response.data.data,
      });

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Some thing went wrong');
      }
    });
};

export const getUserLoginActivity =
  (filter, page = 1, pageLimit = 10) =>
  (dispatch) => {
    dispatch({
      type: 'GET_USER_LOGIN_ACTIVITY',
    });

    axios
      .get(
        `dashboard/login-logs?page=${page}&page_limit=${pageLimit}&${filter}`
      )
      .then((response) => {
        dispatch({
          type: 'GET_USER_LOGIN_ACTIVITY_SUCCESS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_LOGIN_ACTIVITY_ERROR',
          payload: error.response.data.data,
        });

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Some thing went wrong');
        }
      });
  };

export const getMoreUserLoginActivity =
  (filter, page = 1, pageLimit = 10) =>
  (dispatch, getState) => {
    dispatch({
      type: 'GET_MORE_USER_LOGIN_ACTIVITY',
    });

    const userLoginActivityData =
      getState().userActivityReducer.userLoginActivity.data;

    axios
      .get(
        `dashboard/login-logs?page=${page}&page_limit=${pageLimit}&${filter}`
      )
      .then((response) => {
        dispatch({
          type: 'GET_USER_LOGIN_ACTIVITY_SUCCESS',
          payload: [...userLoginActivityData, ...response.data.data],
        });
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_LOGIN_ACTIVITY_ERROR',
          payload: error.response.data.data,
        });

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Some thing went wrong');
        }
      });
  };

export const createUserReportDownloadActivity =
  (profiles, downloadType) => (dispatch, getState) => {
    dispatch({
      type: 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY',
    });

    const userDetail = getState().auth.user;
    const activeSocialMedia =
      getState().socialMediaProfileListReducer.activeSocialMediaType;

    let postParams = {
      name: `${userDetail.first_name} ${userDetail.last_name}`,
      email: userDetail.email,
      subdomain_id: userDetail.subdomain_id,
      social_type: activeSocialMedia,
      profile: JSON.stringify(profiles),
      file_type: downloadType,
      download_time: Moment().format('YYYY-MM-DD HH:mm'),
    };

    axios
      .post(`download-logs/create`, postParams)
      .then((response) => {
        dispatch({
          type: 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY_SUCCESS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'CREATE_USER_REPORT_DOWNLOAD_ACTIVITY_ERROR',
          payload: error.response.data.data,
        });

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Some thing went wrong');
        }
      });
  };

export const getUserReportDownloadActivity =
  (filter, page = 1, pageLimit = 10) =>
  (dispatch) => {
    dispatch({
      type: 'GET_USER_REPORT_DOWNLOAD_ACTIVITY',
    });

    axios
      .get(`download-logs?page=${page}&page_limit=${pageLimit}&${filter}`)
      .then((response) => {
        dispatch({
          type: 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_SUCCESS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_ERROR',
          payload: error.response.data.data,
        });

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Some thing went wrong');
        }
      });
  };

export const getMoreUserReportDownloadActivity =
  (filter, page = 1, pageLimit = 10) =>
  (dispatch, getState) => {
    dispatch({
      type: 'GET_MORE_USER_REPORT_DOWNLOAD_ACTIVITY',
    });

    const userReportDownloadActivityData =
      getState().userActivityReducer.userReportDownloadActivity.data;

    axios
      .get(`download-logs?page=${page}&page_limit=${pageLimit}&${filter}`)
      .then((response) => {
        dispatch({
          type: 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_SUCCESS',
          payload: [...userReportDownloadActivityData, ...response.data.data],
        });
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_REPORT_DOWNLOAD_ACTIVITY_ERROR',
          payload: error.response.data.data,
        });

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Some thing went wrong');
        }
      });
  };
