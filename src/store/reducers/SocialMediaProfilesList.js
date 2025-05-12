import subMonths from "date-fns/subMonths";
import moment from "moment";

const initState = {
  addedProfileList: [],
  searchedProfileList: [],
  profilesListForCompare: [],
  searchLoading: false,
  topFollowerLoading: false,
  searchedAddedProfilesList: [],
  profileBasic: {},
  profileLikes: {},
  profileComments: {},
  profileShares: {},
  profileTopPost: {},
  profileGrowthFollowers: {},
  fansGrowth: [],
  postsData: {},
  interactionData: [],
  interactionDistributions: [],
  interactionDistributionsLoader: false,
  postsDataMultiple: [],
  activeSocialMediaType: "facebook",
  socialmediaTopFollowers: [],
  addedProfileListLoading: false,
  profilesListForCompareLoading: false,
  profileOverviewLoading: false,
  fanGrowthLoader: false,
  interactionLoader: false,
  postBreakDownLoader: false,
  multiplePostBreakDownLoader: false,
  profileBasicLoading: false,
  profileLikesLoading: false,
  profileCommentsLoading: false,
  profileSharesLoading: false,
  profileTopPostLoading: false,
  profileGrowthFollowersLoading: false,
  selectedProfilesListToComapre: [],
  serverError: false,
  contentNewsFeed: null,
  contentNewsFeedLoading: false,
  topPostProfileID: null,
  socialListeningDataLoading: false,
  socialListeningData: [],
  noOfPeople: {},
  noOfPeopleLoading: false,
  noOfMentions: {},
  noOfMentionsLoading: false,
  noOfSocialInteraction: {},
  noOfSocialInteractionLoading: false,
  noOfPotentialImpression: {},
  noOfPotentialImpressionLoading: false,
  emojiChartData: [],
  emojiChartDataLoading: false,
  sentimentInTimeData: [],
  sentimentInTimeDataLoading: false,
  customDateRangeRed: [
    {
      startDate: moment().subtract(30, "day").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      key: "selection",
      ranged: "Last 30 days",
    },
  ],
  searchQueryData: [],
  profileAbsInteractionLoading: false,
  profileAbsInteraction: [],
  socialListeningError: false,
  getComparisionProfileError:""
};

