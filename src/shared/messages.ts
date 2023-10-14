export function sendMessage(type: string, message: any) {
  chrome.runtime.sendMessage({
    id: 'WF_UTILITIES_EVENT',
    type,
    data: message,
  });
}

export function onMessage(type: string, cb: (data: any) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    // console.log('message', message);
    if (message?.id === 'WF_UTILITIES_EVENT' && message?.type === type) {
      cb(message.data);
    }
  });
}
