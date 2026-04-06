import { DatePicker } from 'antd';
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
 * @param {import('dayjs').Dayjs[] | null} [props.value] 受控区间
 * @param {(dates: import('dayjs').Dayjs[] | null, dateStrings: [string, string]) => void} [props.onRangeChange] 同 RangePicker onChange
 */
export default function OverviewFilter({ value, onRangeChange }) {
  return (
    <div className="overview-filter">
      <RangePicker
        value={value}
        presets={overviewRangePresets}
        onChange={onRangeChange}
        allowClear
        format="YYYY-MM-DD"
        placeholder={['开始日期', '结束日期']}
        aria-label="日期范围"
      />
    </div>
  );
}
