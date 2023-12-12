import { config } from '../config';
import { log } from '../shared/log';
import { loop } from '../shared/loop';
import { sendMessage } from '../shared/messages';
import { onOrderClose } from './event.service';
import { getOrders } from './lib/orders';

import { throttle } from 'lodash-es';

const sendOrders = throttle((data) => {
  sendMessage('orders', data);
}, 250);

function onTick() {
  const orders = getOrders();

  sendOrders(orders);

  orders.forEach((order) => {
    if (order.profit <= config.maxLoss * -1) {
      if (order.close()) {
        onOrderClose(order);
      }
    }
  });
}

function onTick20() {
  getOrders().forEach((order) => {
    if (order.orderElement?.hasAttribute('data-manual-closed')) {
      if (order.close()) {
        onOrderClose(order);
      }
    }
  });
}

export function startLossProtection() {
  log('Start loss protection');
  loop.on('tick', onTick);
  loop.on('tick20', onTick20);
}

export function stopLossProtection() {
  log('Stop loss protection');
  loop.off('tick', onTick);
  loop.off('tick20', onTick20);
}
