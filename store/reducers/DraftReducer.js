import {
  ADD_DRAFT, 
  SET_DRAFT
} from '../actions/types';

import Draft from '../../models/draft';

const initialState = {
  draft: []
};

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_DRAFT:
      return {
        draft: action.draft.map(
          pl =>
            new Draft(
              pl.id.toString(),
              pl.title,
              pl.imageUri,
              pl.date
            )
        )
      };
    case ADD_DRAFT:
      const newDraft = new Draft(
        action.draftData.id.toString(),
        action.draftData.title,
        action.draftData.image,
        action.draftData.date
      );
      return {
        draft: state.draft.concat(newDraft)
      };
    default:
      return state;
  }
};
