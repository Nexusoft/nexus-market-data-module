// import { shell } from 'electron';
import { Component } from 'react';
import { connect } from 'react-redux';

import {
  binanceDepthLoader,
  bittrexDepthLoader,
  binance24hrInfo,
  bittrex24hrInfo,
  binanceCandlestickLoader,
  bittrexCandlestickLoader,
  binanceWalletStatus,
  bittrexWalletStatus,
} from 'actions/market';

// Internal Local Dependencies
import MarketDepth from './Chart/MarketDepth';
import Candlestick from './Chart/Candlestick';

const {
  libraries: {
    emotion: { styled },
  },
  components: { GlobalStyles, Panel, Icon, Tooltip, Button },
  utilities: { showNotification },
} = NEXUS;

const ExchangeUnitContainer = styled.div({
  width: '100%',
});

const MarketInfoContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '1.5em 0',
  borderTop: '1px solid #333',
});

const ExchangeLogo = styled.img({
  height: 60,
});

const OneDay = styled.div({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
});

const StatusIcon = styled.div(
  {
    height: '14px',
    width: '14px',
    borderRadius: '50%',
    display: 'inline-block',
    marginBottom: '18px',
  },
  ({ status }) => {
    switch (status) {
      case 'Green':
        return {
          backgroundColor: 'limegreen',
        };
      case 'Yellow':
        return {
          backgroundColor: 'yellow',
        };
      case 'Red':
        return {
          backgroundColor: 'red',
        };

      default:
        return {
          backgroundColor: 'gray',
        };
    }
  }
);

class Main extends Component {
  componentDidMount() {
    this.refresher();
  }

  /**
   * Refreshes the data from the markets
   *
   * @memberof Market
   */
  refresher = () => {
    this.props.binanceDepthLoader();
    this.props.bittrexDepthLoader();

    this.props.binanceCandlestickLoader();
    this.props.bittrexCandlestickLoader();

    this.props.binance24hrInfo();
    this.props.bittrex24hrInfo();

    // binance getAllAsset seems to be deprecated
    // this.props.binanceWalletStatus();
    this.props.bittrexWalletStatus();
  };

  /**
   * Formats the buy data and returns it
   *
   * @memberof Market
   */
  formatBuyData = (array) => {
    let newQuantity = 0;
    let prevQuantity = 0;
    let finnishedArray = array
      .map((e) => {
        newQuantity = prevQuantity + e.Volume;
        prevQuantity = newQuantity;

        if (e.Price < array[0].Price * 0.05) {
          return {
            x: 0,
            y: newQuantity,
          };
        } else {
          return {
            x: e.Price,
            y: newQuantity,
            label: `Price: ${e.Price} \n Volume: ${newQuantity}`,
          };
        }
      })
      .filter((e) => e.x > 0);

    return finnishedArray;
  };

  /**
   * Formats the sell data and returns it
   *
   * @param {*} array
   * @returns
   * @memberof Market
   */
  formatSellData(array) {
    let newQuantity = 0;
    let prevQuantity = 0;
    let finnishedArray = array
      .sort((a, b) => b.Rate - a.Rate)
      .map((e) => {
        newQuantity = prevQuantity + e.Volume;
        prevQuantity = newQuantity;
        if (e.Price < array[0].Price * 0.05) {
          return {
            x: 0,
            y: newQuantity,
          };
        } else {
          return {
            x: e.Price,
            y: newQuantity,
            label: `Price: ${e.Price} \n Volume: ${newQuantity}`,
          };
        }
      })
      .filter((e) => e.x > 0);

    return finnishedArray;
  }

  /**
   * Formats the Exchange Data
   *
   * @param {*} exchange
   * @returns
   * @memberof Market
   */
  formatChartData(exchange) {
    switch (exchange) {
      case 'binanceBuy':
        return this.formatBuyData(this.props.binance.buy);
      case 'binanceSell':
        return this.formatBuyData(this.props.binance.sell);
      case 'bittrexBuy':
        return this.formatBuyData(this.props.bittrex.buy);
      case 'bittrexSell':
        return this.formatBuyData(this.props.bittrex.sell);
      default:
        return [];
    }
  }

