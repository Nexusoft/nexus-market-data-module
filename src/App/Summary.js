import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TradingPair from 'components/TradingPair';
import { refresh24hrSummaries, stopSummaryTimer } from 'actions/market';
import { tradingPairs, tradingPairIDs } from 'constants';

const Exchange = styled.div({
  paddingTop: '2em',
  paddingBottom: '2em',
});

const Line = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  columnGap: 20,
  marginTop: '1em',
});

const Label = styled.div(({ theme }) => ({
  color: theme.primary,
  fontWeight: 'bold',
}));

const Value = styled.div({
  fontSize: 24,
});

function ExchangeSummary({ pairID }) {
  const summary = useSelector((state) => state.ui.market.summary?.[pairID]);
  const { baseTicker, quoteTicker } = tradingPairs[pairID];

  return (
    <Exchange>
      <div>
        <TradingPair pairID={pairID} />
      </div>
      <Line>
        <div>
          <Label>Last price</Label>
          <Value>{summary ? summary.lastPrice : 'N/A'}</Value>
        </div>
        <div>
          <Label>High</Label>
          <Value>{summary ? summary.high : 'N/A'}</Value>
        </div>
        <div>
          <Label>Volume ({baseTicker})</Label>
          <Value>{summary ? summary.volume : 'N/A'}</Value>
        </div>
      </Line>
      <Line>
        <div>
          <Label>Change</Label>
          <Value>
            {summary?.change !== null && summary?.change !== undefined
              ? summary.change + '%'
              : 'N/A'}
          </Value>
        </div>
        <div>
          <Label>Low</Label>
          <Value>{summary ? summary.low : 'N/A'}</Value>
        </div>
        <div>
          <Label>Volume ({quoteTicker})</Label>
          <Value>{summary ? summary.quoteVolume : 'N/A'}</Value>
        </div>
      </Line>
    </Exchange>
  );
}

export default function Summary() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refresh24hrSummaries());
    return stopSummaryTimer;
  }, []);

  return (
    <div>
      {tradingPairIDs.map((pairID) => (
        <ExchangeSummary key={pairID} pairID={pairID} />
      ))}
    </div>
  );
}
