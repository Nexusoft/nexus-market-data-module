import * as TYPE from './types';
import { proxyRequest } from 'nexus-module';

export const marketDataLoaded = () => ({ type: TYPE.MARKET_DATA_LOADED });

async function callBinance(path, options) {
  const { data } = await proxyRequest(
    'https://api.binance.com/api/v3/' + path,
    { method: 'GET', ...options }
  );
  return data;
}

async function callBittrex(path, options) {
  const { data } = await proxyRequest('https://api.bittrex.com/v3/' + path, {
    method: 'GET',
    ...options,
  });
  return data;
}

export const binanceWalletStatus = () => async (dispatch) => {
  const data = await callBinance('exchangeInfo?symbol=NXSBTC');
  const walletOnline = data.status === 'TRADING';
  dispatch({
    type: TYPE.BINANCE_STATUS,
    payload: walletOnline,
  });
};

export const bittrexWalletStatus = () => async (dispatch) => {
  const data = await callBittrex('markets/NXS-BTC');
  const walletOnline = data.status === 'ONLINE';

  dispatch({
    type: TYPE.BITTREX_STATUS,
    payload: walletOnline,
  });
};

export const binance24hrInfo = () => async (dispatch) => {
  const data = await callBinance('ticker/24hr?symbol=NXSBTC');
  const res = {
    lastPrice: data.lastPrice,
    change: data.priceChangePercent,
    high: data.highPrice,
    low: data.lowPrice,
    volume: data.volume,
    quoteVolume: data.quoteVolume,
  };
  dispatch({ type: TYPE.BINANCE_SUMMARY, payload: res });
};

export const bittrex24hrInfo = () => async (dispatch) => {
  const [summary, ticker] = await Promise.all([
    callBittrex('markets/NXS-BTC/summary'),
    callBittrex('markets/NXS-BTC/ticker'),
  ]);

  const res = {
    lastPrice: ticker.lastTradeRate,
    change: summary.percentChange,
    high: summary.high,
    low: summary.low,
    volume: summary.volume,
    quoteVolume: summary.quoteVolume,
  };
  dispatch({ type: TYPE.BITTREX_SUMMARY, payload: res });
};

export const binanceCandlestickLoader = () => async (dispatch) => {
  const data = await callBinance('klines?symbol=NXSBTC&interval=1d');

  const res = data
    .reverse()
    .slice(0, 30)
    .map((e) => {
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
    });
  dispatch({ type: TYPE.BINANCE_CANDLESTICK, payload: res });
  dispatch(marketDataLoaded());
};

export const bittrexCandlestickLoader = () => async (dispatch) => {
  const data = await callBittrex('markets/NXS-BTC/candles/DAY_1/recent');

  const res = data.result
    .reverse()
    .map((e) => {
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

// action creators for the market depth calls

export const binanceDepthLoader = () => async (dispatch) => {
  const data = await callBinance('depth?symbol=NXSBTC');
  const res = {
    sell: data.asks
      .map((ele) => {
        return {
          Volume: parseFloat(ele[1]),
          Price: parseFloat(ele[0]),
        };
      })
      .sort((a, b) => b.Price - a.Price)
      .reverse(),
    buy: data.bids
      .map((ele) => {
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

export const bittrexDepthLoader = () => async (dispatch) => {
  const data = await callBittrex('markets/NXS-BTC/orderbook');

  const res = {
    buy: data.result.buy
      .sort((a, b) => b.Rate - a.Rate)
      .map((e) => {
        return { Volume: e.Quantity, Price: e.Rate };
      }),
    sell: data.result.sell
      .sort((a, b) => b.Rate - a.Rate)
      .map((e) => {
        return { Volume: e.Quantity, Price: e.Rate };
      })
      .reverse(),
  };
  dispatch({ type: TYPE.BITTREX_ORDERBOOK, payload: res });
  dispatch(marketDataLoaded());
};

// actions creators for candlestick data
