  import {
    GET_CHITS,
    CHIT_IMAGE_LOADED,
    CHIT_IMAGE_ERROR
  } from '../actions/types';
  
  const initialState = {
    profile: null,
    chits: [],
    chitImg: null,
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
        case CHIT_IMAGE_LOADED:
          return {
            ...state,
            chitImg: payload,
            loading: false
          }; 
        case CHIT_IMAGE_ERROR:
          return {
            ...state,
            chitImg: null,
            loading: false
          }; 
      default:
        return state;
    }
  }