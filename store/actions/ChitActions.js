// this is all the actions file n this file there are different function all the functions are callling from different screen
// we mae api call and when data successfully return then we dispatch reducer.

//  all the action folder files working are same except draft because drafts are stored in local storage.
//  i Only comment in this file

//  every actions folder file has its own reducer where they set the state.

// for example chitactions.js reducer is chitReducer.js file in reducer folder


import axios from 'axios'; // to make api call
import { 
    GET_CHITS,
    CHIT_IMAGE_LOADED,
    CHIT_IMAGE_ERROR
} from './types';  // there are the different case of reducers all the reducers written in reducers.js file

import URL from './Url'; // the url of api is in this file

import setAuthToken from '../../utils/setAuthToken'; // this file set the toen in header, you can  see the woring below
import AsyncStorage from '@react-native-community/async-storage'; // used to store token and id , we clear the data on logout

export const getChits = () => async dispatch => {
    try {
        const res = await axios.get(`${URL}/chits`);
// we dispatch the reducers after succes full call
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
        throw err; // this error goes to catch block from where this function is calling in screen folder files
    }
};

export const ChitImage = (id) => async dispatch => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setAuthToken(token);  // this is used to set token 
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

