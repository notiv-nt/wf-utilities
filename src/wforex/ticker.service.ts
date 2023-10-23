import { log } from '../shared/log';
import { errorOrderSound } from '../shared/sound';

const activeTickerRow = `.market-watch > table > tbody > tr.active[title]`;

export function currentTicker() {
  return (document.querySelector(activeTickerRow)?.getAttribute('title') || '').replace('#', '').toUpperCase();
}

export function currentTickerAskBid() {
  const row = document.querySelector(activeTickerRow);
  if (!row) {
    errorOrderSound();
    throw new Error('Cannot find active ticker info');
  }

  const prices = [...row.querySelectorAll('.value.price')].map((i) => parseFloat(i.innerText));

  return {
    bid: prices[0],
    ask: prices[1],
  };
}

export function setTicker(ticker: string) {
  log(`set ticker ${ticker}`);

  const selectors = [
    `.market-watch > table > tbody > tr[title="${ticker}"]`,
    `.market-watch > table > tbody > tr[title="#${ticker}"]`,
  ];

  for (const selector of selectors) {
    const element = document.querySelector<any>(selector);
    if (element) {
      element.click();
      return;
    }
  }
}
