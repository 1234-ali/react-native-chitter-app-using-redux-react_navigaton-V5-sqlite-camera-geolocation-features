var RNFS = require('react-native-fs');

import { 
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
      
      await insertDraft(
        userId,
        title,
        newPath,
        date
      );

    } catch (err) {
      throw err;
    }
  };
};

export const loadDraft = (userId) => {
  return async dispatch => {
    try {
      const dbResult = await fetchDraft(userId);

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
      
      loadDraft();
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

    } catch (err) {
      throw err;
    }
  };
};