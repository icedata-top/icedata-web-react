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
 * @property {string} name 指标标识，如 newVideoCount、view、favorite
 * @property {number} value 当前值
 * @property {number} [yoy] 同比，可选
 * @property {number} [dod] 环比，可选
 */

/**
 * 单日趋势：日期 + 各指标当日值（name 与 OverviewIndicator.name 一致）
 * @typedef {Object} OverviewTrendDay
 * @property {string} date YYYY-MM-DD
 * @property {Record<string, number>} indicators 指标标识 → 数值
 */

/**
 * 二级分区投稿条数（MOCK / 将来与后端对齐）
 * @typedef {{ typeId: number, count: number }} OverviewPartitionSubmission
 */

/**
 * @typedef {Object} OverviewIndicatorsPayload
 * @property {string} startDate
 * @property {string} endDate
 * @property {OverviewIndicator[]} indicators
 * @property {OverviewTrendDay[]} [trend] 按天的趋势序列（MOCK）
 * @property {OverviewPartitionSubmission[]} [partitionSubmissions] 各分区投稿量
 * @property {OverviewViewHistogramRow[]} [viewHistogram] 播放量分桶（直方图·全部投稿）
 * @property {OverviewViewHistogramRow[]} [viewHistogramNew] 播放量分桶（直方图·新投稿 MOCK）
 */

/**
 * @typedef {{ code: string, label: string, count: number }} OverviewViewHistogramRow
 */

/**
 * @typedef {Object} OverviewPartitionSubmissionsPayload
 * @property {string} startDate
 * @property {string} endDate
 * @property {OverviewPartitionSubmission[]} rows
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
  { name: 'view', value: 1274561, yoy: 0.012, dod: 0.008 },
  { name: 'favorite', value: 109143, yoy: -0.011, dod: 0.015 },
];

/** 本地日历递增一天，返回 YYYY-MM-DD */
function nextDayYmd(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/**
 * 生成 [startDate, endDate] 闭区间内每日趋势 MOCK（含周末波动）
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {OverviewTrendDay[]}
 */
export function buildMockTrendForRange(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) {
    return [];
  }

  const rows = [];
  let cur = startDate;
  let idx = 0;

  while (cur <= endDate) {
    const wobble = Math.sin(idx * 0.35) * 9;
    const weekend = [0, 6].includes(new Date(`${cur}T12:00:00`).getDay()) ? -12 : 0;

    rows.push({
      date: cur,
      indicators: {
        newVideoCount: Math.max(0, Math.round(118 + wobble + weekend + (idx % 6) * 2)),
        activeUserCount: Math.max(0, Math.round(92 + wobble * 0.55 + weekend * 0.4 + (idx % 5))),
        view: Math.max(0, Math.round(920000 + idx * 11000 + wobble * 1800 + weekend * 4000)),
        favorite: Math.max(0, Math.round(88500 + idx * 320 + wobble * 160 + weekend * 350)),
        like: Math.max(0, Math.round(12100 + idx * 45 + wobble * 12 + weekend * 80)),
        coin: Math.max(0, Math.round(8200 + idx * 28 + wobble * 9 + weekend * 50)),
        share: Math.max(0, Math.round(2100 + idx * 9 + wobble * 4 + weekend * 15)),
        reply: Math.max(0, Math.round(5100 + idx * 22 + wobble * 7 + weekend * 40)),
        danmaku: Math.max(0, Math.round(1580 + idx * 7 + wobble * 3 + weekend * 12)),
      },
    });

    idx += 1;
    cur = nextDayYmd(cur);
  }

  return rows;
}

/** 固定区间示例数据（约两周），便于单独调试或 Storybook */
export const MOCK_INDICATORS_TREND = buildMockTrendForRange('2026-03-21', '2026-04-03');

/** MOCK：各二级分区投稿量（type_id → 投稿数） */
const MOCK_PARTITION_SUBMISSIONS = [
  { typeId: 30, count: 469 },
  { typeId: 21, count: 418 },
  { typeId: 31, count: 85 },
  { typeId: 28, count: 72 },
  { typeId: 47, count: 63 },
  { typeId: 27, count: 62 },
  { typeId: 130, count: 44 },
  { typeId: 25, count: 43 },
  { typeId: 59, count: 40 },
  { typeId: 242, count: 27 },
];

function cloneMockPartitionSubmissions() {
  return MOCK_PARTITION_SUBMISSIONS.map((row) => ({ ...row }));
}

/**
 * 播放量分桶 MOCK（与 SQL 中 E02–E09 区间一致；label 为横轴展示用）
 * @type {OverviewViewHistogramRow[]}
 */
const MOCK_VIEW_HISTOGRAM_BASE = [
  { code: 'E02', label: '0-10', count: 60683 },
  { code: 'E03', label: '10-100', count: 19334 },
  { code: 'E04', label: '100-1000', count: 57788 },
  { code: 'E05', label: '1000-1万', count: 65705 },
  { code: 'E06', label: '1万-10万', count: 50877 },
  { code: 'E07', label: '10万-100万', count: 18633 },
  { code: 'E08', label: '100万-1000万', count: 2170 },
  { code: 'E09', label: '1000万+', count: 42 },
];

function cloneMockViewHistogram() {
  return MOCK_VIEW_HISTOGRAM_BASE.map((row) => ({ ...row }));
}

/** 新投稿维度的直方图 MOCK（与全部投稿同分桶，数量为独立 MOCK） */
const MOCK_VIEW_HISTOGRAM_NEW_BASE = [
  { code: 'E02', label: '0-10', count: 4820 },
  { code: 'E03', label: '10-100', count: 2104 },
  { code: 'E04', label: '100-1000', count: 8912 },
  { code: 'E05', label: '1000-1万', count: 12408 },
  { code: 'E06', label: '1万-10万', count: 9602 },
  { code: 'E07', label: '10万-100万', count: 3104 },
  { code: 'E08', label: '100万-1000万', count: 412 },
  { code: 'E09', label: '1000万+', count: 6 },
];

function cloneMockViewHistogramNew() {
  return MOCK_VIEW_HISTOGRAM_NEW_BASE.map((row) => ({ ...row }));
}

/**
 * 播放量直方图分桶（MOCK）
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Promise<ApiResult<{ startDate: string, endDate: string, rows: OverviewViewHistogramRow[] }>>}
 */
export function fetchOverviewViewHistogram(startDate, endDate) {
  return Promise.resolve({
    code: OVERVIEW_API_CODE.OK,
    message: 'success',
    data: {
      startDate,
      endDate,
      rows: cloneMockViewHistogram(),
      rowsNew: cloneMockViewHistogramNew(),
    },
  });
}

/**
 * 获取各二级分区投稿数量（MOCK）
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Promise<ApiResult<OverviewPartitionSubmissionsPayload>>}
 */
export function fetchOverviewPartitionSubmissions(startDate, endDate) {
  return Promise.resolve({
    code: OVERVIEW_API_CODE.OK,
    message: 'success',
    data: {
      startDate,
      endDate,
      rows: cloneMockPartitionSubmissions(),
    },
  });
}

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
    trend: buildMockTrendForRange(startDate, endDate),
    partitionSubmissions: cloneMockPartitionSubmissions(),
    viewHistogram: cloneMockViewHistogram(),
    viewHistogramNew: cloneMockViewHistogramNew(),
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
