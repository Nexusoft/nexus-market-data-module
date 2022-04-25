import TradingPair from 'components/TradingPair';
import CandlestickChart from 'components/CandlestickChart';
import { tradingPairIDs } from 'constants';

export default function PriceAction() {
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
