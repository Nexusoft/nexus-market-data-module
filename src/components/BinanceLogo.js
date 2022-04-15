import ExchangeImg from 'components/ExchangeImg';

export default function BinanceLogo(props) {
  return (
    <a href="https://www.binance.com/en/trade/NXS_BTC" {...props}>
      <ExchangeImg src="icons/BINANCE.png" />
    </a>
  );
}
