import { config } from '../config';
import { isNumber } from '../shared/lib';
import { log } from '../shared/log';
import { loop } from '../shared/loop';

type Order = {
  symbol: string;
  amount: number;
  order: HTMLDivElement;
  closeElement: HTMLButtonElement;
  close(): void;
};

function getHeaderColumns() {
  const headerRow = document.querySelector('.bot-panel .table .tbody .tr:first-child');

  const columns = {
    symbol: -1,
    profit: -1,
  };

  [...(headerRow?.children || [])].forEach((column, index) => {
    const columnTitle = column.getAttribute('title')?.toLowerCase() || '';

    if (columnTitle in columns) {
      columns[columnTitle] = index;
    }
  });

  if (columns.profit === -1 || columns.symbol === -1) {
    return null;
  }

  return columns;
}

function getOrders() {
  const columns = getHeaderColumns();
  if (!columns) {
    return;
  }

  const orders = document.querySelectorAll<HTMLDivElement>('.bot-panel .table .tbody > div[data-id]');

  if (!orders.length) {
    return null;
  }

  const data: Order[] = [];

  orders.forEach((order) => {
    const children = [...order.children] as HTMLDivElement[];
    const closeElement = order.querySelector('.td button.close[title*="Close"]') as HTMLButtonElement;

    const item: Order = {
      symbol: children[columns.symbol].innerText,
      amount: Math.abs(parseFloat(children[columns.profit].innerText)),
      order,
      closeElement,
      close() {
        // if (order.hasAttribute('data-wf-closing')) {
        //   return;
        // }
        // order.setAttribute('data-wf-closing', 'true');
        // TODO: throttle ?
        closeElement.click();
      },
    };

    data.push(item);
  });

  return data;
}

function onTick() {
  const orders = getOrders();
  if (!orders?.length) {
    return;
  }

  orders.forEach((order) => {
    if (!isNumber(order.amount)) {
      return;
    }

    if (order.amount >= config.maxLoss) {
      log(`Closing: ${order.symbol}, loss: ${order.amount}`);
      order.close();
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
