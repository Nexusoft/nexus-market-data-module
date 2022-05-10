import TradingPair from 'components/TradingPair';
import DepthChart from 'components/DepthChart';
import { tradingPairIDs } from 'constants';

export default function OrderBook() {
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
