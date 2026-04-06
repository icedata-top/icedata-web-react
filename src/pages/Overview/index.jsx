import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Spin, Typography } from 'antd';
import OverviewFilter from './components/OverviewFilter.jsx';
import { fetchOverviewIndicators, OVERVIEW_API_CODE } from '../../services/Overview/overview.api.js';
import './index.css';

const { Text } = Typography;

function defaultRange() {
  return [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')];
}

export default function Overview() {
  const [range, setRange] = useState(() => defaultRange());
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);

  const load = useCallback((startDate, endDate) => {
    setLoading(true);
    fetchOverviewIndicators(startDate, endDate)
      .then((res) => {
        if (res.code === OVERVIEW_API_CODE.OK && res.data) {
          setPayload(res.data);
        } else {
          setPayload(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (range?.[0] && range?.[1]) {
      load(range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD'));
    } else {
      setPayload(null);
    }
  }, [range, load]);

  const onRangeChange = (dates) => {
    setRange(dates);
  };

  return (
    <div className="overview-page">
      <div className="overview-stack">
        <Card className="overview-panel" bordered={false}>
          <OverviewFilter value={range} onRangeChange={onRangeChange} />
        </Card>

        <Card className="overview-panel" bordered={false}>
          <section className="overview-metrics" aria-live="polite">
            <Spin spinning={loading}>
              {!range?.[0] || !range?.[1] ? (
                <Text type="secondary">请选择日期范围以查看指标。</Text>
              ) : payload ? (
                <div className="overview-meta">
                  <Text type="secondary" className="overview-range-hint">
                    {payload.startDate} ～ {payload.endDate}
                  </Text>
                  <ul className="overview-indicator-list">
                    {payload.indicators.map((row) => (
                      <li key={row.name} className="overview-indicator-item">
                        <span className="overview-indicator-name">{row.name}</span>
                        <span className="overview-indicator-value">{row.value}</span>
                        {row.yoy != null && (
                          <span className="overview-indicator-delta">同比 {formatRatio(row.yoy)}</span>
                        )}
                        {row.dod != null && (
                          <span className="overview-indicator-delta">环比 {formatRatio(row.dod)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Text type="secondary">暂无数据</Text>
              )}
            </Spin>
          </section>
        </Card>
      </div>
    </div>
  );
}

function formatRatio(n) {
  return `${(n * 100).toFixed(1)}%`;
}
