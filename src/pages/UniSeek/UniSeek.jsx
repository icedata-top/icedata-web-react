import { useEffect, useMemo, useState } from 'react';
import { Empty, Masonry, Spin, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '../../services/http/client.js';
import { seek } from '../../services/UniSeek/uniseek.api.js';
import UniSeekFilter from './components/UniSeekFilter.jsx';
import UniSeekItem from './components/UniSeekItem.jsx';
import './UniSeek.css';

export default function UniSeek() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const items = useMemo(
    () =>
      list.map((item) => ({
        key: `${item.type}-${item.id}`,
        data: item,
      })),
    [list],
  );

  const runSearch = (nextKeyword) => {
    const trimmed = (nextKeyword ?? '').trim();
    if (!trimmed) {
      setList([]);
      return;
    }

    setLoading(true);
    seek({ keyword: trimmed })
      .then((data) => {
        setList(data?.list ?? []);
      })
      .catch((err) => {
        setList([]);
        if (err instanceof ApiError) {
          message.error(`[${err.code}] ${err.message}`);
          return;
        }
        message.error(err?.message || '搜索失败');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = (searchParams.get('keyword') ?? '').trim();
    setKeyword(q);
    if (q) runSearch(q);
    else setList([]);
  }, [searchParams]);

  const handleSearch = (nextKeyword) => {
    const keywordTrimmed = (nextKeyword ?? '').trim();
    setKeyword(keywordTrimmed);
    setSearchParams(keywordTrimmed ? { keyword: keywordTrimmed } : {});
  };

  return (
    <div className="uniseek-page">
      <div className="uniseek-filter-sticky">
        <UniSeekFilter
          keyword={keyword}
          loading={loading}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
        />
      </div>

      <div className="uniseek-result-wrap">
        <Spin spinning={loading}>
          {items.length ? (
            <Masonry
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gutter={[12, 12]}
              items={items}
              itemRender={(item) => <UniSeekItem item={item.data} />}
            />
          ) : (
            <Empty description="暂无搜索结果" />
          )}
        </Spin>
      </div>
    </div>
  );
}
