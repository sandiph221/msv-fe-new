import Axios from 'axios';
import { toast } from 'react-toastify';
import sectionList from './Data/SectionList';

export const getSectionList = () => (dispatch) => {
  // get section list get request
  dispatch({
    type: 'GET_SECTION_LIST',
    payload: sectionList,
  });
};

export const createSectionList = (section) => (dispatch) => {
  console.log('sectipm list', section);
};

//posting contact support form

export const creatContactSupport = (supportData) => (dispatch) =>
  new Promise(function (resolve, reject) {
    const data = {
      first_name: supportData.firstName,
      last_name: supportData.lastName,
      email: supportData.email,
      mobile: supportData.mobileNumber,
      message: supportData.message,
    };
    //axios call

    Axios.post('/contact-support', data)
      .then((response) => {
        toast.success(response.data.res_type);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

//responding customer contact support form

export const creatRespondSupport = (supportData, id) => (dispatch) =>
  new Promise(function (resolve, reject) {
    const data = {
      response: supportData.message,
    };

    Axios.put(`/contact-support/${id}`, data)
      .then((response) => {
        toast.success(response.data.res_type);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const createArticle = (article) => (dispatch) =>
  new Promise(function (resolve, reject) {
    //create article post request
    //axios call will be made
    const data = {
      title: article.title,
      description: article.body,
    };

    // dispatch(getSectionList())
    if (article.section === 'faq') {
      Axios.post(`/faqs`, data)
        .then((response) => {
          toast.success('Faq has been added');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    } else if (article.section === 'documentation') {
      Axios.post(`/how-to-docs`, data)
        .then((response) => {
          toast.success('How-to-documnetation article has been added');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    } else if (article.section === 'videos') {
      Axios.post(`/help-videos`, data)
        .then((response) => {
          toast.success('Help video has been added');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    }
  });

//update article

export const updateArticle = (article) => (dispatch) =>
  new Promise(function (resolve, reject) {
    //create article post request
    //axios call will be made
    const data = {
      id: article.id,
      title: article.title,
      description: article.body,
    };

    // dispatch(getSectionList())
    if (article.section === 'faq') {
      Axios.put(`/faqs/${article.id}`, data)
        .then((response) => {
          toast.success('Faq list has been updated');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    } else if (article.section === 'documentation') {
      Axios.put(`/how-to-docs/${article.id}`, data)
        .then((response) => {
          toast.success('How-to-documnetation article has been updated');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    } else if (article.section === 'videos') {
      Axios.put(`/help-videos/${article.id}`, data)
        .then((response) => {
          toast.success('Help video list has been updated');
          resolve(response);
        })
        .catch((error) => {
          toast.error(error.response.message);
          reject(error);
        });
    }
  });

  export const deleteArticle = (article) => (dispatch) =>
    new Promise(function (resolve, reject) {
      //create article post request
      //axios call will be made
      const data = {
        id: article.id,
        title: article.title,
        description: article.body,
      };
  
      // dispatch(getSectionList())
      if (article.section === 'faq') {
        Axios.delete(`/faqs/${article.id}`)
          .then((response) => {
            toast.success('Faq list has been deleted');
            resolve(response);
          })
          .catch((error) => {
            toast.error(error.response.message);
            reject(error);
          });
      } else if (article.section === 'documentation') {
        Axios.delete(`/how-to-docs/${article.id}`)
          .then((response) => {
            toast.success('How-to-documnetation article has been deleted');
            resolve(response);
          })
          .catch((error) => {
            toast.error(error.response.message);
            reject(error);
          });
      } else if (article.section === 'videos') {
        Axios.delete(`/help-videos/${article.id}`)
          .then((response) => {
            toast.success('Help video list has been deleted');
            resolve(response);
          })
          .catch((error) => {
            toast.error(error.response.message);
            reject(error);
          });
      }
    });

//search article

export const searchArticle = (query, page) => (dispatch) => {
  dispatch({
    type: 'GET_SEARCH_ARTICLE_LOADER_START',
  });
  const data = {
    search: query,
    context: page,
  };
  //axios call
  Axios.post(`/help-search`, data)
    .then((response) => {
      dispatch({
        type: 'GET_SEARCH_ARTICLE',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      if (error) {
        toast.error(error.response.message);
      }
    });
};

//new action calls as help page features changes//

export const getFaqList = () => (dispatch) => {
  // fetch faq's list
  dispatch({
    type: 'GET_FAQ_LIST_LOADER_START',
  });
  //axios call
  Axios.get('/faqs')
    .then((response) => {
      dispatch({
        type: 'GET_FAQ_LIST',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      toast.error(error.response.message);
    });
};

export const getHowToDocList = () => (dispatch) => {
  // fetch how to doc's list
  dispatch({
    type: 'GET_HOW_TO_DOC_LIST_LOADER_START',
  });
  //axios call
  Axios.get('/how-to-docs')
    .then((response) => {
      dispatch({
        type: 'GET_HOW_TO_DOC_LIST',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      toast.error(error.response.message);
    });
};

export const getHelpVideoList = () => (dispatch) => {
  // fetch video's list
  dispatch({
    type: 'GET_VIDEO_LIST_LOADER_START',
  });
  //axios call
  Axios.get('/help-videos')
    .then((response) => {
      dispatch({
        type: 'GET_VIDEO_LIST',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      toast.error(error.response.message);
    });
};

export const getContactSupportList = (dateRange) => (dispatch, getState) => {
  //fetch Support List
  const { customDateRangeRed } = getState().socialMediaProfileListReducer;
  const { startDate, endDate } = customDateRangeRed
    ? customDateRangeRed[0]
    : '';
  dispatch({
    type: 'GET_SUPPORT_LIST_LOADER_START',
  });
  //axios call
  Axios.get(`/contact-support`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  })
    .then((response) => {
      dispatch({
        type: 'GET_SUPPORT_LIST',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      toast.error(error.response.message);
    });
};

export const setSearchQuery = (query) => (dispatch) => {
  dispatch({
    type: 'SET_HELP_SEARCH_QUERY',
    payload: query,
  });
};

export const clearSearchArticle = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_SEARCH_ARTICLE',
  });
};
