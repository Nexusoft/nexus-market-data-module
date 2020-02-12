import * as TYPE from './types';

export const initialize = data => ({
  type: TYPE.INITIALIZE,
  payload: data,
});

export const updateCoreInfo = coreInfo => ({
  type: TYPE.UPDATE_CORE_INFO,
  payload: coreInfo,
});

export const updateTheme = theme => ({
  type: TYPE.UPDATE_THEME,
  payload: theme,
});
