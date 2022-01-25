import { useSelector } from 'react-redux';
import styled from '@emotion/styled';

import {
  VictoryArea,
  VictoryChart,
  VictoryTooltip,
  VictoryAxis,
  VictoryPortal,
  VictoryLabel,
  VictoryVoronoiContainer,
} from 'victory';

const MarketDepthInner = styled.div({
  position: 'relative',
  flex: 1,
  minHeight: 300,
  maxWidth: '50%',
  marginLeft: 5,
});

export default function MarketDepth({ chartData, chartSellData }) {
  const theme = useSelector((state) => state.theme);
  return (
    <MarketDepthInner>
      <VictoryChart
        theme={{
          axis: {
            style: {
              axis: {
                fill: 'transparent',
                stroke: theme.foreground,
                strokeWidth: 1,
              },
              axisLabel: {
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
                stroke: theme.foreground,
              },
              tickLabels: {
                padding: 1,
                fill: theme.foreground,
                fontSize: 10,
              },
            },
          },
        }}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          label="Volume"
          dependentAxis
          tickFormat={(tick) => {
            if (tick % 1000000 === 0) {
              return `${tick / 1000}M`;
            } else if (tick % 1000 === 0) {
              return `${tick / 1000}K`;
            } else {
              return tick;
            }
          }}
        />

        <VictoryArea
          style={{
            data: {
              fill: 'url(#green)',
            },
          }}
          labelComponent={
            <VictoryTooltip
              orientation={(index) => {
                if (
                  [...chartData].findIndex((e) => {
                    if (e.x === index.x) {
                      return e;
                    }
                  }) >
                  [...chartData].length / 2
                ) {
                  return 'right';
                } else return 'top';
              }}
            />
          }
          data={[...chartData]}
        />
        <VictoryArea
          style={{
            data: {
              fill: 'url(#red)',
            },
          }}
          labelComponent={
            <VictoryTooltip
              orientation={(index) => {
                if (
                  [...chartSellData].findIndex((e) => {
                    if (e.x === index.x) {
                      return e;
                    }
                  }) >
                  [...chartSellData].length / 2
                ) {
                  return 'left';
                } else return 'top';
              }}
            />
          }
          data={[...chartSellData]}
        />
        <VictoryAxis
          label="Price"
          independentAxis
          style={{ tickLabels: { angle: -15 } }}
          tickLabelComponent={
            <VictoryPortal>
              <VictoryLabel />
            </VictoryPortal>
          }
        />
      </VictoryChart>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="green" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(38, 230, 0, 0.9)" />
            <stop offset="100%" stopColor=" rgba(38, 230, 0, 0.2)" />
          </linearGradient>
        </defs>
      </svg>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 15, 15,0.9)" />
            <stop offset="100%" stopColor=" rgba(255, 15, 15,0.2)" />
          </linearGradient>
        </defs>
      </svg>
    </MarketDepthInner>
  );
}
