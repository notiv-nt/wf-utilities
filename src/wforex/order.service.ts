import { config } from '../shared/config';
import { frame } from '../shared/lib';
import { log } from '../shared/log';
import { calculatePositionSize } from '../shared/math';
import { successOrderSound, errorOrderSound } from '../shared/sound';
import { currentTicker, currentTickerAskBid, setTicker } from './ticker.service';

export async function createOrder(data: { price: number; ticker: string }) {
  if (currentTicker() !== data.ticker) {
    log(`Wrong ticker, changing to ${data.ticker}`);
    setTicker(data.ticker);
    await frame();
  }

  const { ask, bid } = currentTickerAskBid();

  if (data.price >= bid && data.price <= ask) {
    errorOrderSound();
    throw new Error('Too close!');
  }

  let side: 'BUY' | 'SELL' = data.price < bid ? 'BUY' : 'SELL';
  let openPrice = data.price < bid ? ask : bid;

  const accurateVolume = calculatePositionSize({
    openPrice,
    closePrice: data.price,
    leverage: config.leverage,
    maxLoss: config.maxLoss,
  });

  let openVolume = Math.max(0.01, accurateVolume);

  setVolume(openVolume);

  await frame();

  log(`open order: ${side}, open: ${openPrice}, sl: ${Math.round(data.price * 100) / 100}, ${openVolume}`);

  openOrder(side);

  successOrderSound();
}

function openOrder(side: 'BUY' | 'SELL') {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.left-panel .content .footer-row .trade-button');

  for (const button of buttons) {
    const texts = { BUY: 'buy by', SELL: 'sell by' };
    const text = texts[side];

    if (button.innerText.toLowerCase().includes(text)) {
      button.click();
      return;
    }
  }

  errorOrderSound();
}

function setVolume(val: number) {
  let input = document.querySelector<HTMLInputElement>('.left-panel .volume label.input input');

  if (!input) {
    errorOrderSound();
    throw new Error('Volume input not found');
  }

  input.value = `${val}`;
  input.dispatchEvent(new Event('blur'));
}
