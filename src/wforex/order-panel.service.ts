import { loop } from '../shared/loop';

export function keepOrderPanelOpen() {
  loop.on('tick', () => {
    const button = document.querySelector<HTMLButtonElement>('.top-bar .group div[title*="Show Trade Form" i]');
    if (button) {
      button.click();
    }
  });
}

export function autoCloseTradeSuccessMessage() {
  loop.on('tick', () => {
    const btn = document.querySelector<HTMLButtonElement>('.left-panel .status .footer .trade-button');
    if (btn) {
      btn.click();
    }
  });
}
