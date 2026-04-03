import { Input, Statistic } from 'antd';
import IcedataNavbar from '../../components/IcedataNavbar.jsx';
import './index.css';

const { Search } = Input;

const stats = [
  { key: 'songs', title: '收录歌曲', value: '554593', suffix: '首' },
  { key: 'artists', title: '收录歌手', value: '30', suffix: '位' },
  { key: 'creators', title: '收录创作者', value: '101086', suffix: '位' },
  { key: 'spanDays', title: '记录跨度', value: '543', suffix: '日' },
];

export default function Home() {
  return (
    <>
      <IcedataNavbar />
      <div className="home-page">
        <section className="home-hero">
          <img
            className="home-logo"
            src="/png/icedata_logo_512x.png"
            alt="冰数据"
          />

          <div className="home-search">
            <Search
              placeholder="搜索一首歌，一位虚拟歌手，或一位创作者"
              enterButton
              size="large"
              className="home-search-input"
              onSearch={() => {}}
            />
          </div>
        </section>

        <section className="home-stats-scroll" aria-label="数据概览">
          <div className="home-stats-row">
            {stats.map((item) => (
              <div key={item.key} className="home-stat-item">
                <Statistic
                  title={item.title}
                  value={item.value}
                  suffix={item.suffix}
                  valueStyle={{ color: 'var(--text)' }}
                />
              </div>
            ))}
          </div>
        </section>

        <footer className="home-footer">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            className="home-footer-link"
          >
            苏ICP备2022012035
          </a>
          <span className="home-footer-sep">｜</span>
          <span className="home-footer-text">Copyright 2026</span>
        </footer>
      </div>
    </>
  );
}

