import { anyMetaKey, eventInInput } from '../shared/lib';
import { loop } from '../shared/loop';

export function keepOrderPanelOpen() {
  loop.on('tick', () => {
    document.querySelector<HTMLButtonElement>('.top-bar .group div[title*="Show Trade Form" i]')?.click();
  });
}

export function closeStatusMessage() {
  document.querySelector<HTMLButtonElement>('.left-panel .status .footer .trade-button')?.click();
}

export function autoOpenTradesSection() {
  loop.on('tick', () => {
    document.querySelector<HTMLButtonElement>('.left-panel .icon-button[title="Trade"]:not(.checked)')?.click();
  });
}

export function waitForAppReady() {
  return new Promise((resolve) => {
    function loop() {
      const markets = !!document.querySelector('.market-watch');
      const chart = !!document.querySelector('.chart canvas');
      const leftPanel = !!document.querySelector('.left-panel .layout');

      const checks = [markets, chart, leftPanel];

      if (checks.every((i) => i)) {
        return setTimeout(resolve, 1000);
      }

      requestAnimationFrame(loop);
    }

    loop();

    setTimeout(resolve, 4000);
  });
}

export function keyboardShortcuts() {
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code.includes('Digit') && !anyMetaKey(e) && !eventInInput(e)) {
      const key = parseInt(e.code.slice(-1), 10);
      const timeFrameRoot = document.querySelector('.top-bar .group:nth-child(3) .list-view');

      // @ts-ignore
      timeFrameRoot?.children[key - 1]?.click();
    }
  });

  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === 'KeyR' && !anyMetaKey(e) && !eventInInput(e)) {
      document
        .querySelector<HTMLButtonElement>('button[title*="reset chart" i]')
        ?.dispatchEvent(new Event('mousedown'));
    }
  });
}

export function setStopLoss(val: number) {
  changeInput('.left-panel .sl label.input input', val, 'Stop loss input not found');
}

export function setVolume(val: number) {
  changeInput('.left-panel .volume label.input input', val, 'Volume input not found');
}

export function setComment(val: string) {
  changeInput('.left-panel .comment .value input', val, 'Comment input not found');
}

export function clickOnOpenOrder(side: 'BUY' | 'SELL') {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.left-panel .content .footer-row .trade-button');

  for (const button of buttons) {
    const texts = { BUY: 'buy by', SELL: 'sell by' };
    const text = texts[side];

    if (button.innerText.toLowerCase().includes(text)) {
      button.click();
      return;
    }
  }

  throw new Error('Cannot click on buy/sell buttons!');
}

export function getStatusMessage() {
  const status = document.querySelector<HTMLDivElement>('.left-panel .wrap .status');
  return (status?.children[1].innerText || '').toLowerCase();
}

function changeInput(selector: string, value: string | number, text: string) {
  const input = document.querySelector<HTMLInputElement>(selector);
  if (!input) {
    throw new Error(text);
  }
  input.value = `${value}`;
  input.dispatchEvent(new Event('blur'));
  input.dispatchEvent(new Event('change'));
  input.dispatchEvent(new Event('input'));
}
