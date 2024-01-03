import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import ExchangeImg from 'components/ExchangeImg';
import StatusIndicator from 'components/StatusIndicator';
import { useDark } from 'utils';
import { tradingPairs } from 'constants';

const PairSymbol = styled.div(({ theme }) => ({
  display: 'inline-block',
  padding: '.2em .6em',
  background: theme.background,
  color: theme.foreground,
  borderRadius: 4,
  marginRight: '1em',
}));

function CoinstoreLogo(props) {
  const dark = useDark();
  return (
    <ExchangeImg
      src={dark ? 'icons/coinstore-logo.png' : 'icons/coinstore-logo-light.png'}
      {...props}
    />
  );
}

function TradeOgreLogo(props) {
  return (
    <ExchangeImg
      src={'icons/tradeogre-logo.svg'}
      style={{
        height: 40,
      }}
      {...props}
    />
  );
}

const logoComponent = {
  coinstore: CoinstoreLogo,
  tradeogre: TradeOgreLogo,
};

export default function TradingPair({ pairID }) {
  const { exchange, baseTicker, quoteTicker, url } = tradingPairs[pairID];
  const status = useSelector((state) => state.ui.market.status[pairID]);
  const Logo = logoComponent[exchange];

  return (
    <a href={url}>
      <div>
        <Logo className="mr1 v-align" />
        <PairSymbol>
          {baseTicker}/{quoteTicker}
        </PairSymbol>
        <StatusIndicator status={status} exchange={exchange} />
      </div>
    </a>
  );
}
