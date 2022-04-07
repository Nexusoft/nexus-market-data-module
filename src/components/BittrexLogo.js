import { useSelector } from 'react-redux';

import ExchangeImg from 'components/ExchangeImg';
import StatusIndicator from 'components/StatusIndicator';

export default function BittrexLogo() {
  const status = useSelector((state) => state.ui.market.status.bittrex);
  return (
    <div>
      <a
        href="https://bittrex.com/Market/Index?MarketName=BTC-NXS"
        class="v-align mr0_4"
      >
        <ExchangeImg src="icons/BittrexLogo.png" />
      </a>
      <StatusIndicator status={status} active={status === 'ONLINE'} />
    </div>
  );
}
