import TradingPair from 'components/TradingPair';
import CandlestickChart from 'components/CandlestickChart';
import { tradingPairIDs } from 'constants';

export default function PriceAction() {
  return (
    <div>
      {tradingPairIDs.map((pairID) => (
        <div key={pairID}>
          <div>
            <TradingPair pairID={pairID} />
          </div>
          <div>
            <CandlestickChart pairID={pairID} />
          </div>
        </div>
      ))}
    </div>
  );
}
