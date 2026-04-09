import { useEffect, useMemo, useRef } from 'react';
import { Card, Segmented, Typography } from 'antd';
import VChart from '@visactor/vchart';
import { getBilibiliSubPartitionName } from '../../../constants/bilibili/type.id.js';
import { useDocThemeDark } from '../../../hooks/useDocThemeDark.js';
import './OverviewPartitionPieChart.css';

const { Text } = Typography;

/** @typedef {'all' | 'new'} PartitionSubmissionScope */
/** @typedef {{ typeId: number, count: number }} PartitionSubmissionRow */

const SCOPE_ALL = 'all';
const SCOPE_NEW = 'new';

/**
 * @param {PartitionSubmissionRow[]} rows
 */
function buildPieSpec(rows) {
  if (!rows?.length) return null;

  const values = rows.map((r) => ({
    name: getBilibiliSubPartitionName(r.typeId) ?? `分区 ${r.typeId}`,
    value: r.count,
  }));

  return {
    background: 'transparent',
    type: 'pie',
    data: [{ id: 'partition', values }],
    categoryField: 'name',
    valueField: 'value',
    legends: {
      visible: true,
      orient: 'right',
      padding: { left: 16 },
    },
    tooltip: { visible: true },
    label: {
      visible: true,
      style: { fontSize: 11 },
    },
  };
}

/**
 * @param {object} props
 * @param {PartitionSubmissionRow[]} props.rows 当前 scope 分区数据
 * @param {PartitionSubmissionScope} [props.scope]
 * @param {(scope: PartitionSubmissionScope) => void} [props.onScopeChange]
 */
export default function OverviewPartitionPieChart({ rows, scope = SCOPE_ALL, onScopeChange }) {
  const hostRef = useRef(null);
  const chartRef = useRef(null);
  const isDark = useDocThemeDark();

  const activeRows = rows ?? [];
  const spec = useMemo(() => buildPieSpec(activeRows), [activeRows]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !spec) {
      if (chartRef.current) {
        chartRef.current.release();
        chartRef.current = null;
      }
      return undefined;
    }

    if (chartRef.current) {
      chartRef.current.release();
      chartRef.current = null;
    }

    const chart = new VChart(spec, {
      dom: el,
      theme: isDark ? 'dark' : 'light',
    });
    chartRef.current = chart;
    chart.renderAsync();

    const resize = () => {
      const c = chartRef.current;
      if (!c || !hostRef.current) return;
      const { width, height } = hostRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        c.resize(width, height);
      }
    };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    ro.observe(el);
    requestAnimationFrame(resize);

    return () => {
      ro.disconnect();
      if (chartRef.current) {
        chartRef.current.release();
        chartRef.current = null;
      }
    };
  }, [spec, isDark]);

  const empty = !activeRows?.length;

  return (
    <Card className="overview-panel overview-panel--partition" bordered={false} title="分区投稿分布">
      <div className="overview-partition-pie-inner">
        <div className="overview-partition-pie-toolbar">
          <span className="overview-partition-pie-toolbar-hint" aria-hidden />
          <Segmented
            className="overview-partition-pie-segmented"
            value={scope}
            onChange={(v) => onScopeChange?.(/** @type {PartitionSubmissionScope} */ (v))}
            options={[
              { label: '全部投稿', value: SCOPE_ALL },
              { label: '新投稿', value: SCOPE_NEW },
            ]}
          />
        </div>
        {empty ? (
          <div className="overview-partition-pie-empty">
            <Text type="secondary">暂无分区数据，请先选择日期范围。</Text>
          </div>
        ) : (
          <div className="overview-partition-pie-host" ref={hostRef} role="img" aria-label="各分区投稿量饼图" />
        )}
      </div>
    </Card>
  );
}
