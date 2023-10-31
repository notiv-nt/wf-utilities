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

export function anyMetaKey(e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey;
}

export function eventInInput({ target }: any) {
  return ['input', 'textarea'].includes(target?.tagName?.toLowerCase() || '');
}

export function normalizeTicker(value: string) {
  if (value.endsWith('f') && value.length === 7) {
    return value.slice(0, -1).toUpperCase();
  }

  if (value.startsWith('#')) {
    return value.slice(1).toUpperCase();
  }

  return value.toUpperCase();
}

export function roundPrice(price: number, precision = 2) {
  return Math.round(price * Math.pow(10, precision)) / Math.pow(10, precision);
}

export async function waitFor(fn: () => any, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const call = fn();
    if (call) {
      return call;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}
