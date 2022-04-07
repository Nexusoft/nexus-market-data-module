import { combineReducers } from 'redux';

import status from './status';
import summary from './summary';
import candlestick from './candlestick';
import orderBook from './orderBook';

export default combineReducers({
  status,
  summary,
  candlestick,
  orderBook,
});
