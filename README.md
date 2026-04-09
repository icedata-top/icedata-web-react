# icedata-web-react
基于 React 的 icedata 前端项目

## Quick start
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm start`
3. 打包构建：`npm run build`

启动后默认在 `http://localhost:5173/` 访问。

## 环境与后端配置

项目支持三个运行环境：`MOCK`、`DEV`、`PROD`。环境配置与 API base URL 定义在：

- `src/config/runtimeEnv.js`
  - `CURRENT_APP_ENV`：当前环境（优先读取 `VITE_APP_ENV`）
  - `BASE_URL_BY_ENV`：`DEV` / `PROD` 的 base url

### 三个环境的作用

- `MOCK`
  - 各 `xxx.api.js` 直接返回本地 MOCK 数据，不发起后端请求
  - 仅需启动前端：`npm start`
- `DEV`
  - 前端会发起真实 HTTP 请求
  - 需要同时启动后端服务（默认指向 `http://localhost:8080`）
- `PROD`
  - 前端会发起真实 HTTP 请求
  - 默认指向生产域名 `https://www.icedata.top`

### 如何修改开发环境 socket（后端地址）

请编辑 `src/config/runtimeEnv.js` 中的 `BASE_URL_BY_ENV`：

```js
const BASE_URL_BY_ENV = Object.freeze({
  DEV: 'http://localhost:8080',
  PROD: 'https://www.icedata.top',
});
```

将 `DEV` 对应值改为你的开发后端地址（例如内网 IP、端口等）。

### 如何切换环境

通过 Vite 环境变量 `VITE_APP_ENV` 设置（可在启动命令前临时设置，或写入 `.env.local`）：

- `VITE_APP_ENV=MOCK`
- `VITE_APP_ENV=DEV`
- `VITE_APP_ENV=PROD`

未设置时默认使用 `MOCK`。

## 目录树

```
icedata-web-react/
├── index.html                 # 入口 HTML（站点标题、favicon）
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   ├── png/                   # Logo 等位图
│   └── svg/                   # unDraw 等插图
├── src/
│   ├── main.jsx               # React 挂载、全局样式入口
│   ├── App.jsx                # 根组件与路由
│   ├── components/
│   │   ├── IcedataNavbar.jsx
│   │   └── IcedataNavbar.css
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Overview/
│   │   └── …
│   ├── services/              # API / MOCK
│   └── styles/
│       └── global.css         # 全局主题与卡片变量
└── tests/
```

## 配色方案

配色在 `src/styles/global.css` 中通过 **CSS 自定义属性** 定义，浅色为 `:root`，深色为根节点带 `[data-theme='dark']`（与导航栏主题切换一致）。**品牌色在深浅主题下相同**。

### 品牌色（冰数据）

| 用途 | 变量名 | 色值 | 说明 |
|------|--------|------|------|
| 主题主色 | `--theme-primary` | `#438BED` | 链接、强调、导航高亮、搜索按钮默认色等 |
| 高亮 / 悬停 | `--theme-accent` | `#76AFF2` | 按钮悬停、部分强调态 |

### 涨跌色（同环比等）

与 **A 股等常见行情色** 一致：**上升为红、下降为绿**；持平为中性灰。变量在 `src/styles/global.css` 的 `:root` 与 `[data-theme='dark']` 中定义，组件内用 `var(--trend-up)` 等引用。

| 变量名 | 浅色（`:root`） | 深色（`[data-theme='dark']`） | 含义 |
|--------|------------------|-------------------------------|------|
| `--trend-up` | `#CF1322` | `#FF7875` | 上升（红） |
| `--trend-down` | `#3F8600` | `#95DE64` | 下降（绿） |
| `--trend-flat` | `#8C8C8C` | `#8C8C8C` | 持平 / 无变化 |

### 浅色主题（`:root`）

| 变量 | 色值 | 典型用途 |
|------|------|----------|
| `--bg` | `#f4f4f4` | 页面主背景 |
| `--bg-hover` | `#ffffff` | 卡片、可悬停表面在 pointer 悬停时的背景 |
| `--text` | `#333333` | 正文与标题文字 |
| `--card-bg` | `#ffffff` | 表单控件、次级块背景等 |
| `--navbar-bg` | `#f4f4f4` | 导航栏卡片、总览卡片等默认表面背景（与 `--bg` 一致，悬停再用 `--bg-hover` 提亮） |
| `--border` | `#e5e7eb` | 边框、分割线 |
| `--shadow` | `rgba(15, 23, 42, 0.12)` | **悬停卡片阴影**等较重阴影的基准色 |

### 深色主题（`[data-theme='dark']`）

| 变量 | 色值 | 典型用途 |
|------|------|----------|
| `--bg` | `#1E1F22` | 页面主背景 |
| `--bg-hover` | `#27282D` | 卡片等表面悬停背景 |
| `--text` | `#e0e0e0` | 正文与标题文字 |
| `--card-bg` | `#24262b` | 表单控件、次级块背景等 |
| `--navbar-bg` | `#1E1F22` | 导航栏卡片、总览卡片等默认表面背景 |
| `--border` | `#2b2f36` | 边框 |
| `--shadow` | `rgba(0, 0, 0, 0.35)` | 悬停卡片阴影的基准色 |

### 卡片与阴影（全局）

| 变量 | 说明 |
|------|------|
| `--radius-card` | 卡片圆角（默认 `8px`，小于早期 `12px`） |
| `--shadow-card` | **默认**较轻、较淡的阴影 |
| `--shadow-card-hover` | **悬停**时加深阴影（与原先「常显重阴影」一致的量级） |

导航栏 `Card`、总览页 `Card` 等使用上述变量，并在 `:hover` 时切换为 `--shadow-card-hover` 与 `--bg-hover`。可选工具类：`.app-card-surface` / `.app-card-surface:hover`（定义在 `global.css`）。

深色下部分卡片边框仍会使用组件级 `#343840`（与导航栏一致），以保证与深灰背景对比度。

浅色下导航条外层背景与 `--bg` 一致，不再使用向白色混合的渐变，避免出现卡片背后类似 `#fafafa` 的色带；Ant Design `Card` 的默认填充色已通过局部样式覆盖为 `var(--navbar-bg)`。

### 使用约定

- 新增样式时优先使用 `var(--theme-primary)`、`var(--text)`、`var(--bg-hover)` 等变量；**同环比涨跌**使用 `var(--trend-up)` / `var(--trend-down)` / `var(--trend-flat)`，勿在组件内写死红绿色值。
- 新建「卡片式」块时优先复用 `--radius-card`、`--shadow-card`、`--shadow-card-hover`，避免写死圆角与阴影。

## 术语约定

- 本项目前端显示的是“歌曲”，但是歌曲本质都是带有 MV 的视频，所以变量命名和后端全部使用 video
- 类似地，前端显示的是“创作者”，但实际指的是用户，使用 user

## 使用的第三方组件/素材

- Ant Design 组件库
- VChart 图表
- unDraw 图片素材
