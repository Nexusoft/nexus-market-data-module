import { useSelector } from 'react-redux';
import { color } from 'nexus-module';

export function useDark() {
  const theme = useSelector((state) => state.nexus?.theme);
  if (!theme) return true; // default

  const dark =
    color.luminosity(theme.foreground) > color.luminosity(theme.background);
  return dark;
}

export function truncateDecimals(num, decimals = 2) {
  const split = num.split('.');
  return (
    split[0] +
    '.' +
    split[1].substring(
      0,
      decimals <= split[1].length ? decimals : split[1].length
    )
  );
}

export function escapeENotation(number, setFractionalDigits = 8 ) {
  return number.toLocaleString('fullwide', {
    useGrouping: false,
    minimumFractionDigits: setFractionalDigits,
    maximumFractionDigits: setFractionalDigits + 1,
  });
}
