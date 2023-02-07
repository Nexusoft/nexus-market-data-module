import ExchangeImg from 'components/ExchangeImg';
import { useDark } from 'utils';

export default function BittrexLogo(props) {
  const dark = useDark();

  return (
    <a href="https://bittrex.com/Market/Index?MarketName=BTC-NXS" {...props}>
      <ExchangeImg
        src={dark ? 'icons/BittrexLogo.png' : 'icons/BittrexLogo-light.png'}
        style={{
          height: 40,
        }}
      />
    </a>
  );
}
