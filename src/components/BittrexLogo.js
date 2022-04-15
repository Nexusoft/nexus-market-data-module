import ExchangeImg from 'components/ExchangeImg';

export default function BittrexLogo(props) {
  return (
    <a href="https://bittrex.com/Market/Index?MarketName=BTC-NXS" {...props}>
      <ExchangeImg src="icons/BittrexLogo.png" />
    </a>
  );
}
