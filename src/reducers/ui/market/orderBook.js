import * as TYPE from 'actions/types';

const initialState = {
  binance: null,
  bittrex: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.BINANCE_ORDERBOOK:
      return {
        ...state,
        binance: action.payload,
      };

    case TYPE.BITTREX_ORDERBOOK:
      return {
        ...state,
        bittrex: action.payload,
      };
  }
};
