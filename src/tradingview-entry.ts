import { loop } from './shared/loop';
import { sendMessage } from './shared/messages';
import { getCrosshairPrice, initCrosshair } from './tradingview/crosshair';
import { currentTicker, tickerEvents, watchTicker } from './tradingview/ticker.service';

window.addEventListener('load', () => {
  loop.start();

  initCrosshair();
  tickerEvents();

  watchTicker(() => {
    sendMessage('ticker', currentTicker());
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD' && e.ctrlKey) {
      sendMessage('order', { price: getCrosshairPrice(), ticker: currentTicker() });
    }
  });
});
