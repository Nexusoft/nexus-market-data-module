import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BinanceLogo from 'components/BinanceLogo';
import BittrexLogo from 'components/BittrexLogo';
import { binance24hrInfo } from 'actions/market';

const Exchange = styled.div({
  paddingTop: '2em',
  paddingBottom: '2em',
});

const Line = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  columnGap: 20,
});

const Label = styled.div((theme) => ({
  color: theme.primary,
  fontWeight: 'bold',
}));

const Value = styled.div({
  fontSize: 24,
});

function ExchangeSummary({ data, logo }) {
  return (
    <Exchange>
      <div className="mb1">{logo}</div>
      <Line>
        <div>
          <Label>Last price</Label>
          <Value>{data ? data.lastPrice : 'N/A'}</Value>
        </div>
        <div>
          <Label>High</Label>
          <Value>{data ? data.high : 'N/A'}</Value>
        </div>
        <div>
          <Label>Low</Label>
          <Value>{data ? data.low : 'N/A'}</Value>
        </div>
      </Line>
      <Line>
        <div>
          <Label>Change</Label>
          <Value>{data ? data.change + '%' : 'N/A'}</Value>
        </div>
        <div>
          <Label>Volume</Label>
          <Value>{data ? data.volume : 'N/A'}</Value>
        </div>
        <div>
          <Label>Volume (BTC)</Label>
          <Value>{data ? data.low : 'N/A'}</Value>
        </div>
      </Line>
    </Exchange>
  );
}

export default function Overview() {
  const summary = useSelector((state) => state.ui.market.summary);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(binance24hrInfo());
  }, []);

  return (
    <div>
      <ExchangeSummary logo={<BinanceLogo />} data={summary.binance} />
      <ExchangeSummary logo={<BittrexLogo />} data={summary.bittrex} />
    </div>
  );
}
