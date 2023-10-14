import { injectScript } from '../shared/lib';

let price = null;

export function getCrosshairPrice() {
  return price;
}

export function initCrosshair() {
  const scriptSrc = chrome.runtime.getURL('static/static.js');
  injectScript(scriptSrc, 'body');

  window.addEventListener('message', (e) => {
    if (e?.data?.type === 'wf__crosshair_price') {
      price = e.data.price;
    }
  });
}
