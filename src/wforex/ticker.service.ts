import { normalizeTicker } from '../shared/lib';
import { log } from '../shared/log';
import { errorOrderSound } from '../shared/sound';

const activeTickerRow = `.market-watch > table > tbody > tr.active[title]`;

const TICKERS_MAP: Record<string, string> = { META: 'FB' };

export function currentTicker() {
  const title = document.querySelector(activeTickerRow)?.getAttribute('title') || '';
  return normalizeTicker(title);
}

export function currentTickerAskBid() {
  const row = document.querySelector(activeTickerRow);

  if (!row) {
    throw new Error('Cannot find active ticker info');
  }

  const prices = [...row.querySelectorAll('.value.price')].map((i) => parseFloat(i.innerText));

  let precision = 2;
  try {
    // @ts-ignore
    precision = row.querySelector('.value.price').innerText.split('.')[1].length;
  } catch (e) {
    //
  }

  return {
    bid: prices[0],
    ask: prices[1],
    precision,
  };
}

export function setTicker(ticker: string) {
  log(`Set ticker ${ticker}`);

  if (TICKERS_MAP[ticker]) {
    ticker = TICKERS_MAP[ticker];
  }

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
