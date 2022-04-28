import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';

import TradingPair from 'components/TradingPair';
import { tradingPairIDs, tradingPairs } from 'constants';
import { refreshOrderBook } from 'actions/market';

const OrderBookWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '2em',
});

const OrderList = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const Cell = styled.div({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  padding: '.2em 0',
  textAlign: 'right',
});

const HeaderCell = styled(Cell)(({ align = 'left' }) => ({
  opacity: 0.67,
  textAlign: align,
}));

function PairOrderBook({ pairID }) {
  const { baseTicker, quoteTicker } = tradingPairs[pairID];
  const orderBook = useSelector((state) => state.ui.market.orderBook[pairID]);
  const { asks, bids } = orderBook || {};

  const dispatch = useDispatch();
  useEffect(() => {
    // TODO: Batch
    dispatch(refreshOrderBook(pairID));
  }, []);

  return (
    !!orderBook && (
      <OrderBookWrapper>
        <OrderList>
          <div>
            <HeaderCell>Price</HeaderCell>
            {bids.map(({ price }, i) => (
              <Cell key={i}>{price}</Cell>
            ))}
          </div>
          <div>
            <HeaderCell align="right">Quantity ({baseTicker})</HeaderCell>
            {bids.map(({ quantity }, i) => (
              <Cell key={i}>{quantity}</Cell>
            ))}
          </div>
        </OrderList>

        <OrderList>
          <div>
            <HeaderCell>Price</HeaderCell>
            {asks.map(({ price }, i) => (
              <Cell key={i}>{price}</Cell>
            ))}
          </div>
          <div>
            <HeaderCell align="right">Quantity ({baseTicker})</HeaderCell>
            {asks.map(({ quantity }, i) => (
              <Cell key={i}>{quantity}</Cell>
            ))}
          </div>
        </OrderList>
      </OrderBookWrapper>
    )
  );
}

export default function OrderBook() {
  return (
    <div>
      {tradingPairIDs.map((pairID) => (
        <div key={pairID} className="mt2">
          <div>
            <TradingPair pairID={pairID} />
          </div>
          <div className="mt1">
            <PairOrderBook pairID={pairID} />
          </div>
        </div>
      ))}
    </div>
  );
}
