/** 导航菜单项 key → 路由路径（未实现页面统一进入「待开发」页） */
export const MENU_KEY_TO_PATH = {
  home: '/',
  overview: '/overview',
  song_search: '/songs/search',
  single_detail: '/songs/detail',
  new_ranking: '/songs/ranking',
  vocaloid: '/vocaloid',
  creators: '/creators',
  about: '/about',
};

const PATH_TO_MENU_KEY = Object.fromEntries(
  Object.entries(MENU_KEY_TO_PATH).map(([key, path]) => [path, key]),
);

export function getMenuKeyFromPathname(pathname) {
  return PATH_TO_MENU_KEY[pathname];
}
