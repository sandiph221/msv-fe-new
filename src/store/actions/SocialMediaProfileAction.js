import adddeSocialMedaiProfileList from './Data/AddedSocialMediaProfile';
import interactionsData from './Data/interactions';
import axios from 'axios';
import topFollowers from './Data/TopFollowersData';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';

export const getAddedProfileList =
  (searchQuery = '') =>
  (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */
    /*api call */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    dispatch({
      type: 'GET_ADDED_PROFILE_LIST_START',
    });

    axios
      .get(`social-media/${activeSocialMediaType}/profiles-list`, {
        params: {
          search: searchQuery,
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then((response) => {
        const newdata = response.data.data.map((d) => ({
          ...d,
          relative_fan_change: d.relative_fan_change + `%`,
        }));
        dispatch({
          type: 'GET_ADDED_PROFILE_LIST',
          payload: newdata,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(
            socialMediaResponseErrorWithMessage(error.response.data.message)
          );
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

export const searchSocialMediaProfiles = (query) => (dispatch, getState) => {
  /* searching profiles list from database */
  /* dispatching for loader state */
  dispatch({
    type: 'SEARCH_SOCIAL_MEDIA_PROFILE_LIST_START',
  });
  const { activeSocialMediaType } = getState().socialMediaProfileListReducer;
  axios
    .get(`/social-media/${activeSocialMediaType}/search-profiles/${query}`)
    .then((response) => {
      dispatch({
        type: 'SEARCH_SOCIAL_MEDIA_PROFILE_LIST',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message);
        dispatch(
          socialMediaResponseErrorWithMessage(error.response.data.message)
        );
      } else {
        dispatch({
          type: 'SOCIAL_MEDIA_PROFILES_ERROR',
        });
      }
    });
};

export const addProfileList = (profiles) => (dispatch, getState) => {
  /* api call to be requested */
  if (profiles.length !== 0) {
    dispatch({
      type: 'ADD_PROFILE_LIST_TO_COMPARE_START',
    });
    const { activeSocialMediaType } = getState().socialMediaProfileListReducer;
    axios
      .post(`social-media/${activeSocialMediaType}/profiles/store`, {
        profiles,
      })
      .then((response) => {
        dispatch({
          type: 'ADD_PROFILE_LIST_TO_COMPARE',
          payload: response.data.data,
        });
        dispatch(getAddedProfileList());
      })
      .then(() => toast.success('Profile added successfully'))
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  }

  /* storing the profile to be added "api call will be requested" */
  // adddeSocialMedaiProfileList.push(...profilestoBeAdded);
};

export const updateProfileColor =
  (profileId, color) => (dispatch, getState) => {
    // update color for each profile
    const { activeSocialMediaType } = getState().socialMediaProfileListReducer;
    const data = {
      color: color,
    };
    /* api calls to be made */
    axios
      .put(
        `social-media/${activeSocialMediaType}/${profileId}/update-profile-color`,
        data
      )
      .then((response) => {
        toast.success('Colour updated successfully');
      })
      .catch((error) => {
        toast.error('error occured');
      });
  };

export const deleteAddedProfileList = (profilesId) => (dispatch, getState) => {
  /* deleting added profile list */
  /* api call is to be made */
  const { activeSocialMediaType } = getState().socialMediaProfileListReducer;
  /*api call requested */
  axios
    .delete(`/social-media/${activeSocialMediaType}/profiles/delete`, {
      data: {
        profiles: [profilesId],
      },
    })
    .then((response) => {
      toast.success(response.data.message);
      dispatch({
        type: 'DELETING_ADDED_PROFILE_LIST',
        payload: response.data,
      });
      dispatch(getAddedProfileList());
    })
    .catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message);
        dispatch(socialMediaResponseError());
      } else {
        dispatch({
          type: 'SOCIAL_MEDIA_PROFILES_ERROR',
        });
      }
    });
};

export const searchAddedProfileList = (query) => (dispatch) => {
  /* searching added profile list from db */
  /* api call is to be made */
  const addedProfileList = adddeSocialMedaiProfileList.filter((profileList) => {
    return profileList.profileName.toLowerCase().includes(query.toLowerCase());
  });
  dispatch({
    type: 'SEARCH_ADDED_PROFILES_LIST',
    payload: addedProfileList,
  });
};

/* getting social profile basic data start */
export const getSocialProfileBasic =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_BASIC_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/basic`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_BASIC',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };
/* getting social profile basic data end */

/* getting social profile likes data start */
export const getSocialProfilelikes =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_LIKES_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/likes`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_LIKES',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };
/* getting social profile likes data end */

/* getting social profile likes data start */
export const getSocialProfileComments =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_COMMENTS_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/comments`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_COMMENTS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };
/* getting social profile likes data end */

/* getting social profile interaction data start */
export const getSocialProfileInteractionAbsoluteGrowth =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_ABS_INTERACTION_START',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/interactions-absolute-growth`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_ABS_INTERACTION',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };
/* getting social profile interaction data end */

/* getting social profile shares data start */
export const getSocialProfileShares =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_SHARES_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/shares`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_SHARES',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };
/* getting social profile shares data end */

/* getting social profile topPost data start */
export const getSocialProfileTopPost =
  (singleProfile, pageLimit, currentPage, feedTypes) =>
  (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_TOP_POST_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/top-posts`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            page: currentPage,
            page_limit: pageLimit,
            feed_types: feedTypes,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_TOP_POST',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

//Load more action for top posts

/* getting social profile topPost data start */
export const getMoreSocialProfileTopPost =
  (singleProfile, pageLimit, currentPage, feedTypes) =>
  (dispatch, getState) => {
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/top-posts`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            page: currentPage,
            page_limit: pageLimit,
            feed_types: feedTypes,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_TOP_POST',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

/* getting social profile shares data end */

/* getting social profile growth followers data start */
export const getSocialProfileGrowthFollowers =
  (singleProfile) => (dispatch, getState) => {
    //loader start
    dispatch({
      type: 'GET_PROFILE_GROWTH_FOLLOWERS_LOADER',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${singleProfile}/followers-absolute-growth`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_GROWTH_FOLLOWERS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

// / setting active social media type start
export const setActiveSocialMediaType = (socialMediaType) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_SOCIAL_MEDIA_TYPE',
    payload: socialMediaType,
  });
  dispatch(resetSelectedProfileForCompare());
  dispatch({
    type: 'RESET_TOP_POST_ID',
  });
};

//set custom date range

export const setCustomDateRangeAction = (dateRange) => (dispatch) => {
  dispatch({
    type: 'SET_CUSTOM_DATE_RANGE',
    payload: dateRange,
  });
};

// / setting active socail media type end /

/* getting single profile overview end */
export const getSocialProfileFanGrowth =
  (fanGrowthSelectedProfiles, period) => (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */

    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_FANS_GROWTH_DATA_LOADER',
    });
    axios
      .get(
        `/social-media/${activeSocialMediaType}/profiles/followers-growth/${period}`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            profiles:
              typeof fanGrowthSelectedProfiles === 'object'
                ? fanGrowthSelectedProfiles
                : [fanGrowthSelectedProfiles],
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_FANS_GROWTH_DATA',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

// Interactions
export const getInteractions =
  (interactionSelectedProfiles, interactionDateFilter, interaction1kPerFans) =>
  (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_INTERACTIONS_DATA_LOADER',
    });

    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/interactions/${interactionDateFilter}`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            profiles:
              typeof interactionSelectedProfiles === 'object'
                ? interactionSelectedProfiles
                : [interactionSelectedProfiles],
            per_1k_fans: interaction1kPerFans,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_INTERACTIONS_DATA',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

/* get top follwer */

export const getPostTypeDistributions =
  (selectProfile, postTypeDateFilter) => (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */

    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_POSTS_BREAKDOWN_DATA_LOADER',
    });

    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/${selectProfile}/posts-type-distributions/${postTypeDateFilter}`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_POST_TYPE_DATA',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

/* post type distribution for multiple profile selecetion */
export const getPostTypeDistributionsMultiple =
  (selectProfile) => (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */

    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_POSTS_BREAKDOWN_DATA_MULTIPLE_LOADER',
    });

    axios
      .get(
        `social-media/${activeSocialMediaType}/profiles/post-type-distributions`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            profiles:
              typeof selectProfile === 'object'
                ? selectProfile
                : [selectProfile],
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_POST_TYPE_DATA_MULTIPLE',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

export const getInteractionDistrbutions =
  (selectProfile) => (dispatch, getState) => {
    /* getting added profiles list in database */
    /*api request is to be made */

    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_DISTRIBUTIONS_OF_INTERACTIONS',
    });

    axios
      .get(
        `/social-media/${activeSocialMediaType}/profiles/feed-interaction-distributions`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            profiles:
              typeof selectProfile === 'object'
                ? selectProfile
                : [selectProfile],
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_INTERACTIONS_DISTRIBUTIONS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

/*testing for active socail medai type */

/* profiles To compare on selecting checkbox from added social profiles list  */
export const selectProfilesToComapre = (profiles) => (dispatch) => {
  dispatch({
    type: 'SELECT_PROFILES_TO_COMPARE',
    payload: profiles,
  });
};

/* delete profile to compare */
export const deleteSelectProfilesToCompare = (profileId) => (dispatch) => {
  dispatch({
    type: 'DELETE_SELECT_PROFILES_TO_COMPARE',
    payload: profileId,
  });
};

export const resetSelectedProfileForCompare = () => {
  return {
    type: 'RESET_PROFILES_TO_COMPARE',
  };
};

/* server response errror function */
const socialMediaResponseError = () => {
  return {
    type: 'SOCIAL_MEDIA_RES_ERROR',
  };
};
const socialMediaResponseErrorWithMessage = (payload) => {
  return {
    type: 'SOCIAL_MEDIA_RES_ERROR',
    payload,
  };
};
//Content News Feed Actions

export const getContentNewsFeed =
  (contentQueryParams) => (dispatch, getState) => {
    const searchKeyWords = contentQueryParams.searchData.map(
      (value) => value.label
    );
    //loader start
    dispatch({
      type: 'GET_PROFILE_CONTENT_FEED',
    });
    /* api call to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    let feedTypesQuery =
      contentQueryParams.postTypes.length === 6 ||
      contentQueryParams.postTypes.length === 3
        ? []
        : contentQueryParams.postTypes.filter((value) => value !== 'All Types');
    let newFeedTypesQuery = feedTypesQuery;
    if (activeSocialMediaType === 'facebook') {
      newFeedTypesQuery = feedTypesQuery.map((val) => val.toLowerCase());
    }
    let contentFeedUrl = `social-media/${activeSocialMediaType}/content-news-feeds`;
    let contentFeedUrlParams = {
      profiles: contentQueryParams.selectedProfiles,
      feed_types: newFeedTypesQuery,
      keyword_query: searchKeyWords,
      page: contentQueryParams.currentPage,
      page_limit: contentQueryParams.page_limit
        ? contentQueryParams.page_limit
        : '12',
      sort_by: contentQueryParams.sortType,
    };
    if (contentQueryParams.selectedProfiles) {
      axios
        .get(contentFeedUrl, {
          params: {
            ...contentFeedUrlParams,
            start_date: startDate,
            end_date: endDate,
          },
        })
        .then((response) => {
          dispatch({
            type: 'GET_PROFILE_CONTENT_FEED_SUCCESS',
            payload: response.data.data,
          });
        })
        .catch((error) => {
          if (error.response) {
            toast.error(error.response.data.message);
            dispatch(socialMediaResponseError());
          } else {
            dispatch({
              type: 'SOCIAL_MEDIA_PROFILES_ERROR',
            });
          }
        });
    }
  };

export const loadMoreContentNewsFeed =
  (contentQueryParams, pageLimit, page = '1') =>
  (dispatch, getState) => {
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const searchKeyWords = contentQueryParams.searchData.map(
      (value) => value.label
    );
    let feedTypesQuery =
      contentQueryParams.postTypes.length === 6
        ? []
        : contentQueryParams.postTypes.filter((value) => value !== 'All Types');
    let newFeedTypesQuery = feedTypesQuery;
    if (activeSocialMediaType === 'facebook') {
      newFeedTypesQuery = feedTypesQuery.map((val) => val.toLowerCase());
    }

    /* api call to be made */
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';
    const { oldContentNewsFeed } =
      getState().socialMediaProfileListReducer.contentNewsFeed;
    //loader start
    //  dispatch({
    //   type: "GET_PROFILE_CONTENT_FEED"
    // })
    axios
      .get(`social-media/${activeSocialMediaType}/content-news-feeds`, {
        params: {
          profiles: contentQueryParams.selectedProfiles,
          feed_types: newFeedTypesQuery,
          keyword_query: searchKeyWords,
          page: page,
          page_limit: pageLimit,
          sort_by: contentQueryParams.sortType,
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then((response) => {
        dispatch({
          type: 'GET_PROFILE_CONTENT_FEED_SUCCESS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

//clean content news feed

export const clearContentNewsFeed = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_PROFILE_CONTENT_FEED',
  });
};

//social-listening page actions calls

export const getSocialListeningtags = (query) => (dispatch, getState) => {
  /*api request is to be made */
  const { activeSocialMediaType, customDateRangeRed } =
    getState().socialMediaProfileListReducer;
  const { startDate, endDate } = customDateRangeRed
    ? customDateRangeRed[0]
    : '';

  dispatch({
    type: 'GET_SOCIAL_LISTENING_TAGS_START',
  });

  const searchKeyWords = query.map((value) => value.label);

  axios
    .get(`/social-media/${activeSocialMediaType}/search-tag`, {
      params: {
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        keyword_query: `${searchKeyWords}`,
      },
    })
    .then((response) => {
      dispatch({
        type: 'GET_SOCIAL_LISTENING_TAGS',
        payload: response.data.data,
      });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(error.response.data.message);
        dispatch(socialMediaResponseError());
      } else {
        dispatch({
          type: 'SOCIAL_MEDIA_PROFILES_ERROR',
        });
      }
    });
};

export const getNoOfpeople =
  (sentimentsDateFilter) =>
  (
    //get no of people (social-listening)
    dispatch,
    getState
  ) =>
    new Promise(function (resolve, reject) {
      /*api request is to be made */
      const { activeSocialMediaType, customDateRangeRed, searchQueryData } =
        getState().socialMediaProfileListReducer;
      const { startDate, endDate } = customDateRangeRed
        ? customDateRangeRed[0]
        : '';

      dispatch({
        type: 'GET_NO_OF_PEOPLE_START',
      });

      axios
        .get(`/social-listening/${activeSocialMediaType}/total-peoples`, {
          params: {
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            keyword_query: `${searchQueryData}`,
          },
        })
        .then((response) => {
          resolve(response);

          if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.is_downloading
          ) {
            dispatch({
              type: 'SOCIAL_LISTENING_ERROR',
            });
          } else {
            dispatch({
              type: 'GET_NO_OF_PEOPLE',
              payload: response.data.data,
            });

            dispatch(getNoOfMentions(searchQueryData));
            dispatch(getNoOfSocialInteraction(searchQueryData));
            dispatch(getEmojiChartData(searchQueryData));
            dispatch(getSentimentData(searchQueryData, sentimentsDateFilter));
            dispatch(noOfPeopleEnd());
          }

          dispatch({
            type: 'SOCIAL_LISTENING_ERROR_COMPLETE',
          });
        })
        .catch((error) => {
          reject(error);
          if (error.response) {
            toast.error(error.response.data.message);
            dispatch(socialMediaResponseError());
          } else {
            dispatch({
              type: 'SOCIAL_LISTENING_ERROR',
            });
          }
        });
    });

export const getNoOfMentions =
  (query) =>
  (
    //get no of people (social-listening)
    dispatch,
    getState
  ) => {
    /*api request is to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_NO_OF_MENTIONS_START',
    });

    axios
      .get(`/social-listening/${activeSocialMediaType}/total-mentions`, {
        params: {
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          keyword_query: `${query}`,
        },
      })
      .then((response) => {
        dispatch({
          type: 'GET_NO_OF_MENTIONS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

export const getNoOfSocialInteraction =
  (query) =>
  (
    //get no of social interaction (social-listening)
    dispatch,
    getState
  ) => {
    /*api request is to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_NO_OF_SOCIAL_INTERACTIONS_START',
    });

    axios
      .get(`/social-listening/${activeSocialMediaType}/social-interaction`, {
        params: {
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          keyword_query: `${query}`,
        },
      })
      .then((response) => {
        dispatch({
          type: 'GET_NO_OF_SOCIAL_INTERACTIONS',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

// export const getNoOfPotentialImpression = (query) => ( //get no of potentail impression (social-listening)
//   dispatch,
//   getState
// ) => {
//   /*api request is to be made */
//   const { activeSocialMediaType, customDateRangeRed } = getState().socialMediaProfileListReducer;
//   const { startDate, endDate } = customDateRangeRed ? customDateRangeRed[0] : "";

//   dispatch({
//     type: "GET_NO_OF_POTENTIAL_IMPRESSION_START",
//   });

//   axios
//     .get(
//       `/social-listening/${activeSocialMediaType}/potential-impression`, {
//         params: {
//           start_date: new Date(startDate).toISOString(),
//           end_date: new Date(endDate).toISOString(),
//           keyword_query: `${query}`
//         }
//       }
//     )
//     .then((response) => {
//       dispatch({
//         type: "GET_NO_OF_POTENTIAL_IMPRESSION",
//         payload: response.data.data,
//       });
//     })
//     .catch(error => {
//       if(error.response) {
//         toast.error(error.response.data.message)
//         dispatch(socialMediaResponseError())
//       } else {
//         dispatch({
//           type: "SOCIAL_MEDIA_PROFILES_ERROR",
//         });
//       }
//     })
// };

export const getEmojiChartData =
  (query) =>
  (
    //get emoji chart data (social-listening)
    dispatch,
    getState
  ) => {
    /*api request is to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_EMOJI_CHART_DATA_START',
    });

    axios
      .get(`/social-listening/${activeSocialMediaType}/top-emoji`, {
        params: {
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          keyword_query: `${query}`,
        },
      })
      .then((response) => {
        dispatch({
          type: 'GET_EMOJI_CHART_DATA',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

export const getSentimentData =
  (query, dateFilter) =>
  (
    //get sentiment chart data (social-listening)
    dispatch,
    getState
  ) => {
    /*api request is to be made */
    const { activeSocialMediaType, customDateRangeRed } =
      getState().socialMediaProfileListReducer;
    const { startDate, endDate } = customDateRangeRed
      ? customDateRangeRed[0]
      : '';

    dispatch({
      type: 'GET_SENTIMENT_TIME_DATA_START',
    });

    axios
      .get(
        `/social-listening/${activeSocialMediaType}/sentiment-in-time/${dateFilter}`,
        {
          params: {
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            keyword_query: `${query}`,
          },
        }
      )
      .then((response) => {
        dispatch({
          type: 'GET_SENTIMENT_TIME_DATA',
          payload: response.data.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
          dispatch(socialMediaResponseError());
        } else {
          dispatch({
            type: 'SOCIAL_MEDIA_PROFILES_ERROR',
          });
        }
      });
  };

export const resetSocialListeningData = () => (dispatch) => {
  dispatch({
    type: 'RESET_SOCIAL_LISTENING_DATA',
  });
};

export const setSearchQuery = (query) => (dispatch) => {
  dispatch({
    type: 'SET_SEARCH_QUERY',
    payload: query,
  });
  dispatch({
    type: 'RESET_SOCIAL_LISTENING_DATA',
  });
};
export const deleteSearchQuery = (query) => (dispatch) => {
  dispatch({
    type: 'DELETE_SEARCH_QUERY',
    payload: query,
  });
};
export const resetSearchQuery = () => (dispatch) => {
  dispatch({
    type: 'RESET_SEARCH_QUERY',
  });
};
const noOfPeopleEnd = () => (dispatch) => {
  dispatch({
    type: 'GET_NO_OF_PEOPLE_END',
  });
};
