import { keyframes } from '@emotion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, Tooltip, Button } from 'nexus-module';

import { tradingPairIDs } from 'constants';
import {
  refreshStatus,
  refresh24hrSummary,
  refreshCandles,
  refreshOrderBook,
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
        ...tradingPairIDs.map((pairID) => dispatch(refreshStatus(pairID))),
        ...tradingPairIDs.map((pairID) => dispatch(refresh24hrSummary(pairID))),
        ...tradingPairIDs.map((pairID) => dispatch(refreshCandles(pairID))),
        ...tradingPairIDs.map((pairID) => dispatch(refreshOrderBook(pairID))),
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
