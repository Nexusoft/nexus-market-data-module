import * as TYPE from './types';

const {
  utilities: { proxyRequest },
} = NEXUS;

export const marketDataLoaded = () => ({ type: TYPE.MARKET_DATA_LOADED });

export const binance24hrInfo = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://api.binance.com/api/v1/ticker/24hr?symbol=NXSBTC',
    { method: 'GET' }
  );
  const res = {
    change: data.priceChangePercent,
    high: data.highPrice,
    low: data.lowPrice,
    volume: parseFloat(data.volume).toFixed(2),
  };
  dispatch({ type: TYPE.BINANCE_24, payload: res });
};

export const bittrex24hrInfo = () => async dispatch => {
  const result = await proxyRequest(
    'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-nxs',
    { method: 'GET' }
  );
  const data = result.data.result[0];

  const res = {
    change: parseFloat(
      (((data.Last - data.PrevDay) / data.PrevDay) * 100).toFixed(2)
    ),
    high: data.High,
    low: data.Low,
    volume: parseFloat(data.Volume).toFixed(2),
  };
  dispatch({ type: TYPE.BITTREX_24, payload: res });
};

// action creators for the market depth calls

export const binanceDepthLoader = () => async dispatch => {
  const { data } = await proxyRequest(
    'https://api.binance.com/api/v1/depth?symbol=NXSBTC',
    {
      method: 'GET',
    }
  );
  const res = {
    sell: data.asks
      .map(ele => {
        return {
          Volume: parseFloat(ele[1]),
          Price: parseFloat(ele[0]),
        };
      })
      .sort((a, b) => b.Price - a.Price)
      .reverse(),
    buy: data.bids
      .map(ele => {
        return {
          Volume: parseFloat(ele[1]),
          Price: parseFloat(ele[0]),
        };
      })
      .sort((a, b) => b.Price - a.Price),
  };

  dispatch({ type: TYPE.BINANCE_ORDERBOOK, payload: res });
  dispatch(marketDataLoaded());
};

export const binanceWalletStatus = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://www.binance.com/assetWithdraw/getAllAsset.html',
    { method: 'GET' }
  );
  const nxsStatus = data.filter(element => element.assetCode === 'NXS')[0];
  const walletOnline = nxsStatus.enableCharge && nxsStatus.enableWithdraw;
  //Add stuff to catch error and make this a bit more robust.
  dispatch({
    type: TYPE.BINANCE_WALLET_STATUS,
    payload: walletOnline ? 'Green' : 'Red',
  });
};

export const bittrexWalletStatus = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://bittrex.com/api/v2.0/pub/currencies/GetWalletHealth',
    { method: 'GET' }
  );
  const nxsStatus = data.result.filter(
    element => element.Health.Currency === 'NXS'
  )[0];
  const walletOnline = nxsStatus.Health.IsActive;

  dispatch({
    type: TYPE.BITTREX_WALLET_STATUS,
    payload: walletOnline ? 'Green' : 'Red',
  });
};

export const bittrexDepthLoader = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-NXS&type=both',
    { method: 'GET' }
  );

  const res = {
    buy: data.result.buy
      .sort((a, b) => b.Rate - a.Rate)
      .map(e => {
        return { Volume: e.Quantity, Price: e.Rate };
      }),
    sell: data.result.sell
      .sort((a, b) => b.Rate - a.Rate)
      .map(e => {
        return { Volume: e.Quantity, Price: e.Rate };
      })
      .reverse(),
  };
  dispatch({ type: TYPE.BITTREX_ORDERBOOK, payload: res });
  dispatch(marketDataLoaded());
};

// actions creators for candlestick data

export const binanceCandlestickLoader = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://api.binance.com/api/v1/klines?symbol=NXSBTC&interval=1d',
    { method: 'GET' }
  );

  const res = data
    .reverse()
    .map(e => {
      return {
        x: new Date(e[0]),
        open: parseFloat(e[1]),
        close: parseFloat(e[4]),
        high: parseFloat(e[2]),
        low: parseFloat(e[3]),
        label: `Date: ${new Date(e[0]).getMonth() + 1}/${new Date(
          e[0]
        ).getDate()}/${new Date(e[0]).getFullYear()}
             Open: ${parseFloat(e[1])}
             Close: ${parseFloat(e[4])}
             High: ${parseFloat(e[2])}
             Low: ${parseFloat(e[3])}`,
      };
    })
    .slice(0, 30);
  dispatch({ type: TYPE.BINANCE_CANDLESTICK, payload: res });
  dispatch(marketDataLoaded());
};

export const bittrexCandlestickLoader = () => async dispatch => {
  const {
    data,
  } = await proxyRequest(
    'https://bittrex.com/api/v2.0/pub/market/GetTicks?marketName=BTC-NXS&tickInterval=day',
    { method: 'GET' }
  );

  const res = data.result
    .reverse()
    .map(e => {
      return {
        x: new Date(e.T),
        open: e.O,
        close: e.C,
        high: e.H,
        low: e.L,
        label: `Date: ${new Date(e.T).getMonth() + 1}/${new Date(
          e.T
        ).getDate()}/${new Date(e.T).getFullYear()}
                Open: ${e.O}
                Close: ${e.C}
                High: ${e.H}
                Low: ${e.L}`,
      };
    })
    .slice(0, 30);
  dispatch({ type: TYPE.BITTREX_CANDLESTICK, payload: res });
  dispatch(marketDataLoaded());
};
