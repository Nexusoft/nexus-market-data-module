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

function SummaryValue({ summary, prop, percentage }) {
  if (!summary) {
    return <Value>N/A</Value>;
  }

  const value = summary?.[prop];
  if (value === null || value === undefined) {
    return <Value>N/A</Value>;
  }

  return <Value>{value + (percentage ? '%' : '')}</Value>;
}

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
          <SummaryValue summary={summary} prop="lastPrice" />
        </div>
        <div>
          <Label>High</Label>
          <SummaryValue summary={summary} prop="high" />
        </div>
        <div>
          <Label>Volume ({baseTicker})</Label>
          <SummaryValue summary={summary} prop="volume" />
        </div>
      </Line>
      <Line>
        <div>
          <Label>Change</Label>
          <SummaryValue summary={summary} prop="change" percentage />
        </div>
        <div>
          <Label>Low</Label>
          <SummaryValue summary={summary} prop="low" />
        </div>
        <div>
          <Label>Volume ({quoteTicker})</Label>
          <SummaryValue summary={summary} prop="quoteVolume" />
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
