import ExchangeImg from 'components/ExchangeImg';
import { useDark } from 'utils';

export default function CoinstoreLogo(props) {
  const dark = useDark();

  return (
    <a href="https://www.coinstore.com/#/spot/NXSUSDT" {...props}>
      <ExchangeImg
        src={
          dark ? 'icons/coinstore-logo.png' : 'icons/coinstore-logo-light.png'
        }
      />
    </a>
  );
}
