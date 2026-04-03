import { useEffect, useState } from 'react';
import { Button, Card, Menu } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import './IcedataNavbar.css';

const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'overview', label: '总览' },
  {
    key: 'songs',
    label: '歌曲',
    children: [
      { key: 'song_search', label: '歌曲搜索' },
      { key: 'single_detail', label: '单曲详情' },
      { key: 'new_ranking', label: '新曲排行' },
    ],
  },
  { key: 'vocaloid', label: '虚拟歌手' },
  { key: 'creators', label: '创作者' },
  {
    key: 'links',
    label: '友情链接',
    children: [
      {
        key: 'link_tdd',
        label: (
          <a href="https://tdd.bunnyxt.com/" target="_blank" rel="noreferrer">
            天钿 Daily
          </a>
        ),
      },
      {
        key: 'link_cvse',
        label: (
          <a href="https://cvse.cc/" target="_blank" rel="noreferrer">
            CVSE+
          </a>
        ),
      },
      {
        key: 'link_vsqx',
        label: (
          <a href="https://www.vsqx.top/" target="_blank" rel="noreferrer">
            VSQX分享平台
          </a>
        ),
      },
      {
        key: 'link_hjy',
        label: (
          <a href="https://www.huajianyou.com/" target="_blank" rel="noreferrer">
            花间游
          </a>
        ),
      },
    ],
  },
  { key: 'about', label: '关于' },
];

export default function IcedataNavbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  function handleThemeToggle() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    if (nextIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      return;
    }

    document.documentElement.removeAttribute('data-theme');
  }

  return (
    <header className="icedata-navbar-wrap">
      <Card className="icedata-navbar-card" bodyStyle={{ padding: '0 16px' }}>
        <div className="icedata-navbar-inner">
          <img
            className="icedata-navbar-logo"
            src="/png/icedata_logo_with_name_512x.png"
            alt="冰数据"
          />
          <div className="icedata-navbar-menu-wrap">
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['home']}
              items={menuItems}
              overflowedIndicator={<span className="icedata-menu-overflow-icon">...</span>}
              className="icedata-navbar-menu"
            />
          </div>
          <Button
            className="icedata-theme-toggle"
            onClick={handleThemeToggle}
            shape="circle"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            aria-label={isDark ? '切换到白天模式' : '切换到夜间模式'}
            title={isDark ? '白天模式' : '夜间模式'}
          />
        </div>
      </Card>
    </header>
  );
}
