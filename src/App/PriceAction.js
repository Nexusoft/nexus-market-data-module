import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import TradingPair from 'components/TradingPair';
import CandlestickChart from 'components/CandlestickChart';
import { tradingPairIDs } from 'constants';
import { refreshCandlesticks, stopCandlestickTimer } from 'actions/market';

export default function PriceAction() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshCandlesticks());
    return stopCandlestickTimer;
  }, []);

  return (
    <div>
      {tradingPairIDs.map((pairID) => (
        <div key={pairID} className="mt2">
          <div>
            <TradingPair pairID={pairID} />
          </div>
          <div className="mt1">
            <CandlestickChart pairID={pairID} />
          </div>
        </div>
      ))}
    </div>
  );
}
