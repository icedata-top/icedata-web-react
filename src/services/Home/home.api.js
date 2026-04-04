/**
 * 首页概览 MOCK（无后端时模拟 API 返回结构）
 * 字段与后端约定：前端展示「歌曲」对应 video，「创作者」对应 user（见 README 术语）
 */

const MOCK_HOME_DATA = {
  videoCount: 554593,
  singerCount: 30,
  userCount: 101086,
  spanDays: 543,
};

/** 业务成功码，与后端对齐时可改为枚举 */
export const HOME_API_CODE = {
  OK: 0,
};

/**
 * @typedef {Object} HomeOverviewData
 * @property {number} videoCount
 * @property {number} singerCount
 * @property {number} userCount
 * @property {number} spanDays
 */

/**
 * @template T
 * @typedef {Object} ApiResult
 * @property {number} code
 * @property {string} message
 * @property {T} [data]
 */

/**
 * 将首页数据转为首页 Statistic 列表配置
 * @param {HomeOverviewData} data
 */
export function mapHomeDataToStats(data) {
  return [
    { key: 'songs', title: '收录歌曲', value: data.videoCount, suffix: '首' },
    { key: 'artists', title: '收录歌手', value: data.singerCount, suffix: '位' },
    { key: 'creators', title: '收录创作者', value: data.userCount, suffix: '位' },
    { key: 'spanDays', title: '记录跨度', value: data.spanDays, suffix: '日' },
  ];
}

/**
 * 获取首页概览数据（MOCK：不发起网络请求）
 * @returns {Promise<ApiResult<HomeOverviewData>>}
 */
export function fetchHomeOverview() {
  const payload = {
    code: HOME_API_CODE.OK,
    message: 'success',
    data: { ...MOCK_HOME_DATA },
  };

  return Promise.resolve(payload);
}
