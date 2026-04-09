/**
 * 全局运行环境配置：
 * - MOCK：前端本地 MOCK 数据
 * - DEV：请求开发环境后端
 * - PROD：请求生产环境后端
 *
 * 可通过 Vite 环境变量覆盖（可选）：
 * - VITE_APP_ENV=MOCK|DEV|PROD
 */

export const APP_ENV = Object.freeze({
  MOCK: 'MOCK',
  DEV: 'DEV',
  PROD: 'PROD',
});

/** 默认环境（未配置 VITE_APP_ENV 时生效） */
const DEFAULT_ENV = APP_ENV.DEV;

/** 当前环境：优先取 VITE_APP_ENV，否则使用默认值 */
export const CURRENT_APP_ENV = normalizeAppEnv(import.meta.env?.VITE_APP_ENV) ?? DEFAULT_ENV;

/** DEV / PROD 的 base url（不含路径） */
const BASE_URL_BY_ENV = Object.freeze({
  [APP_ENV.DEV]: 'http://localhost:8080',
  [APP_ENV.PROD]: 'https://www.icedata.top',
});

/** 是否走 MOCK */
export function isMockEnv() {
  return CURRENT_APP_ENV === APP_ENV.MOCK;
}

/** 返回当前环境下 API base url；MOCK 环境返回空串 */
export function getApiBaseUrl() {
  if (isMockEnv()) return '';
  return BASE_URL_BY_ENV[CURRENT_APP_ENV] ?? BASE_URL_BY_ENV[APP_ENV.DEV];
}

function normalizeAppEnv(value) {
  if (!value) return null;
  const upper = String(value).toUpperCase();
  if (upper === APP_ENV.MOCK || upper === APP_ENV.DEV || upper === APP_ENV.PROD) {
    return upper;
  }
  return null;
}
