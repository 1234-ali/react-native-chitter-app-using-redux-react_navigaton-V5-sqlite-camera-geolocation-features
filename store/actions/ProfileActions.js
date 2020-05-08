import axios from 'axios';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from '../actions/types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const userProfiles = () => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  try {
    
      const res = await axios.get(`${URL}/api/profile/userProfiles`);
      
      dispatch({
          type: GET_PROFILE,
          payload: res.data
      });
  } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response.data.msg
      });
  }
};

export const addCoverAvatar = (coverAvatar) => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ coverAvatar });
  
    try {
      const res = await axios.put(`${URL}/api/profile/coverAvatar`, body, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(userProfiles());
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response.data.msg
    });
  }
};

export const addFrom = (from) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ from });
  
    try {
      const res = await axios.put(`${URL}/api/profile/from`, body, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(userProfiles());
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response.data.msg
    });
  }
};


export const addCity = (city) => async dispatch => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ city });
  
    try {
      const res = await axios.put(`${URL}/api/profile/city`, body, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(userProfiles());
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response.data.msg
    });
  }
};

export const addLanguage = (language, languageLevel) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const body = JSON.stringify({ language, languageLevel });
    
      try {
        const res = await axios.put(`${URL}/api/profile/addLanguage`, body, config);

        dispatch({
          type: UPDATE_PROFILE,
          payload: res.data
        });

        dispatch(userProfiles());
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response.data.msg
      });
    }
  };

  export const deleteLanguage = (id) => async dispatch => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }

      try {
        const res = await axios.put(`${URL}/api/profile/deleteLanguage/${id}`);

        dispatch({
          type: UPDATE_PROFILE,
          payload: res.data
        });

        dispatch(userProfiles());
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response.data.msg
      });
    }
  };