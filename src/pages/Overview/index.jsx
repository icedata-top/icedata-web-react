import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Spin, Typography } from 'antd';
import OverviewFilter from './components/OverviewFilter.jsx';
import IndicatorCell from './components/IndicatorCell.jsx';
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

        <Card className="overview-panel overview-panel--metrics" bordered={false} title="指标数值">
          <section className="overview-metrics" aria-live="polite">
            <Spin spinning={loading}>
              {!range?.[0] || !range?.[1] ? (
                <Text type="secondary">请选择日期范围以查看指标。</Text>
              ) : payload ? (
                <div className="overview-meta">
                  <div className="overview-indicator-grid">
                    {payload.indicators.map((row) => (
                      <div key={row.name} className="overview-indicator-item">
                        <IndicatorCell data={row} precision={1} />
                      </div>
                    ))}
                  </div>
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
