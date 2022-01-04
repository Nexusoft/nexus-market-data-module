// react-redux library requires react-dom as a peer dependency, so we re-export
// react-dom from here and set an alias in webpack config so react-redux can find it
const {
  libraries: { ReactDOM },
} = NEXUS;

const {
  createPortal,
  findDOMNode,
  flushSync,
  hydrate,
  render,
  unmountComponentAtNode,
  unstable_batchedUpdates,
  unstable_createPortal,
  unstable_renderSubtreeIntoContainer,
  version,
} = ReactDOM;

export {
  createPortal,
  findDOMNode,
  flushSync,
  hydrate,
  render,
  unmountComponentAtNode,
  unstable_batchedUpdates,
  unstable_createPortal,
  unstable_renderSubtreeIntoContainer,
  version,
};

export default ReactDOM.default;
