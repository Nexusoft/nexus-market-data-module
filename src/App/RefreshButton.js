import { keyframes } from '@emotion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, Tooltip, Button } from 'nexus-module';

import {
  refreshStatuses,
  refresh24hrSummaries,
  refreshCandlesticks,
  refreshOrderBooks,
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
        dispatch(refreshStatuses()),
        dispatch(refresh24hrSummaries()),
        dispatch(refreshCandlesticks()),
        dispatch(refreshOrderBooks()),
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
