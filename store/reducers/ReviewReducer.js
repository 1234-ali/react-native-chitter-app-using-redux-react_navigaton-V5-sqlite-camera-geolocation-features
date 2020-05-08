  import {
    ADD_REVIEW,
    ERROR_REVIEW
  } from '../actions/types';
  
  const initialState = {
    reviews: [],
    error: '',
    msg: ''
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
        case ADD_REVIEW: 
            return {
                ...state,
                reviews: payload,
                error: '',
                msg: ''
            };
        case ERROR_REVIEW: 
            return {
                ...state,
                error: payload
            };
        default:
        return state;
    }
  }