export default getPersistedState => store => next => action => {
  const oldData = getPersistedState(store.getState());
  const result = next(action);
  const data = getPersistedState(store.getState());
  if (data !== oldData) {
    nexusWallet.sendMessage('update-state', data);
  }
  return result;
};
