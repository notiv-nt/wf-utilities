import { config } from '../config';
import { frame, roundPrice, waitFor } from '../shared/lib';
import { log } from '../shared/log';
import { calculatePositionSize } from '../shared/math';
import { getOrders } from './lib/orders';
import { currentTicker, currentTickerAskBid, setTicker } from './ticker.service';
import { clickOnOpenOrder, getStatusMessage, setComment, setStopLoss, setVolume } from './ui.service';

export async function createOrder(data: { price: number; ticker: string }) {
  if (currentTicker() !== data.ticker) {
    log(`Wrong ticker, changing to ${data.ticker}`);
    setTicker(data.ticker);
    await frame();
  }

  if (currentTicker() !== data.ticker) {
    throw new Error('Cannot change ticker');
  }

  const { ask, bid, precision } = currentTickerAskBid();

  if (data.price >= bid && data.price <= ask) {
    throw new Error('Too close!');
  }

  const side: 'BUY' | 'SELL' = data.price < bid ? 'BUY' : 'SELL';
  const openPrice = side === 'BUY' ? ask : bid;

  const accurateVolume = calculatePositionSize({
    openPrice,
    closePrice: data.price,
    leverage: config.leverage,
    maxLoss: config.maxLoss,
  });

  const openVolume = Math.max(0.01, accurateVolume);
  let minSl = side === 'BUY' ? bid - 0.21 : ask + 0.21;

  if (side === 'BUY' && minSl > data.price) {
    minSl = data.price;
  } else if (side === 'SELL' && minSl < data.price) {
    minSl = data.price;
  }

  setVolume(openVolume);
  setStopLoss(minSl);
  setComment(`SL=${roundPrice(data.price, precision)}`);

  await frame();

  clickOnOpenOrder(side);

  const statusMessage = await waitFor(getStatusMessage, 3000);

  if (statusMessage !== 'done') {
    throw new Error(statusMessage);
  }

  log(`Open: ${side}, Price: ${openPrice}, S/L: ${roundPrice(data.price, precision)}, Volume: ${openVolume}`);
}

export function closeOrderByTicker(ticker: string) {
  const orders = getOrders();

  orders.forEach((order) => {
    if (order.symbol === ticker) {
      order.orderElement?.setAttribute('data-manual-closed', 'true');
    }
  });
}
