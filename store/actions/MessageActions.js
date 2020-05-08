import axios from 'axios';
import { 
    POST_USER_MESSAGE, 
    ERROR_USER_MESSAGE,
    GET_USER_MESSAGE
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const postUsers = (senderId, message) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const body = JSON.stringify({ senderId, message });

    try {
        const res = await axios.post(`${URL}/api/message/postUsers`, body, config);

        dispatch({
            type: POST_USER_MESSAGE,
            payload: res.data.msg
        });
    } catch (err) {
        dispatch({
            type: ERROR_USER_MESSAGE,
            payload: err
        });
    }
};

export const getUsers = (userType) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
        const res = await axios.get(`${URL}/api/message/getUsers/${userType}`);

        dispatch({
            type: GET_USER_MESSAGE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: ERROR_USER_MESSAGE,
            payload: err
        });
    }
};