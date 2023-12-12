import { log } from './shared/log';
import { loop } from './shared/loop';
import { onMessage, sendMessage } from './shared/messages';
import { getCrosshairPrice, initCrosshair } from './tradingview/crosshair';
import { setOrders } from './tradingview/orders.service';
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
      log('Send order', getCrosshairPrice(), currentTicker());
      sendMessage('order', { price: getCrosshairPrice(), ticker: currentTicker() });
    }
  });

  onMessage('orders', (orders) => setOrders(orders));
});
