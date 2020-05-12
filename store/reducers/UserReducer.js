  import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    UPDATE_USERNAME,
    RESET_FAIL,
    RESET_SUCCESS,
    VERIFY_USER,
    RESET_USER,
    USER_ID_LOADED
  } from '../actions/types';

  import AsyncStorage from '@react-native-community/async-storage';
  
  const initialState = {
    token: AsyncStorage.getItem('token'),
    id: AsyncStorage.getItem('id'),
    isAuthenticated: null,
    loading: true,
    user: null,
    allUsers: null,
    resetUser: null,
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
          error: '',
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