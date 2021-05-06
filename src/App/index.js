import Main from './Main';

const {
  libraries: {
    React,
    ReactRedux: { connect },
    emotion: {
      createCache,
      core: { CacheProvider },
    },
  },
  components: { ThemeController },
} = NEXUS;

const emotionCache = createCache({ container: document.head });

@connect((state) => ({
  initialized: state.initialized,
  theme: state.theme,
}))
class App extends React.Component {
  render() {
    const { initialized, theme } = this.props;
    if (!initialized) return null;

    return (
      <CacheProvider value={emotionCache}>
        <ThemeController theme={theme}>
          <Main />
        </ThemeController>
      </CacheProvider>
    );
  }
}

export default App;
