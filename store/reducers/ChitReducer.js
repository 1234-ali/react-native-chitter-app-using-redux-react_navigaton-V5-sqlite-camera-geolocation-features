  import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    GET_CHITS,
    CREATE_PORTFOLIO,
    UPDATE_PORTFOLIO,
    PORTFOLIO_ERROR
  } from '../actions/types';
  
  const initialState = {
    profile: null,
    chits: [],
    loading: true,
    error: ''
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_PROFILE:
      case UPDATE_PROFILE:
        return {
          ...state,
          profile: payload,
          loading: false
        };
      case GET_CHITS:
      case CREATE_PORTFOLIO:
      case UPDATE_PORTFOLIO:
        return {
          ...state,
          chits: payload,
          loading: false
        };
      case PROFILE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
          profile: null
        };
        case PORTFOLIO_ERROR:
          return {
            ...state,
            error: payload,
            loading: false,
            portfolios: []
          };
      default:
        return state;
    }
  }