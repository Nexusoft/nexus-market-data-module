import ExchangeImg from 'components/ExchangeImg';

export default function CoinstoreLogo(props) {
  return (
    <a href="https://www.coinstore.com/#/spot/NXSUSDT" {...props}>
      <ExchangeImg src="icons/coinstore-logo.png" />
    </a>
  );
}