/*  this function is socia medail profiles reducer*/
const SocialMediaProfileListReducer = (state = initState, action) => {
  switch (action.type) {
    /* setting active socail media type  */
    case "SET_ACTIVE_SOCIAL_MEDIA_TYPE":
      return {
        ...initState,
        noOfPeople: state.noOfPeople,
        noOfPeopleLoading: state.noOfPeopleLoading,
        noOfMentions: state.noOfMentions,
        noOfMentionsLoading: state.noOfMentionsLoading,
        noOfSocialInteraction: state.noOfSocialInteraction,
        noOfSocialInteractionLoading: state.noOfSocialInteractionLoading,
        noOfPotentialImpression: state.noOfPotentialImpression,
        noOfPotentialImpressionLoading: state.noOfPotentialImpressionLoading,
        emojiChartData: state.emojiChartData,
        emojiChartDataLoading: state.emojiChartDataLoading,
        sentimentInTimeData: state.sentimentInTimeData,
        sentimentInTimeDataLoading: state.sentimentInTimeDataLoading,
        searchQueryData: state.searchQueryData,
        customDateRangeRed: state.customDateRangeRed,
        activeSocialMediaType: action.payload,
      };

    //setting date range picker state data
    case "SET_CUSTOM_DATE_RANGE":
      return {
        ...state,
        customDateRangeRed: action.payload,
      };

    /* social media profile reducer start */
    case "GET_ADDED_PROFILE_LIST_START":
      return {
        ...state,
        addedProfileListLoading: true,
      };
    case "GET_ADDED_PROFILE_LIST":
      return {
        ...state,
        addedProfileList: action.payload,
        addedProfileListLoading: false,
        fanGrowthLoader: false,
      };
    case "SEARCH_ADDED_PROFILES_LIST":
      return {
        ...state,
        searchedAddedProfilesList: action.payload,
      };
    // case "DELETING_ADDED_PROFILE_LIST":
    //   return {
    //     ...state,
    //     addedProfileList: action.payload,
    //   };
    case "SEARCH_SOCIAL_MEDIA_PROFILE_LIST":
      return {
        ...state,
        searchedProfileList: action.payload,
        searchLoading: false,
        getComparisionProfileError:""
      };
    case "SEARCH_SOCIAL_MEDIA_PROFILE_LIST_START":
      return {
        ...state,
        searchLoading: true,
      };
    case "ADD_PROFILE_LIST_TO_COMPARE_START":
      return {
        ...state,
        profilesListForCompareLoading: true,
      };
    case "ADD_PROFILE_LIST_TO_COMPARE":
      return {
        ...state,
        profilesListForCompare: action.payload,
        profilesListForCompareLoading: false,
      };

    // Use for Getting Added profile list basic details
    // case "BASIC_ADDED_PROFILE_DETAILS":
    //   return {
    //     ...state,
    //     basicProfileDetails: action.payload,
    //   }

    /* social media profile reducer end */
    case "GET_PROFILE_OVERVIEW_START":
      return {
        ...state,
        profileOverviewLoading: true,
      };

    /* geting  profile basic start*/
    case "GET_PROFILE_BASIC_LOADER": //loader
      return {
        ...state,

        profileBasicLoading: true,
      };
    case "GET_PROFILE_BASIC":
      return {
        ...state,
        profileBasic: action.payload,
        profileBasicLoading: false,
      };
    /* geting  profile basic end*/

    /* geting  profile likes start*/
    case "GET_PROFILE_LIKES_LOADER": //loader
      return {
        ...state,

        profileLikesLoading: true,
      };
    case "GET_PROFILE_LIKES":
      return {
        ...state,
        profileLikes: action.payload,
        profileLikesLoading: false,
      };
    /* geting  profile likes end*/

    /* geting  profile interaction start*/
    case "GET_PROFILE_ABS_INTERACTION_START": //loader
      return {
        ...state,

        profileAbsInteractionLoading: true,
      };
    case "GET_PROFILE_ABS_INTERACTION":
      return {
        ...state,
        profileAbsInteraction: action.payload,
        profileAbsInteractionLoading: false,
      };
    /* geting  profile interaction end*/

    /* geting  profile comments start*/
    case "GET_PROFILE_COMMENTS_LOADER": //loader
      return {
        ...state,

        profileCommentsLoading: true,
      };
    case "GET_PROFILE_COMMENTS":
      return {
        ...state,
        profileComments: action.payload,
        profileCommentsLoading: false,
      };
    /* geting  profile comments end*/

    /* geting  profile shares start*/
    case "GET_PROFILE_SHARES_LOADER": //loader
      return {
        ...state,

        profileSharesLoading: true,
      };
    case "GET_PROFILE_SHARES":
      return {
        ...state,
        profileShares: action.payload,
        profileSharesLoading: false,
      };
    /* geting  profile shares end*/

    /* geting  profile shares start*/
    case "GET_PROFILE_TOP_POST_LOADER": //loader
      return {
        ...state,

        profileTopPostLoading: true,
      };
    case "GET_PROFILE_TOP_POST":
      return {
        ...state,
        profileTopPost: action.payload,
        profileTopPostLoading: false,
      };
    /* geting  profile shares end*/

    /* geting  profile shares start*/
    case "GET_PROFILE_GROWTH_FOLLOWERS_LOADER": //loader
      return {
        ...state,

        profileGrowthFollowersLoading: true,
      };
    case "GET_PROFILE_GROWTH_FOLLOWERS":
      return {
        ...state,
        profileGrowthFollowers: action.payload,
        profileGrowthFollowersLoading: false,
      };
    /* geting  profile shares end*/

    case "GET_SOCIAL_MEDIA_TOP_FOLLOWERS_START":
      return {
        ...state,
        topFollowerLoading: true,
      };
    case "GET_SOCIAL_MEDIA_TOP_FOLLOWERS":
      return {
        ...state,
        socialmediaTopFollowers: action.payload,
        topFollowerLoading: false,
      };

    case "GET_DISTRIBUTIONS_OF_INTERACTIONS":
      return {
        ...state,
        interactionDistributionsLoader: true,
      };

    case "GET_INTERACTIONS_DISTRIBUTIONS":
      return {
        ...state,
        interactionDistributions: action.payload,
        interactionDistributionsLoader: false,
      };

    case "GET_FANS_GROWTH_DATA_LOADER":
      return {
        ...state,
        fanGrowthLoader: true,
      };
    case "GET_FANS_GROWTH_DATA":
      return {
        ...state,
        fansGrowth: action.payload,
        fanGrowthLoader: false,
      };

    case "GET_INTERACTIONS_DATA_LOADER":
      return {
        ...state,
        interactionLoader: true,
      };

    case "GET_INTERACTIONS_DATA":
      return {
        ...state,
        interactionData: action.payload,
        interactionLoader: false,
      };

    case "GET_POSTS_BREAKDOWN_DATA_LOADER":
      return {
        ...state,
        postBreakDownLoader: true,
      };

    case "GET_POST_TYPE_DATA":
      return {
        ...state,
        postsData: action.payload,
        postBreakDownLoader: false,
      };
    case "GET_POSTS_BREAKDOWN_DATA_MULTIPLE_LOADER":
      return {
        ...state,
        multiplePostBreakDownLoader: true,
      };

    case "GET_POST_TYPE_DATA_MULTIPLE":
      return {
        ...state,
        postsDataMultiple: action.payload,
        multiplePostBreakDownLoader: false,
      };

    case "SOCIAL_MEDIA_PROFILES_ERROR": // server error when no internet connection
      return {
        ...state,
        serverError: true,
        profilesListForCompareLoading: false,
        addedProfileListLoading: false,
        profileOverviewLoading: false,
        fanGrowthLoader: false,
        interactionLoader: false,
        postBreakDownLoader: false,
        multiplePostBreakDownLoader: false,
        profileBasicLoading: false,
        profileLikesLoading: false,
        profileCommentsLoading: false,
        profileSharesLoading: false,
        profileTopPostLoading: false,
        profileGrowthFollowersLoading: false,
        socialListeningDataLoading: false,
        noOfPeopleLoadiing: false,
        noOfPeopleLoading: false,
        noOfMentionsLoading: false,
        noOfSocialInteractionLoading: false,
        noOfPotentialImpressionLoading: false,
        sentimentInTimeDataLoading: false,
        emojiChartDataLoading: false,
      };

    case "SOCIAL_MEDIA_RES_ERROR": // server response error case
      return {
        ...state,
        profilesListForCompareLoading: false,
        addedProfileListLoading: false,
        profilesListForCompareLoading: false,
        profileOverviewLoading: false,
        fanGrowthLoader: false,
        interactionLoader: false,
        postBreakDownLoader: false,
        multiplePostBreakDownLoader: false,
        profileBasicLoading: false,
        profileLikesLoading: false,
        profileCommentsLoading: false,
        profileSharesLoading: false,
        profileTopPostLoading: false,
        contentNewsFeedLoading: false,
        profileGrowthFollowersLoading: false,
        socialListeningDataLoading: false,
        noOfPeopleLoadiing: false,
        noOfMentionsLoading: false,
        noOfSocialInteractionLoading: false,
        noOfPotentialImpressionLoading: false,
        sentimentInTimeDataLoading: false,
        emojiChartDataLoading: false,
        getComparisionProfileError:action.payload,
        searchLoading:false
      };

    // Social Media Content NewsFeed

    case "GET_PROFILE_CONTENT_FEED":
      return {
        ...state,
        contentNewsFeedLoading: true,
      };

    case "GET_PROFILE_CONTENT_FEED_SUCCESS":
      return {
        ...state,
        contentNewsFeedLoading: false,
        contentNewsFeed: action.payload,
      };

    case "CLEAR_PROFILE_CONTENT_FEED":
      return {
        ...state,
        contentNewsFeedLoading: true,
        contentNewsFeed: null,
      };

    /* profiles To compare on selecting checkbox from added social profiles list  */
    case "SELECT_PROFILES_TO_COMPARE":
      return {
        ...state,
        selectedProfilesListToComapre:
          state.selectedProfilesListToComapre.concat(action.payload),
      };

    case "REMOVE_PROFILES_FROM_COMPARE":
      return {
        ...state,
        selectedProfilesListToComapre: action.payload,
      };
    case "DELETE_SELECT_PROFILES_TO_COMPARE" /* delete compared porifle list */:
      return {
        ...state,
        selectedProfilesListToComapre:
          state.selectedProfilesListToComapre.filter(
            (profile) => profile.id !== action.payload
          ),
      };
    case "RESET_PROFILES_TO_COMPARE" /* reset selected profiles list for comparison  */:
      return {
        ...state,
        selectedProfilesListToComapre: [],
      };

    //For selecting current id of top posts being displayed

    case "TOP_POST_ID":
      return {
        ...state,
        topPostProfileID: action.payload,
      };

    case "RESET_TOP_POST_ID":
      return {
        ...state,
        topPostProfileID: null,
      };

    //social-listening-page-reducer
    case "GET_SOCIAL_LISTENING_TAGS_START":
      return {
        ...state,
        socialListeningDataLoading: true,
      };
    case "GET_SOCIAL_LISTENING_TAGS":
      return {
        ...state,
        socialListeningDataLoading: false,
        socialListeningData: action.payload,
      };
    case "GET_NO_OF_PEOPLE_START":
      return {
        ...state,
        noOfPeopleLoading: true,
        socialListeningError: false
      };
    case "GET_NO_OF_PEOPLE_END":
      return {
        ...state,
        noOfPeopleLoading: false,
        socialListeningError: false
      };
    case "GET_NO_OF_PEOPLE":
      return {
        ...state,
        noOfPeople: action.payload,
        socialListeningError: false
      };
    case "GET_NO_OF_MENTIONS_START":
      return {
        ...state,
        noOfMentionsLoading: true,
      };
    case "GET_NO_OF_MENTIONS":
      return {
        ...state,
        noOfMentions: action.payload,
        noOfMentionsLoading: false,
      };

    case "GET_NO_OF_SOCIAL_INTERACTIONS_START":
      return {
        ...state,
        noOfSocialInteractionLoading: true,
      };

    case "GET_NO_OF_SOCIAL_INTERACTIONS":
      return {
        ...state,
        noOfSocialInteraction: action.payload,
        noOfSocialInteractionLoading: false,
      };
    case "GET_NO_OF_POTENTIAL_IMPRESSION_START":
      return {
        ...state,
        noOfPotentialImpressionLoading: true,
      };
    case "GET_NO_OF_POTENTIAL_IMPRESSION":
      return {
        ...state,
        noOfPotentialImpression: action.payload,
        noOfPotentialImpressionLoading: false,
      };

    case "GET_EMOJI_CHART_DATA_START":
      return {
        ...state,
        emojiChartDataLoading: true,
      };

    case "GET_EMOJI_CHART_DATA":
      return {
        ...state,
        emojiChartData: action.payload,
        emojiChartDataLoading: false,
      };
    case "GET_SENTIMENT_TIME_DATA_START":
      return {
        ...state,
        sentimentInTimeDataLoading: true,
      };
    case "GET_SENTIMENT_TIME_DATA":
      return {
        ...state,
        sentimentInTimeData: action.payload,
        sentimentInTimeDataLoading: false,
      };
    case "RESET_SOCIAL_LISTENING_DATA":
      return {
        ...state,
        noOfPeople: {},
        noOfMentions: {},
        noOfSocialInteraction: {},
        noOfPotentialImpression: {},
        emojiChartData: [],
        sentimentInTimeData: [],
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQueryData: state.searchQueryData.includes(action.payload)
          ? state.searchQueryData
          : [...state.searchQueryData, action.payload],
      };
    case "DELETE_SEARCH_QUERY":
      return {
        ...state,
        searchQueryData: state.searchQueryData.filter(
          (data) => data !== action.payload
        ),
      };
    case "RESET_SEARCH_QUERY":
      return {
        ...state,
        searchQueryData: [],
      };

    case "SOCIAL_LISTENING_ERROR":
      return {
        ...state,
        socialListeningError: true
      }

    case "SOCIAL_LISTENING_ERROR_COMPLETE":
      return {
        ...state,
        socialListeningError: false
      }

    default:
      return state;
  }
};

export default SocialMediaProfileListReducer;
