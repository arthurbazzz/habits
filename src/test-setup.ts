// Polyfills for running unit tests under jsdom (the default Vitest environment).
// Ionic components such as ion-menu and ion-split-pane query `window.matchMedia`,
// which jsdom does not implement.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Ionic's calendar uses browser observers and scrolling, absent in jsdom.
class TestObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): never[] { return []; }
}
Object.defineProperty(globalThis, 'IntersectionObserver', { value: TestObserver, configurable: true });
Object.defineProperty(globalThis, 'ResizeObserver', { value: TestObserver, configurable: true });
Element.prototype.scrollTo = () => undefined;
Element.prototype.scrollIntoView = () => undefined;
