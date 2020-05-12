import axios from 'axios';
import { 
    SEARCH_USER, 
    GET_Followers,
    GET_FOLLOWINGS,
    GET_PRIVATE_Followers,
    GET_PRIVATE_Followings
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const userSearch = (query) => async dispatch => {

    try {
        const res = await axios(`${URL}/search_user?q=${query}`);

        dispatch({
            type: SEARCH_USER,
            payload: res.data
        });
    } catch (err) {
        throw err;
    }
};

export const getFollowers = () => async dispatch => {
    const id = await AsyncStorage.getItem('id');


    try {
        const res = await axios.get(`${URL}/user/${id}/followers`);

        dispatch({
            type: GET_Followers,
            payload: res.data
        });
    } catch (err) {
        throw err;
    }
};

export const getFollowings = () => async dispatch => {

    const id = await AsyncStorage.getItem('id');

    try {
        const res = await axios.get(`${URL}/user/${id}/following`);

        dispatch({
            type: GET_FOLLOWINGS,
            payload: res.data
        });
    } catch (err) {
        throw err;
    }
};

export const followUser = (id) => async dispatch => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setAuthToken(token);
        }

        try {
            await axios.post(`${URL}/user/${id}/follow`);
        } catch (err) {
            throw err;
        }
};

export const unFollowUser = (id) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    try {
      await axios.delete(`${URL}/user/${id}/follow`);
  } catch (err) {
      throw err;
  }
};

export const getFollowersById = (id) => async dispatch => {

    try {
        const res = await axios.get(`${URL}/user/${id}/followers`);

        dispatch({
            type: GET_PRIVATE_Followers,
            payload: res.data
        });
    } catch (err) {
        throw err;
    }
};

export const getFollowingsById = (id) => async dispatch => {

    try {
        const res = await axios.get(`${URL}/user/${id}/following`);

        dispatch({
            type: GET_PRIVATE_Followings,
            payload: res.data
        });
    } catch (err) {
        throw err;
    }
};