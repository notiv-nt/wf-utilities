import { config } from '../config';
import { log } from '../shared/log';
import { loop } from '../shared/loop';
import { onOrderClose } from './event.service';
import { getOrders } from './lib/orders';

function onTick() {
  getOrders().forEach((order) => {
    if (order.profit <= config.maxLoss * -1) {
      if (order.close()) {
        onOrderClose(order);
      }
    }
  });
}

export function startLossProtection() {
  log('Start loss protection');
  loop.on('tick', onTick);
}

export function stopLossProtection() {
  log('Stop loss protection');
  loop.off('tick', onTick);
}
