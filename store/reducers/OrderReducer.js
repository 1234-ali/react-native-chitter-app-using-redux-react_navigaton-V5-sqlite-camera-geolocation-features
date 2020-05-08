  import { 
      SENT_ORDER, 
      GET_ORDER,
      ORDER_ERROR,
      COMPLETE_ORDER
  } from '../actions/types';
  
  const initialState = {
    orders: [],
    loading: true,
    error: '',
    msg: ''
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_ORDER:
        return {
          ...state,
          orders: payload,
          loading: false,
          msg: ''
        };
      case SENT_ORDER:
        return {
          ...state,
          orders: payload,
          loading: false,
          msg: ''
        };
    case ORDER_ERROR:
        return {
            ...state,
            error: payload,
            loading: false,
            msg: ''
        };
    case COMPLETE_ORDER: 
        return {
          ...state,
          msg: payload,
          loading: false
        };
    default:
        return state;
    }
  };