import { combineReducers } from 'redux';

import market from './market';
import activeTab from './activeTab';

export default combineReducers({
  market,
  activeTab,
});
