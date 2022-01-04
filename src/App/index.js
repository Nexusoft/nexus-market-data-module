import { useSelector } from 'react-redux';

import Main from './Main';

const {
  libraries: {
    emotion: {
      createCache,
      core: { CacheProvider },
    },
  },
  components: { ThemeController },
} = NEXUS;

const emotionCache = createCache({ container: document.head, key: 'emo' });

export default function App() {
  const initialized = useSelector((state) => state.initialized);
  const theme = useSelector((state) => state.theme);
  if (!initialized) return null;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeController theme={theme}>
        <Main />
      </ThemeController>
    </CacheProvider>
  );
}
