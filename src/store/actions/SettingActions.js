import axios from 'axios';

export const LoadLogoAndBanner = (subdomain) => (dispatch) => {
  dispatch({
    type: 'LOAD_LOGO_AND_BANNER',
  });
  axios
    .get(`/get-subdomain/${subdomain}`)
    .then((response) => {
      dispatch({
        type: 'UPDATE_LOGO_AND_BANNER',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_LOGO_AND_BANNER',
        payload: { id: 'false' },
      });
    });
};

export const socialMediaType = (data) => (dispatch) => {
  dispatch({
    type: 'ACTIVE_SOCIAL_MEDIA_TYPE',
    payload: data,
  });
};
