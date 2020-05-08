import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RESET_FAIL,
  RESET_SUCCESS,
  RESET_USER,
  VERIFY_USER
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';



// export const username = (username) => async dispatch => {
//   const token = await AsyncStorage.getItem('token');
//   if (token) {
//     setAuthToken(token);
//   }

//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   const body = JSON.stringify({ username });

//   try {
//     await axios.put(`${URL}/api/users/username`, body, config);

//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     console.log(errors);
//   }
// };

export const avatar = (avatar) => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ avatar });

  try {
    await axios.put(`${URL}/api/users/avatar`, body, config);

    dispatch(loadUser());
  } catch (err) {
      const errors = err.response.data.errors;

      console.log(errors);
  }
};

// export const resetPassword = (email) => async dispatch => {

//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   const body = JSON.stringify({ email });

//   try {
//     const res = await axios.post(`${URL}/api/auth/resetPassword`, body, config);

//     dispatch({
//       type: RESET_SUCCESS,
//       payload: res.data.msg
//     });
//   } catch (err) {
//       const errors = err.response.data.errors;
//       dispatch({
//         type: RESET_FAIL,
//         payload: errors[0].msg
//       });
//   }
// };

// export const resetPasswordCode = (code) => async dispatch => {

//   try {
//     const res = await axios.post(`${URL}/api/auth/resetPasswordCode/${code}`);

//     dispatch({
//       type: RESET_USER,
//       payload: res.data
//     });
//   } catch (err) {
//       const errors = err.response.data.errors;
//       dispatch({
//         type: RESET_FAIL,
//         payload: errors[0].msg
//       });
//   }
// };

// export const verifyCode = (code) => async dispatch => {

//   try {
//     const res = await axios.post(`${URL}/api/users/verifyEmail/${code}`);

//     dispatch({
//       type: VERIFY_USER,
//       payload: res.data.msg
//     });
//   } catch (err) {
//       const errors = err.response.data.errors;
//       dispatch({
//         type: RESET_FAIL,
//         payload: errors[0].msg
//       });
//   }
// };

// export const changePassword = (userId, password) => async dispatch => {

//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   const body = JSON.stringify({ userId, password });

//   try {
//     const res = await axios.put(`${URL}/api/auth/changePassword`, body, config);

//     dispatch({
//       type: RESET_SUCCESS,
//       payload: res.data.msg
//     });
//   } catch (err) {
//       const errors = err.response.data.errors;

//       dispatch({
//         type: RESET_FAIL,
//         payload: errors[0].msg
//       });
//   }
// };

export const loadUser = () => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

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

    console.log(res.data)

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
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  try {
    await axios.post(`${URL}/logout`);

    dispatch({ type: LOGOUT });
  } catch (err) {
    console.log(err);
    throw err;
    
  }
};