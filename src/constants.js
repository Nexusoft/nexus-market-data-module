export const tradingPairs = {
  // 'binance:NXSBTC': {
  //   exchange: 'binance',
  //   symbol: 'NXSBTC',
  //   baseTicker: 'NXS',
  //   quoteTicker: 'BTC',
  //   priceFormat: {
  //     precision: 8,
  //     minMove: 0.00000001,
  //   },
  // },
  'bittrex:NXS-BTC': {
    exchange: 'bittrex',
    symbol: 'NXS-BTC',
    baseTicker: 'NXS',
    quoteTicker: 'BTC',
    priceFormat: {
      precision: 8,
      minMove: 0.00000001,
    },
  },
  'coinstore:NXSUSDT': {
    exchange: 'coinstore',
    symbol: 'NXSUSDT',
    baseTicker: 'NXS',
    quoteTicker: 'USDT',
    priceFormat: {
      precision: 6,
      minMove: 0.000001,
    },
  },
};

export const tradingPairIDs = Object.keys(tradingPairs);
