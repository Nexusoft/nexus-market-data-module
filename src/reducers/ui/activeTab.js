import * as TYPE from 'actions/types';

// overview | price | depth
const initialState = 'price';

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SWITCH_TAB:
      return action.payload;

    default:
      return state;
  }
};
