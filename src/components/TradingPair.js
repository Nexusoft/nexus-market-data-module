import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import StatusIndicator from 'components/StatusIndicator';
import BinanceLogo from 'components/BinanceLogo';
import BittrexLogo from 'components/BittrexLogo';
import CoinstoreLogo from 'components/CoinstoreLogo';
import { tradingPairs } from 'constants';

const PairSymbol = styled.div(({ theme }) => ({
  display: 'inline-block',
  padding: '.2em .6em',
  background: theme.background,
  color: theme.foreground,
  borderRadius: 4,
  marginRight: '1em',
}));

const logo = {
  binance: <BinanceLogo className="mr1 v-align" />,
  bittrex: <BittrexLogo className="mr1 v-align" />,
  coinstore: <CoinstoreLogo className="mr1 v-align" />,
};

export default function TradingPair({ pairID }) {
  const { exchange, baseTicker, quoteTicker } = tradingPairs[pairID];
  const status = useSelector((state) => state.ui.market.status[pairID]);
  return (
    <div>
      {logo[exchange]}
      <PairSymbol>
        {baseTicker}/{quoteTicker}
      </PairSymbol>
      <StatusIndicator status={status} exchange={exchange} />
    </div>
  );
}
