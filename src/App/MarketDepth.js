import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import TradingPair from 'components/TradingPair';
import DepthChart from 'components/DepthChart';
import { tradingPairIDs } from 'constants';
import { refreshOrderBooks, stopOrderBookTimer } from 'actions/market';

export default function MarketDepth() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshOrderBooks());
    return stopOrderBookTimer;
  }, []);

  return (
    <div>
      {tradingPairIDs.map((pairID) => (
        <div key={pairID} className="mt2">
          <div>
            <TradingPair pairID={pairID} />
          </div>
          <div className="mt1">
            <DepthChart pairID={pairID} />
          </div>
        </div>
      ))}
    </div>
  );
}
