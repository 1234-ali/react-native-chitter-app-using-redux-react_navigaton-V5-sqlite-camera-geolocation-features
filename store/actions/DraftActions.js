var RNFS = require('react-native-fs');  // It is used to copy file from default to new path

import { 
  SET_DRAFT
} from './types';

import { insertDraft, fetchDraft, dropDraft, draftUpdated } from '../../helpers/db';  // import all the function from db.js


export const addDraft = (userId, title, image, date) => {
  return async dispatch => {
    const fileName = image.split('/').pop(); 
    const newPath =  "file://" + RNFS.DocumentDirectoryPath + '/' + fileName;

    try { 
      // rnfs is used here to copy file from default to new path
      await RNFS.copyFile(
          image,
          newPath
      );
      // calling the function of inserting draft here
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


//  it is used to fetch draft from sqlote storage
export const loadDraft = (userId) => {
  return async dispatch => {
    try {
      // fetchDraft method is calling with userId
      const dbResult = await fetchDraft(userId);

      // when drafts are fetch we dispatch the reducers , send the fetch data to reducers and put in to global state that state used in draftscreen.js file
      dispatch({ type: SET_DRAFT, drafts: dbResult });
    } catch (err) {
      throw err
    }
  };
};

//  delete draft
export const deleteDraft = (id) => {
  return async dispatch => {
    try {
      const dbResult = await dropDraft(id); // dropDraft from db.js file
      
      loadDraft();
    } catch (err) {
      throw err
    }
  };
};


// update draft function to update draft, this function is calling from updatedraftscreen.js 
export const updateDraft = (id, userId, title, image, date) => {
  return async dispatch => {
    const fileName = image.split('/').pop();
    const newPath =  "file://" + RNFS.DocumentDirectoryPath + '/' + fileName;

    try {
      await RNFS.copyFile(
          image,
          newPath
      );
      // draftUpdated from db.js
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