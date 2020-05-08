  import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED,
    UPDATE_USERNAME,
    RESET_FAIL,
    RESET_SUCCESS,
    VERIFY_USER,
    RESET_USER
  } from '../actions/types';

  import AsyncStorage from '@react-native-community/async-storage';
  
  const initialState = {
    token: AsyncStorage.getItem('token'),
    id: AsyncStorage.getItem('id'),
    isAuthenticated: null,
    loading: true,
    user: null,
    resetUser: null,
    error: '',
    msg: ''
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
      case UPDATE_USERNAME:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
          error: ''
        };
      case RESET_USER:
        return {
          ...state,
          isAuthenticated: false,
          loading: false,
          user: null,
          resetUser: payload,
          error: ''
        };
      case REGISTER_SUCCESS:
      case RESET_SUCCESS:
      case VERIFY_USER:
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
      case ACCOUNT_DELETED:
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: '',
          msg: ''
        };
      case LOGIN_FAIL:
      case REGISTER_FAIL:
      case RESET_FAIL:
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: payload,
          msg: ''
        };
      case LOGOUT:
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('id');
        return {
          ...state,
          token: null,
          userType: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: '',
          msg: ''
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