import { combineReducers } from 'redux';

import initialized from './initialized';
import theme from './theme';
import coreInfo from './coreInfo';
import ui from './ui';

export default function createReducer() {
  return combineReducers({
    initialized,
    theme,
    coreInfo,
    ui,
  });
}
