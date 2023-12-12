import { sendMessage } from '../shared/messages';
import type { Order } from '../wforex/lib/orders';
import { currentTicker } from './ticker.service';

const root = document.createElement('div');
root.setAttribute(
  'style',
  `
  position: fixed;
  display: flex;
  align-items: center;
  gap: 10px;
  top: 2px;
  left: 1040px;
  width: 200px;
  padding: 5px;
  height: 34px;
  z-index: 9999;
  border-radius: 4px;
  background: #f3f3f3;
  line-height: 1;
  box-sizing: border-box;
`,
);

document.body.appendChild(root);

let orders: Order[] = [];

export function setOrders(data: Order[]) {
  root.innerHTML = '';
  root.style.opacity = '0';
  orders = data || [];

  if (!orders.length) {
    return;
  }

  const ticker = currentTicker();

  const ordersWithSameTicker = orders.filter((o) => {
    // TODO: FB <-> META
    return o.symbol.toUpperCase() === ticker.toUpperCase();
  });

  if (!ordersWithSameTicker.length) {
    return;
  }

  root.style.opacity = '1';

  profitElement(ordersWithSameTicker.reduce((acc, o) => acc + o.profit, 0));
  positionSide(ordersWithSameTicker[0].type);
  closeButton(ticker);
}

function profitElement(totalProfit: number) {
  const profitEl = document.createElement('div');
  const sign = totalProfit < 0 ? '' : totalProfit > 0 ? '+' : '';
  const profitFormatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalProfit);

  profitEl.innerHTML = `${sign}${profitFormatted}$`;
  if (totalProfit > 0) {
    profitEl.style.color = '#0b71f3';
  } else if (totalProfit < 0) {
    profitEl.style.color = '#E0484C';
  } else {
    profitEl.style.color = '#777';
  }

  root.appendChild(profitEl);
}

function positionSide(ticker: string) {
  const el = document.createElement('div');
  el.innerHTML = ticker;
  root.appendChild(el);
}

function closeButton(ticker: string) {
  const closeEl = document.createElement('button');
  closeEl.type = 'button';
  closeEl.setAttribute(
    'style',
    `display: block;
    padding: 5px 7px;
    border: 0;
    background: #f45959;
    color: #fff;
    border-radius: 4px;
    line-height: 1;
    box-sizing: border-box;
    margin-left: auto;
    cursor: pointer;
    `,
  );
  closeEl.innerHTML = 'Close';
  closeEl.addEventListener('click', () => sendMessage('close-by-ticker', ticker));
  root.appendChild(closeEl);
}
