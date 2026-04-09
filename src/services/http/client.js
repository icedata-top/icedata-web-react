import { getApiBaseUrl } from '../../config/runtimeEnv.js';

/**
 * 发起 GET 请求并返回 JSON。
 * @param {string} path 形如 /overview/get-indicators
 * @param {Record<string, string | number | boolean | null | undefined>} [query]
 */
export async function getJson(path, query) {
  const baseUrl = getApiBaseUrl();
  const url = new URL(path, `${baseUrl || window.location.origin}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value == null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
