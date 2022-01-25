import { useSelector } from 'react-redux';
import styled from '@emotion/styled';

import {
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryPortal,
  VictoryLabel,
  VictoryTooltip,
} from 'victory';

const MarketDepthInner = styled.div({
  position: 'relative',
  flex: 1,
  minHeight: 300,
  maxWidth: '50%',
  marginLeft: 5,
});

export default function Candlestick({ data }) {
  const theme = useSelector((state) => state.nexus.theme);
  return (
    <MarketDepthInner>
      <VictoryChart
        domainPadding={{ x: 10 }}
        theme={{
          axis: {
            style: {
              axis: {
                fill: 'transparent',
                stroke: theme.foreground,
                strokeWidth: 1,
              },
              axisLabel: {
                stroke: 'transparent',
                fontweight: 'normal',
                fill: theme.foreground,
                padding: 35,
                fontSize: 14,
              },
              grid: {
                fill: 'none',
                stroke: 'none',
                pointerEvents: 'painted',
              },
              ticks: {
                fill: theme.foreground,
                size: 5,
                padding: 1,
                stroke: theme.foreground,
              },
              tickLabels: {
                fontSize: 10,
                padding: 2,
                fill: theme.foreground,
                stroke: 'transparent',
              },
            },
          },
        }}
      >
        <VictoryAxis
          label="Date"
          style={{ color: '#000', padding: 10 }}
          tickFormat={(t) =>
            `${new Date(t).toLocaleDateString('en', {
              month: 'short',
              day: 'numeric',
            })}`
          }
          tickLabelComponent={
            <VictoryPortal>
              <VictoryLabel />
            </VictoryPortal>
          }
        />

        <VictoryAxis
          label="Price"
          dependentAxis
          style={{ tickLabels: { angle: -60 }, axisLabel: { padding: 35 } }}
        />

        <VictoryCandlestick
          style={{ data: { stroke: theme.foreground } }}
          candleColors={{
            positive: 'rgba(38, 230, 0, 1)',
            negative: 'rgba(255, 15, 15, 1)',
          }}
          data={data}
          labelComponent={
            <VictoryTooltip
              orientation={(index) => {
                if (
                  [...data].findIndex((e) => {
                    if (e.x === index.x) {
                      return e;
                    }
                  }) >
                  [...data].length / 2
                ) {
                  return 'right';
                } else return 'left';
              }}
            />
          }
        />
      </VictoryChart>
    </MarketDepthInner>
  );
}
