import { loop } from './shared/loop';
import { onMessage } from './shared/messages';
import { startLossProtection } from './wforex/loss-protector';
import { autoCloseTradeSuccessMessage, keepOrderPanelOpen } from './wforex/order-panel.service';
import { createOrder } from './wforex/order.service';
import { setTicker } from './wforex/ticker.service';

window.addEventListener('load', () => {
  loop.start();

  startLossProtection();
  keepOrderPanelOpen();
  autoCloseTradeSuccessMessage();

  onMessage('ticker', setTicker);
  onMessage('order', createOrder);
});