import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Spin, Statistic, message } from 'antd';
import { ApiError } from '../../services/http/client.js';
import { fetchHomeOverview, mapHomeDataToStats } from '../../services/Home/home.api.js';
import './index.css';

const { Search } = Input;

export default function Home() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchHomeOverview()
      .then((data) => {
        if (cancelled) return;
        setStats(data ? mapHomeDataToStats(data) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setStats([]);
        if (err instanceof ApiError) {
          message.error(`[${err.code}] ${err.message}`);
          return;
        }
        message.error(err?.message || '请求失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
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
        <Spin spinning={loading}>
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
        </Spin>
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
        <span className="home-footer-sep">｜</span>
        <Link to="/about" className="home-footer-link">
          关于冰数据
        </Link>
      </footer>
    </div>
  );
}