  /**
   * Returns a Div of various market data from the Exchange Name
   *
   * @param {*} exchangeName
   * @returns
   * @memberof Market
   */
  oneDayinfo(exchangeName) {
    return (
      <>
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
          }}
        >
          <b>24hr Change</b>
        </div>
        <OneDay>
          <div>
            <b>High: </b>
            {this.props[exchangeName].info24hr.high}
            {' BTC '}
          </div>
          <div>
            <b>Price Change: </b>
            {this.props[exchangeName].info24hr.change}
            {' %'}
          </div>
          <div>
            <b>Low: </b> {this.props[exchangeName].info24hr.low}
            {' BTC '}
          </div>
          <div>
            <b>Volume: </b>
            {this.props[exchangeName].info24hr.volume}
            {' NXS '}
          </div>
        </OneDay>
      </>
    );
  }
  /**
   * Refreshes the market data and shows a notification
   *
   * @memberof Market
   */
  refreshMarket() {
    this.refresher();
    showNotification({ content: 'Refreshing market data...', type: 'success' });
  }

  returnWalletStatusTooltip(status) {
    switch (status) {
      case 'Green':
        return 'Wallet Active';
      case 'Yellow':
        return 'Wallet Partially Active';
      case 'Red':
        return 'Wallet Under Maintenance';

      default:
        return 'Wallet Status Unknown';
    }
  }

  // Mandatory React method
  /**
   * Component's Renderable JSX
   *
   * @returns
   * @memberof Market
   */
  render() {
    const { loaded, binance, bittrex } = this.props;
    return (
      <>
        <GlobalStyles />
        <Panel
          controls={
            <Tooltip.Trigger tooltip="Refresh">
              <Button square skin="plain" onClick={() => this.refreshMarket()}>
                <Icon icon={{ url: 'icons/syncing.svg', id: 'icon' }} />
              </Button>
            </Tooltip.Trigger>
          }
          icon={{ url: 'icons/chart.svg', id: 'icon' }}
          title={'Market Data'}
        >
          {loaded && binance.buy[0] && (
            <ExchangeUnitContainer>
              <ExchangeLogo
                src="icons/BINANCE.png"
                onClick={() => {
                  // shell.openExternal(
                  //   'https://www.binance.com/en/trade/NXS_BTC'
                  // );
                }}
              />
              {/* <Tooltip.Trigger
                tooltip={this.returnWalletStatusTooltip(binance.walletStatus)}
              >
                <StatusIcon status={binance.walletStatus} />
              </Tooltip.Trigger> */}

              {this.oneDayinfo('binance')}
              <MarketInfoContainer>
                <MarketDepth
                  chartData={this.formatChartData('binanceBuy')}
                  chartSellData={this.formatChartData('binanceSell')}
                />
                {binance.candlesticks[0] !== undefined ? (
                  <Candlestick data={binance.candlesticks} />
                ) : null}
              </MarketInfoContainer>
            </ExchangeUnitContainer>
          )}
          {loaded && bittrex.buy[0] && (
            <ExchangeUnitContainer>
              <ExchangeLogo
                src="icons/BittrexLogo.png"
                onClick={() => {
                  // shell.openExternal(
                  //   'https://bittrex.com/Market/Index?MarketName=BTC-NXS'
                  // );
                }}
              />
              <Tooltip.Trigger
                tooltip={this.returnWalletStatusTooltip(bittrex.walletStatus)}
              >
                <StatusIcon status={bittrex.walletStatus} />
              </Tooltip.Trigger>

              {this.oneDayinfo('bittrex')}
              <MarketInfoContainer>
                <br />
                <MarketDepth
                  chartData={this.formatChartData('bittrexBuy')}
                  chartSellData={this.formatChartData('bittrexSell')}
                />
                {bittrex.candlesticks[0] !== undefined ? (
                  <Candlestick data={bittrex.candlesticks} />
                ) : null}
              </MarketInfoContainer>
            </ExchangeUnitContainer>
          )}
        </Panel>
      </>
    );
  }
}

const mapStateToProps = ({
  ui: {
    market: { loaded, binance, bittrex },
  },
}) => ({
  loaded,
  binance,
  bittrex,
});

const actions = {
  binanceDepthLoader,
  bittrexDepthLoader,
  binance24hrInfo,
  bittrex24hrInfo,
  binanceCandlestickLoader,
  bittrexCandlestickLoader,
  binanceWalletStatus,
  bittrexWalletStatus,
};

export default connect(mapStateToProps, actions)(Main);
