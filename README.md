# icedata-web-react
基于 React 的 icedata 前端项目

## Quick start
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm start`
3. 打包构建：`npm run build`

启动后默认在 `http://localhost:5173/` 访问。

## 目录树

```
icedata-web-react/
├── index.html                 # 入口 HTML（站点标题、favicon）
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   └── png/
│       ├── icedata_logo_512x.png              # 站点图标 / 首页 logo（无字方形）
│       └── icedata_logo_with_name_512x.png    # 导航栏 logo（含名称）
├── src/
│   ├── main.jsx               # React 挂载、全局样式入口
│   ├── App.jsx                # 根组件（当前渲染首页）
│   ├── components/
│   │   ├── IcedataNavbar.jsx  # 顶栏导航
│   │   └── IcedataNavbar.css
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── index.jsx      # 首页
│   │   │   └── index.css
│   │   └── HelloWorld.jsx     # 示例页（可选）
│   └── styles/
│       └── global.css         # 主题 CSS 变量（浅色 / 深色）
└── tests/                     # 测试目录（占位）
```

## 配色方案

配色在 `src/styles/global.css` 中通过 **CSS 自定义属性** 定义，浅色为 `:root`，深色为根节点带 `[data-theme='dark']`（与导航栏主题切换一致）。**品牌色在深浅主题下相同**，其余为界面底色与中性色。

### 品牌色（冰数据）

| 用途 | 变量名 | 色值 | 说明 |
|------|--------|------|------|
| 主题主色 | `--theme-primary` | `#438BED` | 链接、强调、导航高亮、搜索按钮默认色等 |
| 高亮 / 悬停 | `--theme-accent` | `#76AFF2` | 按钮悬停、部分强调态 |

### 浅色主题（`:root`）

| 变量 | 色值 | 典型用途 |
|------|------|----------|
| `--bg` | `#ffffff` | 页面背景 |
| `--text` | `#333333` | 正文与标题文字 |
| `--card-bg` | `#f8f9fa` | 卡片、输入区底色等 |
| `--navbar-bg` | `#ffffff` | 导航栏卡片背景 |
| `--border` | `#e5e7eb` | 边框、分割线 |
| `--shadow` | `rgba(15, 23, 42, 0.12)` | 阴影 |

### 深色主题（`[data-theme='dark']`）

| 变量 | 色值 | 典型用途 |
|------|------|----------|
| `--bg` | `#1E1F22` | 页面背景 |
| `--text` | `#e0e0e0` | 正文与标题文字 |
| `--card-bg` | `#24262b` | 卡片、输入区底色等 |
| `--navbar-bg` | `#1E1F22` | 导航栏区域背景 |
| `--border` | `#2b2f36` | 边框 |
| `--shadow` | `rgba(0, 0, 0, 0.35)` | 阴影 |

### 使用约定

- 新增样式时优先使用 `var(--theme-primary)`、`var(--text)` 等变量，避免写死十六进制，以便深浅主题一致切换。
- 若需与 Ant Design 组件配色对齐，可在局部用同一套变量覆盖组件样式（见 `IcedataNavbar.css`、`pages/Home/index.css`）。

## 术语约定

- 本项目前端显示的是“歌曲”，但是歌曲本质都是带有 MV 的视频，所以变量命名和后端全部使用 video
- 类似地，前端显示的是“创作者”，但实际指的是用户，使用 user

## 使用的第三方组件/素材

- Ant Design 组件库
- VChart 图表
- unDraw 图片素材