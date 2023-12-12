import { normalizeTicker } from '../../shared/lib';
import { cannotCloseOrder } from '../event.service';

export type Order = {
  symbol: string;
  ticket: number;
  time: string;
  type: 'SELL' | 'BUY';
  volume: number;
  open_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  close_price: number | null;
  swap: number | null;
  profit: number;
  comment: string;

  orderElement?: HTMLDivElement;

  close(): boolean;
};

function getHeaderColumns() {
  const headerRow = document.querySelector('.bot-panel .table .tbody .tr:first-child');
  const columns: Record<string, number> = {};

  [...(headerRow?.children || [])].forEach((column, index) => {
    const columnTitle = (column.getAttribute('title') || '').toLowerCase().replaceAll(' ', '_');

    if (columnTitle) {
      columns[columnTitle] = index;
    }
  });

  return columns;
}

export function getOrders() {
  const columns = getHeaderColumns();
  const ordersElements = document.querySelectorAll<HTMLDivElement>('.bot-panel .table .tbody > div[data-id]');

  if (!Object.keys(columns).length || !ordersElements.length) {
    return [];
  }

  const data: Order[] = [];

  ordersElements.forEach((order) => {
    const children = [...order.children] as HTMLDivElement[];
    const closeElement = order.querySelector('.td button.close[title*="Close"]') as HTMLButtonElement;

    const item: Order = {} as Order;

    Object.entries(columns).forEach(([column, index]) => {
      // @ts-ignore
      item[column] = normalizeColumnValue(column, children[index].innerText.trim());
    });

    item.orderElement = order;

    item.close = () => {
      const time = parseInt(order.getAttribute('data-wf-closing') || '', 10);

      if (Number.isNaN(time) || Date.now() - time >= 300) {
        closeElement.click();

        order.setAttribute('data-wf-closing', `${Date.now()}`);

        const attempt = order.hasAttribute('data-wf-closing-attempt')
          ? parseInt(order.getAttribute('data-wf-closing-attempt') || '', 10)
          : 1;

        order.setAttribute('data-wf-closing-attempt', `${attempt + 1}`);

        if (attempt > 5) {
          cannotCloseOrder(item);
          return false;
        }

        return true;
      }

      return false;
    };

    data.push(item);
  });

  return data;
}

function normalizeColumnValue(column: string, value: string) {
  if (column === 'symbol') {
    return normalizeTicker(value);
  }

  if (column === 'time') {
    const date = new Date(`${new Date().getFullYear()}.${value}`);
    date.setHours(date.getHours() + 1);
    return date.toISOString();
  }

  if (column === 'type') {
    return value.toUpperCase();
  }

  if (
    ['ticket', 'volume', 'open_price', 'stop_loss', 'take_profit', 'close_price', 'swap', 'profit'].includes(column)
  ) {
    return value === '' ? null : parseFloat(value);
  }

  return value;
}
