chrome.runtime.onMessage.addListener(async (message) => {
  const tabs = await chrome.tabs.query({
    url: ['https://webtrading.wforex.com/terminal*', 'https://www.tradingview.com/chart/*'],
  });

  for (const tab of tabs) {
    // @ts-ignore
    chrome.tabs.sendMessage(tab.id, message);
  }
});
