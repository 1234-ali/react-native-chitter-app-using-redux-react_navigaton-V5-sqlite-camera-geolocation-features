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
        console.log(err)
        throw err
    }
};