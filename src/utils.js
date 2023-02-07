import { useSelector } from 'react-redux';
import { color } from 'nexus-module';

export function useDark() {
  const theme = useSelector((state) => state.nexus?.theme);
  if (!theme) return true; // default

  const dark =
    color.luminosity(theme.foreground) > color.luminosity(theme.background);
  return dark;
}
