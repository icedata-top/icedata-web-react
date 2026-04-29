import { Card, Tag, Typography } from 'antd';

const { Text } = Typography;

const typeLabelMap = {
  video: '歌曲',
  vocal: '虚拟歌手',
  producer: '创作者',
};

/**
 * @param {object} props
 * @param {import('../../../services/UniSeek/uniseek.api.js').SeekItem} props.item
 */
export default function UniSeekItem({ item }) {
  const tagText = typeLabelMap[item.type] ?? item.type;

  return (
    <Card className="uniseek-item-card" bordered={false}>
      <div className="uniseek-item-top">
        <Tag className="uniseek-item-tag">{tagText}</Tag>
        <Text type="secondary" className="uniseek-item-id">
          ID {item.id}
        </Text>
      </div>

      <div className="uniseek-item-title">{item.title}</div>
      <div className="uniseek-item-subtitle">{item.subTitle}</div>

      {item.type === 'video' ? (
        <div className="uniseek-item-meta">
          <span>播放 {item.play ?? 0}</span>
          <span>收藏 {item.favorite ?? 0}</span>
          <span>点赞 {item.like ?? 0}</span>
        </div>
      ) : null}

      {item.type === 'vocal' ? (
        <div className="uniseek-item-meta">
          <span>曲目 {item.songCount ?? 0}</span>
          <span>关注 {item.followerCount ?? 0}</span>
        </div>
      ) : null}

      {item.type === 'producer' ? (
        <div className="uniseek-item-meta">
          <span>粉丝 {item.fanCount ?? 0}</span>
          <span>投稿 {item.videoCount ?? 0}</span>
        </div>
      ) : null}
    </Card>
  );
}
