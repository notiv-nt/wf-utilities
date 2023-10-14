import { loop } from '../shared/loop';
import { sendMessage } from '../shared/messages';

export function currentTicker() {
  return document.querySelector<HTMLDivElement>('#header-toolbar-symbol-search .js-button-text')?.innerText || '';
}

let lastTicker = '';

export function watchTicker(cb: () => void) {
  loop.on('tick10', () => {
    let current = currentTicker();

    if (current && lastTicker !== current) {
      cb();
      lastTicker = current;
    }
  });
}

export function tickerEvents() {
  window.addEventListener('focus', () => {
    sendMessage('ticker', currentTicker());
  });

  window.addEventListener('load', () => {
    sendMessage('ticker', currentTicker());
  });
}
