export const tradingPairs = {
  'binance:NXSBTC': {
    exchange: 'binance',
    symbol: 'NXSBTC',
    baseTicker: 'NXS',
    quoteTicker: 'BTC',
  },
  'bittrex:NXS-BTC': {
    exchange: 'bittrex',
    symbol: 'NXS-BTC',
    baseTicker: 'NXS',
    quoteTicker: 'BTC',
  },
};

export const tradingPairIDs = Object.keys(tradingPairs);
