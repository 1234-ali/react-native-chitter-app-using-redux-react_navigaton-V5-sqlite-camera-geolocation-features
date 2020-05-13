import axios from 'axios';

import {
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  USER_ID_LOADED,
  IMAGE_ID_LOADED,
  LOGOUT,
  IMAGE_LOADED
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

export const loadImage = () => async dispatch => {

    const item = await AsyncStorage.getItem('id');

    const id = parseInt(item);
  
    try {
      const res = await axios.get(`${URL}/user/${id}/photo`);
  
      dispatch({
        type: IMAGE_LOADED,
        payload: res.data
      });
    } catch (err) {
      throw err;
    }
};

export const getImageById = (id) => async dispatch => {

  try {
    const res = await axios.get(`${URL}/user/${id}/photo`);

    dispatch({
      type: IMAGE_ID_LOADED,
      payload: res.data
    });
  } catch (err) {
    throw err;
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

  const config = {
    headers: {
      "Accept": "*/*", 
      "Content-Type": image.type,
    }
  }

  axios.post(
    `${URL}/user/photo`, image, config
  )
  .then((res) => {
    dispatch({
      type: IMAGE_LOADED,
      payload: JSON.parse(res.config.data)
    });
  })
  .catch((err) => {
    throw err;
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

export const UpdateUser = (given_name, family_name, email, password) => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const item = await AsyncStorage.getItem('id');

  const id = parseInt(item);

  const body = JSON.stringify({ given_name, family_name, email, password });

  try {
    await axios.patch(`${URL}/user/${id}`, body, config);

    dispatch(loadUser());
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
    throw err;
  }
};

export const logout = () => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  try {
    // await axios.post(`${URL}/logout`);

    dispatch({ type: LOGOUT });
  } catch (err) {
    throw err;
  }
};