// https://github.com/que-etc/resize-observer-polyfill/issues/50#issuecomment-488064120

/* eslint-disable class-methods-use-this */
class ResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }
}
/* eslint-enable class-methods-use-this */

window.ResizeObserver = ResizeObserver;

export default ResizeObserver;
