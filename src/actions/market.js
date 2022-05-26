import { proxyRequest } from 'nexus-module';

import { tradingPairs, tradingPairIDs } from 'constants';
import * as TYPE from './types';

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

async function callCoinstore(path, options) {
  const { data } = await proxyRequest(
    'https://api.coinstore.com/api/v1/' + path,
    {
      method: 'GET',
      ...options,
    }
  );
  return data;
}

const interval = 60000;

/**
 * MARKET STATUS
 */

const fetchStatus = {
  binance: async (symbol) => {
    const data = await callBinance('exchangeInfo?symbol=' + symbol);
    const { status } = data.symbols.find((s) => s.symbol === 'NXSBTC');
    return status;
  },
  bittrex: async (symbol) => {
    const data = await callBittrex('markets/' + symbol);
    return data.status;
  },
};

let statusTimer = null;

export const refreshStatus = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const status = await fetchStatus[exchange](symbol);
  dispatch({
    type: TYPE.SET_STATUS,
    payload: status,
    pairID,
  });
};

export const refreshStatuses = () => (dispatch) => {
  const action = () =>
    Promise.allSettled(
      tradingPairIDs.map(async (pairID) => {
        const { exchange, symbol } = tradingPairs[pairID];
        const status = await fetchStatus[exchange](symbol);
        dispatch({
          type: TYPE.SET_STATUS,
          payload: status,
          pairID,
        });
      })
    );

  clearTimeout(statusTimer);
  action().finally(() => {
    statusTimer = setTimeout(action, interval);
  });
};

/**
 * MARKET SUMMARY
 */

const fetch24hrSummary = {
  binance: async (symbol) => {
    const data = await callBinance('ticker/24hr?symbol=' + symbol);
    const summary = {
      lastPrice: data.lastPrice,
      change: data.priceChangePercent,
      high: data.highPrice,
      low: data.lowPrice,
      volume: data.volume,
      quoteVolume: data.quoteVolume,
    };
    return summary;
  },
  bittrex: async (symbol) => {
    const [summary, ticker] = await Promise.all([
      callBittrex(`markets/${symbol}/summary`),
      callBittrex(`markets/${symbol}/ticker`),
    ]);

    const finalSummary = {
      lastPrice: ticker.lastTradeRate,
      change: summary.percentChange,
      high: summary.high,
      low: summary.low,
      volume: summary.volume,
      quoteVolume: summary.quoteVolume,
    };
    return finalSummary;
  },
};

let summaryTimer = null;

export const refresh24hrSummary = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const summary = await fetch24hrSummary[exchange](symbol);
  dispatch({
    type: TYPE.SET_SUMMARY,
    payload: summary,
    pairID,
  });
};

export const refresh24hrSummaries = () => (dispatch) => {
  const action = () =>
    Promise.allSettled(
      tradingPairIDs.map(async (pairID) => {
        const { exchange, symbol } = tradingPairs[pairID];
        const summary = await fetch24hrSummary[exchange](symbol);
        dispatch({
          type: TYPE.SET_SUMMARY,
          payload: summary,
          pairID,
        });
      })
    );

  clearTimeout(summaryTimer);
  action().finally(() => {
    summaryTimer = setTimeout(action, interval);
  });
};

export const stopSummaryTimer = () => {
  clearTimeout(summaryTimer);
};

/**
 * CANDLESTICK
 */

const fetchCandles = {
  binance: async (symbol) => {
    const data = await callBinance(`klines?symbol=${symbol}&interval=1d`);
    const candles = data.map(([time, open, high, low, close]) => ({
      time: time / 1000,
      open,
      high,
      low,
      close,
    }));
    return candles;
  },
  bittrex: async (symbol) => {
    const data = await callBittrex(`markets/${symbol}/candles/DAY_1/recent`);
    const candles = data.map(({ startsAt, open, high, low, close }) => ({
      time: startsAt,
      open,
      high,
      low,
      close,
    }));
    return candles;
  },
};

let candlestickTimer = null;

export const refreshCandlestick = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const candles = await fetchCandles[exchange](symbol);
  dispatch({
    type: TYPE.SET_CANDLES,
    payload: candles,
    pairID,
  });
};

export const refreshCandlesticks = () => (dispatch) => {
  const action = () =>
    Promise.allSettled(
      tradingPairIDs.map(async (pairID) => {
        const { exchange, symbol } = tradingPairs[pairID];
        const candles = await fetchCandles[exchange](symbol);
        dispatch({
          type: TYPE.SET_CANDLES,
          payload: candles,
          pairID,
        });
      })
    );

  clearTimeout(candlestickTimer);
  action().finally(() => {
    candlestickTimer = setTimeout(action, interval);
  });
};

export const stopCandlestickTimer = () => {
  clearTimeout(candlestickTimer);
};

/**
 * ORDER BOOK
 */

const fetchOrderBook = {
  binance: async (symbol) => {
    const { bids, asks } = await callBinance('depth?limit=50&symbol=' + symbol);
    const normalize = (list) => {
      let total = 0;
      let finalList = [];
      for (const [price, quantity] of list) {
        total += parseFloat(quantity);
        finalList.push([parseFloat(price), total]);
      }
      return finalList;
    };
    return { bids: normalize(bids), asks: normalize(asks) };
  },
  bittrex: async (symbol) => {
    const { bid, ask } = await callBittrex(
      `markets/${symbol}/orderbook?depth=25`
    );
    const normalize = (list) => {
      let total = 0;
      let finalList = [];
      for (const { rate, quantity } of list) {
        total += parseFloat(quantity);
        finalList.push([parseFloat(rate), total]);
      }
      return finalList;
    };
    return { bids: normalize(bid), asks: normalize(ask) };
  },
};

let orderBookTimer = null;

export const refreshOrderBook = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const orderBook = await fetchOrderBook[exchange](symbol);
  dispatch({
    type: TYPE.SET_ORDERBOOK,
    payload: orderBook,
    pairID,
  });
};

export const refreshOrderBooks = () => (dispatch) => {
  const action = () =>
    Promise.allSettled(
      tradingPairIDs.map(async (pairID) => {
        const { exchange, symbol } = tradingPairs[pairID];
        const orderBook = await fetchOrderBook[exchange](symbol);
        dispatch({
          type: TYPE.SET_ORDERBOOK,
          payload: orderBook,
          pairID,
        });
      })
    );

  clearTimeout(orderBookTimer);
  action().finally(() => {
    orderBookTimer = setTimeout(action, interval);
  });
};

export const stopOrderBookTimer = () => {
  clearTimeout(orderBookTimer);
};
