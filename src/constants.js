export const tradingPairs = {
  'binance:NXS_BTC': {
    exchange: 'binance',
    symbol: 'NXS_BTC',
    baseTicker: 'NXS',
    quoteTicker: 'BTC',
  },
  'bittrex:BTC-NXS': {
    exchange: 'bittrex',
    symbol: 'BTC-NXS',
    baseTicker: 'NXS',
    quoteTicker: 'BTC',
  },
};

export const tradingPairIDs = Object.keys(tradingPairs);
