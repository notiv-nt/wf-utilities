chrome.runtime.onMessage.addListener(async (message) => {
  const tabs = await chrome.tabs.query({
    url: 'https://webtrading.wforex.com/terminal*',
  });

  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, message);
  }
});
