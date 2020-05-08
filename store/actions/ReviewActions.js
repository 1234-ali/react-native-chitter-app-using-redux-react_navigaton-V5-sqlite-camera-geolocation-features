import axios from 'axios';
import {
  ADD_REVIEW,
  ERROR_REVIEW
} from '../actions/types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const addRating = (orderId, user, userType, rating, comment) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ orderId, user, userType, rating, comment });

    try {
        const res = await axios.post(`${URL}/api/review/`, body, config);

        dispatch({
            type: ADD_REVIEW,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_REVIEW,
            payload: err
        });
    }
};

export const getUserReviews = () => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
        const res = await axios.get(`${URL}/api/review/`);

        dispatch({
            type: ADD_REVIEW,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        dispatch({
            type: ERROR_REVIEW,
            payload: errors[0].msg
        });
    }
};


export const getUserIdReviews = (id) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
        const res = await axios.get(`${URL}/api/review/getUserReviews/${id}`);

        dispatch({
            type: ADD_REVIEW,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        dispatch({
            type: ERROR_REVIEW,
            payload: errors[0].msg
        });
    }
};