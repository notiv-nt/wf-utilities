import type { Order } from './lib/orders';
import { log } from '../shared/log';

export function onOrderClose(order: Order) {
  log(`Closing: ${order.symbol}, loss: ${order.profit}`);
}

export function cannotCloseOrder(order: Order) {
  log(`Cannot close order: ${order.symbol}, loss: ${order.profit}`);
}
