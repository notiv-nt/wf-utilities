export function successOrderSound() {
  const audio = new Audio(chrome.runtime.getURL('static/order-success.mp3'));
  audio.play();
}

export function errorOrderSound() {
  const audio = new Audio(chrome.runtime.getURL('static/order-error.mp3'));
  audio.play();
}
