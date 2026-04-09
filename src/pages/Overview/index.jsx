import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Spin, Typography, message } from 'antd';
import OverviewFilter from './components/OverviewFilter.jsx';
import OverviewTrendChart from './components/OverviewTrendChart.jsx';
import OverviewPartitionPieChart from './components/OverviewPartitionPieChart.jsx';
import OverviewViewHistogramChart from './components/OverviewViewHistogramChart.jsx';
import IndicatorCell from './components/IndicatorCell.jsx';
import { ApiError } from '../../services/http/client.js';
import {
  fetchOverviewIndicators,
  fetchOverviewPartitionSubmissions,
  fetchOverviewTrend,
  fetchOverviewViewHistogram,
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
  const [filter, setFilter] = useState(() => {
    const [start, end] = defaultRange();
    return {
      startTime: start.format('YYYY-MM-DD'),
      endTime: end.format('YYYY-MM-DD'),
    };
  });
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    indicators: [],
    trend: [],
    partitionSubmissions: [],
    viewHistogram: [],
  });
  const [partitionScope, setPartitionScope] = useState('all');
  const [histogramScope, setHistogramScope] = useState('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const showApiError = useCallback((err) => {
    if (err instanceof ApiError) {
      message.error(`[${err.code}] ${err.message}`);
      return;
    }
    message.error(err?.message || '请求失败');
  }, []);

  const loadMain = useCallback((startDate, endDate) => {
    setLoading(true);
    Promise.all([
      fetchOverviewIndicators(startDate, endDate),
      fetchOverviewTrend(startDate, endDate),
    ])
      .then(([indicatorsData, trendData]) => {
        setPayload((prev) => ({
          ...prev,
          indicators: indicatorsData?.indicators ?? [],
          trend: trendData?.rows ?? [],
        }));
      })
      .catch((err) => {
        setPayload((prev) => ({ ...prev, indicators: [], trend: [] }));
        showApiError(err);
      })
      .finally(() => setLoading(false));
  }, [showApiError]);

  const loadPartition = useCallback(
    (startDate, endDate, scope) => {
      fetchOverviewPartitionSubmissions(startDate, endDate, scope)
        .then((data) => {
          setPayload((prev) => ({ ...prev, partitionSubmissions: data?.rows ?? [] }));
        })
        .catch((err) => {
          setPayload((prev) => ({ ...prev, partitionSubmissions: [] }));
          showApiError(err);
        });
    },
    [showApiError],
  );

  const loadHistogram = useCallback(
    (startDate, endDate, scope) => {
      fetchOverviewViewHistogram(startDate, endDate, scope)
        .then((data) => {
          setPayload((prev) => ({ ...prev, viewHistogram: data?.rows ?? [] }));
        })
        .catch((err) => {
          setPayload((prev) => ({ ...prev, viewHistogram: [] }));
          showApiError(err);
        });
    },
    [showApiError],
  );

  useEffect(() => {
    if (filter?.startTime && filter?.endTime) {
      loadMain(filter.startTime, filter.endTime);
    } else {
      setPayload({ indicators: [], trend: [], partitionSubmissions: [], viewHistogram: [] });
    }
  }, [filter, loadMain]);

  useEffect(() => {
    if (!filter?.startTime || !filter?.endTime) return;
    loadPartition(filter.startTime, filter.endTime, partitionScope);
  }, [filter, partitionScope, loadPartition]);

  useEffect(() => {
    if (!filter?.startTime || !filter?.endTime) return;
    loadHistogram(filter.startTime, filter.endTime, histogramScope);
  }, [filter, histogramScope, loadHistogram]);

  useEffect(() => {
    if (!isMobile) {
      setFilterDrawerOpen(false);
    }
  }, [isMobile]);

  const handleFilterChange = ({ startTime, endTime }) => {
    setFilter({ startTime, endTime });
    if (isMobile) {
      setFilterDrawerOpen(false);
    }
  };

  const filterBlock = (
    <OverviewFilter
      startTime={filter?.startTime}
      endTime={filter?.endTime}
      onFilterChange={handleFilterChange}
    />
  );

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
                {!filter?.startTime || !filter?.endTime ? (
                  <Text type="secondary">请选择日期范围以查看指标。</Text>
                ) : payload?.indicators?.length ? (
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
            scope={partitionScope}
            onScopeChange={setPartitionScope}
          />

          <OverviewViewHistogramChart
            rows={payload?.viewHistogram ?? []}
            asOfDate={filter?.endTime}
            scope={histogramScope}
            onScopeChange={setHistogramScope}
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
