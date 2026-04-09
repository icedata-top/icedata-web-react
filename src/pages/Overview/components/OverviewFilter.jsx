import { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const { RangePicker } = DatePicker;

/** 最近 7 天 / 30 天（含当天） */
export const overviewRangePresets = [
  {
    label: '最近7天',
    value: [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')],
  },
  {
    label: '最近30天',
    value: [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')],
  },
];

/**
 * @param {object} props
 * @param {string} [props.startTime] YYYY-MM-DD
 * @param {string} [props.endTime] YYYY-MM-DD
 * @param {(next: { startTime?: string, endTime?: string }) => void} [props.onFilterChange]
 */
export default function OverviewFilter({ startTime, endTime, onFilterChange }) {
  const initialRange = useMemo(() => {
    if (startTime && endTime) return [dayjs(startTime), dayjs(endTime)];
    return null;
  }, [startTime, endTime]);

  const [draftRange, setDraftRange] = useState(initialRange);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty) return;
    setDraftRange(initialRange);
  }, [initialRange, dirty]);

  const handleRangeChange = (dates) => {
    setDraftRange(dates);
    const nextStart = dates?.[0]?.format('YYYY-MM-DD');
    const nextEnd = dates?.[1]?.format('YYYY-MM-DD');
    setDirty(nextStart !== startTime || nextEnd !== endTime);
  };

  const handleReset = () => {
    setDraftRange(initialRange);
    setDirty(false);
  };

  const handleConfirm = () => {
    const nextStart = draftRange?.[0]?.format('YYYY-MM-DD');
    const nextEnd = draftRange?.[1]?.format('YYYY-MM-DD');
    onFilterChange?.({ startTime: nextStart, endTime: nextEnd });
    setDirty(false);
  };

  return (
    <div className="overview-filter">
      <RangePicker
        value={draftRange}
        presets={overviewRangePresets}
        onChange={handleRangeChange}
        allowClear
        format="YYYY-MM-DD"
        placeholder={['开始日期', '结束日期']}
        aria-label="日期范围"
      />
      {dirty ? (
        <div className="overview-filter-actions">
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </div>
      ) : null}
    </div>
  );
}
