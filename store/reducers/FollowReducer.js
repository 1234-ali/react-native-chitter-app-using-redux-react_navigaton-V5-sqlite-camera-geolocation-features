  import { 
      SEARCH_USER, 
      GET_Followers,
      GET_FOLLOWINGS,
      GET_PRIVATE_Followers,
      GET_PRIVATE_Followings
  } from '../actions/types';
  
  const initialState = {
    users: [],
    followers: [],
    followings: [],
    privatefollower: [],
    privatefollowings: [],
    loading: true,
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SEARCH_USER:
        return {
          ...state,
          users: payload,
          loading: false
        };
      case GET_Followers:
        return {
          ...state,
          followers: payload,
          loading: false
        };
    case GET_FOLLOWINGS:
        return {
            ...state,
            followings: payload,
            loading: false
        };
    case GET_PRIVATE_Followers: 
        return {
          ...state,
          privatefollower: payload,
          loading: false
        };
    case GET_PRIVATE_Followings: 
        return {
          ...state,
          privatefollowings: payload,
          loading: false
        };
    default:
        return state;
    }
  };