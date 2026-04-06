/**
 * 总览页指标 MOCK（无后端时不发起请求）
 * 请求体约定：startDate / endDate 为 YYYY-MM-DD
 */

/** 与首页等服务对齐的业务成功码 */
export const OVERVIEW_API_CODE = {
  OK: 0,
};

/**
 * @typedef {Object} OverviewIndicator
 * @property {string} name 指标标识，如 newVideoCount
 * @property {number} value 当前值
 * @property {number} [yoy] 同比，可选
 * @property {number} [dod] 环比，可选
 */

/**
 * @typedef {Object} OverviewIndicatorsPayload
 * @property {string} startDate
 * @property {string} endDate
 * @property {OverviewIndicator[]} indicators
 */

/**
 * @template T
 * @typedef {Object} ApiResult
 * @property {number} code
 * @property {string} message
 * @property {T} [data]
 */

const MOCK_INDICATORS_BASE = [
  { name: 'newVideoCount', value: 1435, yoy: 0.15, dod: 0.11 },
  { name: 'activeUserCount', value: 107, yoy: -0.05, dod: -0.03 },
  { name: 'newSingerCount', value: 12, yoy: 0.08, dod: 0.06 },
];

/**
 * 根据日期范围拉取总览指标（MOCK）
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Promise<ApiResult<OverviewIndicatorsPayload>>}
 */
export function fetchOverviewIndicators(startDate, endDate) {
  const data = {
    startDate,
    endDate,
    indicators: MOCK_INDICATORS_BASE.map((row) => ({ ...row })),
  };

  return Promise.resolve({
    code: OVERVIEW_API_CODE.OK,
    message: 'success',
    data,
  });
}

/**
 * @deprecated 请使用 fetchOverviewIndicators，返回结构已统一为 ApiResult
 */
export function getOverviewIndicators(startDate, endDate) {
  return fetchOverviewIndicators(startDate, endDate);
}
