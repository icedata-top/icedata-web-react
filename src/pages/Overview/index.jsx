import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Spin, Typography } from 'antd';
import OverviewFilter from './components/OverviewFilter.jsx';
import OverviewTrendChart from './components/OverviewTrendChart.jsx';
import OverviewPartitionPieChart from './components/OverviewPartitionPieChart.jsx';
import OverviewViewHistogramChart from './components/OverviewViewHistogramChart.jsx';
import IndicatorCell from './components/IndicatorCell.jsx';
import {
  fetchOverviewIndicators,
  fetchOverviewPartitionSubmissions,
  fetchOverviewTrend,
  fetchOverviewViewHistogram,
  OVERVIEW_API_CODE,
} from '../../services/Overview/overview.api.js';
import './index.css';

const { Text } = Typography;

/** 与 CSS 中 @media 一致：小于此宽度视为移动端，筛选走抽屉 */
const MOBILE_MAX_PX = 767;

function defaultRange() {
  return [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_MAX_PX : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isMobile;
}

export default function Overview() {
  const [range, setRange] = useState(() => defaultRange());
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const load = useCallback((startDate, endDate) => {
    setLoading(true);
    Promise.all([
      fetchOverviewIndicators(startDate, endDate),
      fetchOverviewTrend(startDate, endDate),
      fetchOverviewPartitionSubmissions(startDate, endDate),
      fetchOverviewViewHistogram(startDate, endDate),
    ])
      .then(([indicatorsRes, trendRes, partitionRes, histogramRes]) => {
        const ok =
          indicatorsRes.code === OVERVIEW_API_CODE.OK &&
          trendRes.code === OVERVIEW_API_CODE.OK &&
          partitionRes.code === OVERVIEW_API_CODE.OK &&
          histogramRes.code === OVERVIEW_API_CODE.OK;

        if (!ok || !indicatorsRes.data || !trendRes.data || !partitionRes.data || !histogramRes.data) {
          setPayload(null);
          return;
        }

        setPayload({
          startDate,
          endDate,
          indicators: indicatorsRes.data.indicators ?? [],
          trend: trendRes.data.rows ?? [],
          partitionSubmissions: partitionRes.data.rows ?? [],
          partitionSubmissionsNew: partitionRes.data.rowsNew ?? [],
          viewHistogram: histogramRes.data.rows ?? [],
          viewHistogramNew: histogramRes.data.rowsNew ?? [],
        });
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

  useEffect(() => {
    if (!isMobile) {
      setFilterDrawerOpen(false);
    }
  }, [isMobile]);

  const handleRangeChange = (dates) => {
    setRange(dates);
    if (isMobile) {
      setFilterDrawerOpen(false);
    }
  };

  const filterBlock = <OverviewFilter value={range} onRangeChange={handleRangeChange} />;

  return (
    <div className="overview-page">
      <div className="overview-layout">
        {!isMobile && (
          <aside className="overview-sidebar" aria-label="筛选条件">
            <Card className="overview-panel overview-panel--filter" bordered={false} title="筛选条件">
              {filterBlock}
            </Card>
          </aside>
        )}

        {isMobile && (
          <>
            <div className="overview-mobile-filter-bar">
              <Button
                type="default"
                className="overview-mobile-filter-btn"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
                aria-expanded={filterDrawerOpen}
                aria-controls="overview-filter-drawer"
              >
                筛选条件
              </Button>
            </div>
            <Drawer
              id="overview-filter-drawer"
              title="筛选条件"
              placement="left"
              width={320}
              open={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              destroyOnClose={false}
              className="overview-filter-drawer"
              styles={{ body: { paddingTop: 12 } }}
            >
              {filterBlock}
            </Drawer>
          </>
        )}

        <div className="overview-main-scroll">
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

          <OverviewTrendChart trend={payload?.trend ?? []} />

          <OverviewPartitionPieChart
            rows={payload?.partitionSubmissions ?? []}
            rowsNew={payload?.partitionSubmissionsNew ?? []}
          />

          <OverviewViewHistogramChart
            rows={payload?.viewHistogram ?? []}
            rowsNew={payload?.viewHistogramNew ?? []}
            asOfDate={range?.[1] ? range[1].format('YYYY-MM-DD') : undefined}
          />

          {/* <Card className="overview-panel overview-panel--mock" bordered={false} title="明细表（占位）">
            <div className="overview-mock-block" role="presentation">
              <Text type="secondary">此处为明细表格占位（MOCK）。</Text>
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
