import * as TYPE from 'actions/types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_SUMMARY:
      return {
        ...state,
        [action.pairID]: action.payload,
      };

    default:
      return state;
  }
};
