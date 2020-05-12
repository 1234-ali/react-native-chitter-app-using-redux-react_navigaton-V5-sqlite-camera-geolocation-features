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
    loading: true
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_CHITS:
        return {
          ...state,
          chits: payload,
          loading: false
        };
      default:
        return state;
    }
  }