import axios from 'axios';
import { 
    CREATE_PORTFOLIO, 
    GET_CHITS,
    PORTFOLIO_ERROR
} from './types';

import URL from './Url';

import setAuthToken from '../../utils/setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';

export const getChits = () => async dispatch => {
    try {
        const res = await axios.get(`${URL}/chits`);

        dispatch({
            type: GET_CHITS,
            payload: res.data
        });
    } catch (err) {
        throw err
    }
};

export const postChits = (chit_content, longitude, latitude) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const body = JSON.stringify({ chit_content, longitude, latitude });

    try {
        const res = await axios.post(`${URL}/chits`, body, config);

        console.log(res);
        // dispatch({
        //     type: GET_FOLLOWINGS,
        //     payload: res.data
        // });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

