import { getConfig } from './config';
import { log } from './shared/log';
import { loop } from './shared/loop';
import { onMessage } from './shared/messages';
import { errorOrderSound, successOrderSound } from './shared/sound';
import { startLossProtection } from './wforex/loss-protector';
import { closeOrderByTicker, createOrder } from './wforex/order.service';
import { setTicker } from './wforex/ticker.service';
import {
  autoOpenTradesSection,
  closeStatusMessage,
  keepOrderPanelOpen,
  keyboardShortcuts,
  waitForAppReady,
} from './wforex/ui.service';

async function main() {
  await getConfig();

  loop.start();

  keepOrderPanelOpen();
  autoOpenTradesSection();

  //
  await waitForAppReady();
  // -

  log('App is ready');

  keyboardShortcuts();

  startLossProtection();

  onMessage('ticker', setTicker);
  onMessage('order', async (msg) => {
    createOrder(msg)
      .then(() => {
        successOrderSound();
      })
      .catch((e) => {
        errorOrderSound();
        log(e.message);
      })
      .finally(() => {
        closeStatusMessage();
      });
  });

  onMessage('close-by-ticker', closeOrderByTicker);
}

main().catch(console.error);
