import { log } from './shared/log';

const DEFAULT_CONFIG = {
  maxLoss: 1, // in $
  leverage: 200,
};

export type IConfig = typeof DEFAULT_CONFIG;

// @ts-ignore
export const config: IConfig = { ...DEFAULT_CONFIG };

export async function getConfig() {
  const storageData = await chrome.storage.local.get('WF_CONFIG');

  if (Object.keys(storageData?.WF_CONFIG || {}).length) {
    Object.entries(storageData.WF_CONFIG).forEach(([k, v]) => {
      // @ts-ignore
      config[k] = v;
    });
  }

  log('Config', config);

  return config;
}

export async function saveConfig(data: IConfig) {
  await chrome.storage.local.set({ ['WF_CONFIG']: JSON.parse(JSON.stringify(data)) });
}
