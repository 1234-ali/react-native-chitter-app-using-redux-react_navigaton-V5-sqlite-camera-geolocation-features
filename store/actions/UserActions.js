import axios from 'axios';
import {
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  USER_ID_LOADED,
  LOGOUT,
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const loadUser = () => async dispatch => {

  const item = await AsyncStorage.getItem('id');

  const id = parseInt(item);

  try {
    const res = await axios.get(`${URL}/user/${id}`);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err
    });
  }
};

export const getUserById = (id) => async dispatch => {

  try {
    const res = await axios.get(`${URL}/user/${id}`);

    dispatch({
      type: USER_ID_LOADED,
      payload: res.data
    });
  } catch (err) {
    throw err;
  }
};

export const uploadImage = (image) => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
  
  const photo = {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  };

  const form = new FormData();

  form.append("test", photo);

  axios.post(
    `${URL}/user/photo`,
    {
      body: form,
      headers: {
        'accept' : 'application/json',
        'Content-Type': 'image/jpeg',
      }
    }
  )
  .then((responseData) => {
    console.log("Success")
  })
  .catch((error) => {
    console.log("ERROR ")
  });
};

export const register = (given_name, family_name, email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ given_name, family_name, email, password });

  try {
    await axios.post(`${URL}/user`, body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: 'Register Successfully'
    });
  } catch (err) {
    throw err;
  }
};


export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });
  
  try {
    const res = await axios.post(`${URL}/login`, body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
    
  } catch (err) {

    throw err
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: LOGOUT });
  } catch (err) {
    throw err;
  }
};