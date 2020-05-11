var RNFS = require('react-native-fs');

import { 
  ADD_DRAFT,
  SET_DRAFT
} from './types';

import { insertDraft, fetchDraft, dropDraft, draftUpdated } from '../../helpers/db';


export const addDraft = (userId, title, image, date) => {
  return async dispatch => {
    const fileName = image.split('/').pop();
    const newPath =  "file://" + RNFS.DocumentDirectoryPath + '/' + fileName;

    try {
      await RNFS.copyFile(
          image,
          newPath
      );
      
      const dbResult = await insertDraft(
        userId,
        title,
        newPath,
        date
      );

      console.log(dbResult);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadDraft = (userId) => {
  console.log(userId)
  return async dispatch => {
    try {
      const dbResult = await fetchDraft(userId);
      // console.log(dbResult);
      dispatch({ type: SET_DRAFT, drafts: dbResult });
    } catch (err) {
      throw err
    }
  };
};

export const deleteDraft = (id) => {
  return async dispatch => {
    try {
      const dbResult = await dropDraft(id);
      
      console.log(dbResult);
      loadDraft();
      // dispatch({ type: SET_DRAFT, drafts: dbResult });
    } catch (err) {
      throw err
    }
  };
};

export const updateDraft = (id, userId, title, image, date) => {
  return async dispatch => {
    const fileName = image.split('/').pop();
    const newPath =  "file://" + RNFS.DocumentDirectoryPath + '/' + fileName;

    try {
      await RNFS.copyFile(
          image,
          newPath
      );
      
      const dbResult = await draftUpdated(
        id,
        userId,
        title,
        newPath,
        date
      );

      console.log(dbResult);
    } catch (err) {
      throw err;
    }
  };
};