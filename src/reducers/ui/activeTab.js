import * as TYPE from 'actions/types';

// summary | price | orderbook
const initialState = 'summary';

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SWITCH_TAB:
      return action.payload;

    default:
      return state;
  }
};
