import styled from '@emotion/styled';

import { Tooltip } from 'nexus-module';

const StatusIcon = styled.div(
  {
    height: '14px',
    width: '14px',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  ({ active }) => {
    switch (active) {
      case true:
        return {
          backgroundColor: 'limegreen',
        };
      case false:
        return {
          backgroundColor: 'red',
        };

      default:
        return {
          backgroundColor: 'gray',
        };
    }
  }
);

function isStatusActive(status, exchange) {
  switch (exchange) {
    case 'binance':
      return status && status === 'TRADING';
    case 'bittrex':
      return status && status === 'ONLINE';
    default:
      return null;
  }
}

export default function StatusIndicator({ status, exchange }) {
  return (
    <Tooltip.Trigger tooltip={'Wallet status: ' + (status || 'Unknown')}>
      <StatusIcon active={isStatusActive(status, exchange)} />
    </Tooltip.Trigger>
  );
}
