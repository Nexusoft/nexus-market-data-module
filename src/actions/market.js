import { proxyRequest } from 'nexus-module';

import { tradingPairs } from 'constants';
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

const fetchStatus = {
  binance: async (symbol) => {
    const data = await callBinance('exchangeInfo?symbol=' + symbol);
    const { status } = data.symbols.find((s) => s.symbol === 'NXSBTC');
    return status;
  },
  bittrex: async (symbol) => {
    const data = await callBittrex('markets/' + symbol);
    dispatch({
      type: TYPE.BITTREX_STATUS,
      payload: data.status,
    });
  },
};

export const refreshStatus = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const status = fetchStatus[exchange](symbol);
  dispatch({
    type: TYPE.SET_STATUS,
    payload: status,
    pairID,
  });
};

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
      callBittrex('markets/NXS-BTC/summary'),
      callBittrex('markets/NXS-BTC/ticker'),
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

export const refresh24hrSummary = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const summary = fetch24hrSummary[exchange](symbol);
  dispatch({
    type: TYPE.SET_SUMMARY,
    payload: summary,
    pairID,
  });
};

const fetchCandles = {
  binance: async (symbol) => {
    const data = await callBinance(`klines?symbol=${symbol}&interval=1d`);
    const candles = data
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
    return candles;
  },
  bittrex: async (symbol) => {
    const data = await callBittrex(`markets/${symbol}/candles/DAY_1/recent`);
    const candles = data.result
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
    return candles;
  },
};

export const refreshCandles = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const candles = fetchCandles[exchange](symbol);
  dispatch({
    type: TYPE.SET_CANDLES,
    payload: candles,
    pairID,
  });
};

const fetchOrderBook = {
  binance: async (symbol) => {
    const data = await callBinance('depth?symbol=' + symbol);
    const depth = {
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
    return depth;
  },
  bittrex: async (symbol) => {
    const data = await callBittrex(`markets/${symbol}/orderbook`);
    const depth = {
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
    return depth;
  },
};

export const refreshOrderBook = (pairID) => async (dispatch) => {
  const { exchange, symbol } = tradingPairs[pairID];
  const candles = fetchOrderBook[exchange](symbol);
  dispatch({
    type: TYPE.SET_ORDERBOOK,
    payload: candles,
    pairID,
  });
};
