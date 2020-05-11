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
        draft: action.drafts.map(
          d1 =>
            new Draft(
              d1.id.toString(),
              d1.title,
              d1.imageUri,
              d1.date
            )
        )
      };
    default:
      return state;
  }
};
