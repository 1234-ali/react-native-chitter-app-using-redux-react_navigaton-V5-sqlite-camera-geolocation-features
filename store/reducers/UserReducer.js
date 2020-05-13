  import {
    REGISTER_SUCCESS,
    IMAGE_LOADED,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    IMAGE_ID_LOADED,
    USER_ID_LOADED
  } from '../actions/types';

  import AsyncStorage from '@react-native-community/async-storage';
  
  const initialState = {
    token: AsyncStorage.getItem('token'),
    id: AsyncStorage.getItem('id'),
    isAuthenticated: null,
    loading: true,
    user: null,
    userImg: '',
    allUsers: null,
    allImg: '',
    error: '',
    msg: ''
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
        };
      case USER_ID_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          allUsers: payload
        };
      case REGISTER_SUCCESS:
        return {
          ...state,
          msg: payload,
          isAuthenticated: null,
          loading: false,
          error: ''
        };
      case LOGIN_SUCCESS:
        AsyncStorage.setItem('token', payload.token);
        AsyncStorage.setItem('id', (payload.id).toString());
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
          msg: ''
        };
      case LOGOUT:
        AsyncStorage.clear();
        return {
          ...state,
          token: null,
          userType: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        };
      case IMAGE_LOADED:
        return {
          ...state,
          userImg: payload,
          loading: false
        };
      case IMAGE_ID_LOADED: 
        return {
          ...state,
          allImg: payload,
          loading: false
        };
      case AUTH_ERROR: 
        return {
          ...state,
          token: null,
          id: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: payload,
          msg: ''
        };
      default:
        return state;
    }
  }