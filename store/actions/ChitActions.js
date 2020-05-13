import axios from 'axios';
import { 
    GET_CHITS,
    CHIT_IMAGE_LOADED,
    CHIT_IMAGE_ERROR
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

export const postChits = (chit_content, longitude, latitude, image) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
    };

    const location = {
        longitude, 
        latitude
    }
    
    const body = { timestamp: new Date().getTime(), chit_content, location };

    try {
        const res = await axios.post(`${URL}/chits`, body, config);

        if (image != null) {
            const imgConfig = {
                headers: {
                  "Accept": "*/*", 
                  "Content-Type": image.type,
                }
            }

            await axios.post(`${URL}/chits/${res.data.chit_id}/photo`, image, imgConfig);

        }
    } catch (err) {
        throw err;
    }
};

export const ChitImage = (id) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    try {
      const res = await axios.get(`${URL}/chits/${id}/photo`);
  
      dispatch({
        type: CHIT_IMAGE_LOADED,
        payload: res.data
      });
    } catch (err) {
        dispatch({
            type: CHIT_IMAGE_ERROR
        });
    }
  };

