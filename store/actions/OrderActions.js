import axios from 'axios';
import { 
    SENT_ORDER, 
    GET_ORDER,
    ORDER_ERROR,
    COMPLETE_ORDER
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const getCustomerOrder = () => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }
    try {
        const res = await axios.get(`${URL}/api/order/customer`);

        dispatch({
            type: GET_ORDER,
            payload: res.data
        });
    } catch (err) {
        // const errors = err.response.data.errors;

        console.log(err);

        // dispatch({
        //     type: ORDER_ERROR,
        //     payload: errors[0].msg
        // });
    }
};

export const orderComplete = (id, complete) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ id, complete });

    try {
        const res = await axios.put(`${URL}/api/order/orderComplete`, body, config);

        dispatch({
            type: COMPLETE_ORDER,
            payload: res.data.msg
        });
    } catch (err) {
        console.log(err);
    }
};

export const doPayment = (amount, validToken) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ amount, validToken });

    try {
        const res = await axios.post(`${URL}/api/order/payment`, body, config);
    } catch (err) {

    }
};

export const getPhotographerOrder = () => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
        const res = await axios.get(`${URL}/api/order/photographer`);

        dispatch({
            type: GET_ORDER,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;

        dispatch({
            type: ORDER_ERROR,
            payload: errors[0].msg
        });
    }
};

export const sentOrder = (
    photographerId,
    portfolioId,
    title,
    description,
    price,
    category,
    fromDate,
    toDate,
    paymentStatus,
    latitude,
    longitude               
    ) => async dispatch => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setAuthToken(token);
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            photographerId,
            portfolioId,
            title,
            description,
            price,
            category,
            fromDate,
            toDate,
            paymentStatus,
            latitude,
            longitude 
        });

        try {
            const res = await axios.post(`${URL}/api/order/`, body, config);

            dispatch({
                type: SENT_ORDER,
                payload: res.data
            });
        } catch (err) {
            const errors = err.response.data.errors;

            dispatch({
                type: ORDER_ERROR,
                payload: errors[0].msg
            });
        }
};