export function isNumber(val: any) {
  return typeof val === 'number' && !Number.isNaN(val);
}

export function injectScript(file_path: string, tag: string) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

export const frame = () => new Promise((res) => setTimeout(res, 40));
