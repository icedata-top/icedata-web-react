import { isMockEnv } from '../../config/runtimeEnv.js';
import { postJson } from '../http/client.js';

/**
 * UniSeek（大搜）契约草案
 *
 * 请求体建议：
 * {
 *   keyword: string,                     // 必填
 *   types?: ('video'|'vocal'|'producer')[], // 可选，不传则全搜
 *   page?: number,                       // 可选，默认 1
 *   pageSize?: number                    // 可选，默认 20
 * }
 *
 * 响应体建议（仅 data）：
 * {
 *   keyword: string,
 *   total: number,
 *   page: number,
 *   pageSize: number,
 *   list: SeekItem[]
 * }
 */

/**
 * @typedef {'video'|'vocal'|'producer'} SeekItemType
 */

/**
 * 各类型通用字段
 * @typedef {Object} SeekItemBase
 * @property {SeekItemType} type
 * @property {string|number} id
 * @property {string} title
 * @property {string} subTitle
 * @property {number} [score] 相关性分，方便前端排序（可选）
 * @property {string} [coverUrl] 封面/头像
 * @property {string} [jumpUrl] 前端跳转链接（可选）
 */

/**
 * 视频结果（歌曲）
 * @typedef {SeekItemBase & {
 *   type: 'video',
 *   bvid?: string,
 *   play?: number,
 *   favorite?: number,
 *   like?: number,
 *   coin?: number,
 *   publishDate?: string, // YYYY-MM-DD
 *   durationSec?: number,
 *   producerId?: string|number,
 *   vocalIdList?: Array<string|number>,
 * }} SeekVideoItem
 */

/**
 * 虚拟歌手结果
 * @typedef {SeekItemBase & {
 *   type: 'vocal',
 *   alias?: string[],
 *   songCount?: number,
 *   followerCount?: number,
 *   representativeWorks?: Array<{ id: string|number, title: string }>,
 * }} SeekVocalItem
 */

/**
 * 创作者结果
 * @typedef {SeekItemBase & {
 *   type: 'producer',
 *   uid?: string|number,
 *   fanCount?: number,
 *   totalView?: number,
 *   videoCount?: number,
 *   recentWork?: { id: string|number, title: string, publishDate?: string },
 * }} SeekProducerItem
 */

/**
 * 联合搜索结果项
 * @typedef {SeekVideoItem | SeekVocalItem | SeekProducerItem} SeekItem
 */

/**
 * @typedef {Object} UniSeekRequest
 * @property {string} keyword
 * @property {SeekItemType[]} [types]
 * @property {number} [page]
 * @property {number} [pageSize]
 */

/**
 * @typedef {Object} UniSeekResponseData
 * @property {string} keyword
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {SeekItem[]} list
 */

/**
 * @param {UniSeekRequest} request
 * @returns {Promise<UniSeekResponseData>}
 */
export function seek(request) {
  const req = {
    keyword: request?.keyword ?? '',
    types: request?.types,
    page: request?.page ?? 1,
    pageSize: request?.pageSize ?? 20,
  };

  if (!isMockEnv()) {
    return postJson('/uniseek/search', req);
  }

  /** @type {SeekItem[]} */
  const list = [
    {
      type: 'video',
      id: 'BV1xx411c7mD',
      bvid: 'BV1xx411c7mD',
      title: `${req.keyword || '关键词'} - 示例歌曲`,
      subTitle: '投稿者：示例P 主唱：示例V',
      play: 123456,
      favorite: 4567,
      like: 8901,
      coin: 2345,
      publishDate: '2026-04-01',
      durationSec: 231,
    },
    {
      type: 'vocal',
      id: 30,
      title: '示例虚拟歌手',
      subTitle: '代表曲风：电子 / 流行',
      songCount: 321,
      followerCount: 210000,
      representativeWorks: [{ id: 'BV1abc', title: '代表作 A' }],
    },
    {
      type: 'producer',
      id: 10086,
      uid: 10086,
      title: '示例创作者',
      subTitle: '活跃于 VOCALOID · UTAU',
      fanCount: 98000,
      totalView: 12000000,
      videoCount: 654,
      recentWork: { id: 'BV1def', title: '最近投稿', publishDate: '2026-04-20' },
    },
  ].filter((item) => !req.types?.length || req.types.includes(item.type));

  return Promise.resolve({
    keyword: req.keyword,
    total: list.length,
    page: req.page,
    pageSize: req.pageSize,
    list,
  });
}