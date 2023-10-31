import { injectScript } from '../shared/lib';

let price: null | number = null;

export function getCrosshairPrice() {
  return price;
}

export function initCrosshair() {
  const scriptSrc = chrome.runtime.getURL('static/static.js');
  injectScript(scriptSrc, 'body');

  window.addEventListener('message', (e) => {
    if (e?.data?.type === 'wf__crosshair_price') {
      price = Math.round(e.data.price * 1000) / 1000;
    }
  });
}
