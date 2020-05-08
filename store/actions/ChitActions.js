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
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

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

export const allUserPortfolios = () => async dispatch => {
    
    try {
        const res = await axios.get(`${URL}/api/portfolio/allUserPortfolios`);

        dispatch({
            type: GET_CHITS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PORTFOLIO_ERROR,
            payload: err
        });
    }
};

export const deletePortfolio = (id) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
      const res = await axios.delete(`${URL}/api/portfolio/deletePortfolio/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(userPortfolios());
  } catch (err) {
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: err.response.data.msg
    });
  }
};

export const createPortfolio = (
    profileId,
    title, 
    category, 
    subCategory, 
    experience, 
    description, 
    price, 
    latitude, 
    longitude, 
    video,
    image1,
    image2, 
    image3, 
    
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
            profileId,
            title, 
            category, 
            subCategory, 
            experience, 
            description, 
            price, 
            latitude, 
            longitude, 
            video,
            image1,
            image2, 
            image3, 
        });

        try {
            const res = await axios.post(`${URL}/api/portfolio/`, body, config);

            dispatch({
                type: CREATE_PORTFOLIO,
                payload: res.data
            });

            dispatch(userPortfolios());
        } catch (err) {

            dispatch({
                type: PORTFOLIO_ERROR,
                payload: err
            });
        }
};

export const updatePortfolio = (
    portfolioId,
    title, 
    category, 
    subCategory, 
    experience, 
    description, 
    price, 
    latitude, 
    longitude, 
    video,
    image1,
    image2, 
    image3, 
    
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
            portfolioId,
            title, 
            category, 
            subCategory, 
            experience, 
            description, 
            price, 
            latitude, 
            longitude, 
            video,
            image1,
            image2, 
            image3, 
            
        });

        try {
            const res = await axios.put(`${URL}/api/portfolio/updatePortfolio`, body, config);

            dispatch({
                type: CREATE_PORTFOLIO,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: PORTFOLIO_ERROR,
                payload: err
            });
        }
};