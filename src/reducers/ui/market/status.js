import * as TYPE from 'actions/types';

const initialState = {
  binance: null,
  bittrex: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.BINANCE_STATUS:
      return {
        ...state,
        binance: action.payload,
      };

    case TYPE.BITTREX_STATUS:
      return {
        ...state,
        bittrex: action.payload,
      };
  }
};
