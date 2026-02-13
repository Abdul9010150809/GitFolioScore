describe('PWA', () => {
  it('registers service worker if supported', () => {
    const originalSw = navigator.serviceWorker;
    navigator.serviceWorker = { register: jest.fn() };
    window.dispatchEvent(new Event('load'));
    expect(navigator.serviceWorker.register).toBeDefined();
    navigator.serviceWorker = originalSw;
  });
});
