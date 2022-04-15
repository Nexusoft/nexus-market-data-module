import { useSelector } from 'react-redux';

import ExchangeImg from 'components/ExchangeImg';
import StatusIndicator from 'components/StatusIndicator';

export default function BinanceLogo() {
  const status = useSelector((state) => state.ui.market.status.binance);
  return (
    <div>
      <a href="https://www.binance.com/en/trade/NXS_BTC" class="v-align mr0_4">
        <ExchangeImg src="icons/BINANCE.png" />
      </a>
      <StatusIndicator
        status={status}
        active={status && status === 'TRADING'}
      />
    </div>
  );
}
