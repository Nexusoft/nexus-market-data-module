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

export default function StatusIndicator({ status, active }) {
  return (
    <Tooltip.Trigger tooltip={'Wallet status: ' + (status || 'Unknown')}>
      <StatusIcon active={active} />
    </Tooltip.Trigger>
  );
}
