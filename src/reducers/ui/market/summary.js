import * as TYPE from 'actions/types';

const initialState = {
  binance: null,
  bittrex: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.BINANCE_SUMMARY:
      return {
        ...state,
        binance: action.payload,
      };

    case TYPE.BITTREX_SUMMARY:
      return {
        ...state,
        bittrex: action.payload,
      };
  }
};
