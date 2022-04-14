import { keyframes } from '@emotion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, Tooltip, Button } from 'nexus-module';

import {
  binanceDepth,
  bittrexDepth,
  binance24hrInfo,
  bittrex24hrInfo,
  binanceCandlestick,
  bittrexCandlestick,
  binanceStatus,
  bittrexStatus,
} from 'actions/market';

const spin = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`;

function useRefreshMarket() {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const refreshMarket = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.allSettled([
        dispatch(binanceStatus()),
        dispatch(binance24hrInfo()),
        dispatch(binanceCandlestick()),
        dispatch(binanceDepth()),
        dispatch(bittrexStatus()),
        dispatch(bittrex24hrInfo()),
        dispatch(bittrexCandlestick()),
        dispatch(bittrexDepth()),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return [refreshing, refreshMarket];
}

export default function RefreshButton() {
  const [refreshing, refreshMarket] = useRefreshMarket();
  return (
    <Tooltip.Trigger tooltip="Refresh">
      <Button square skin="plain" onClick={refreshMarket}>
        <Icon
          icon={{ url: 'icons/syncing.svg', id: 'icon' }}
          style={
            refreshing
              ? {
                  animation: `${spin} 2s linear infinite`,
                }
              : undefined
          }
        />
      </Button>
    </Tooltip.Trigger>
  );
}
