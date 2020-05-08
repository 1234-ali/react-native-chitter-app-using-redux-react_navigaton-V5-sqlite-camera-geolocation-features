var RNFS = require('react-native-fs');

import { 
  ADD_DRAFT,
  SET_DRAFT
} from './types';

import { insertDraft, fetchDraft } from '../../helpers/db';


export const addDraft = (title, image, date) => {
  return async dispatch => {
    const fileName = image.split('/').pop();
    const newPath =  RNFS.DocumentDirectoryPath + '/' + fileName;

    try {
      await RNFS.copyFile(
          image,
          newPath
      );
      
      const dbResult = await insertDraft(
        title,
        newPath,
        date
      );
      console.log(dbResult);
      dispatch({
        type: ADD_DRAFT,
        draftData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          date: date
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadDraft = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchDraft();
      console.log(dbResult);
      dispatch({ type: SET_DRAFT, places: dbResult.rows._array });
    } catch (err) {
      throw err
    }
  };
};
