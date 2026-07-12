import type { Video } from '../../types/video';
import { useI18n } from '../../i18n/I18nContext';
import VideoCard from './VideoCard';
import './VideoList.css';

export default function VideoList({ videos }: { videos: Video[] }) {
  const { t } = useI18n();

  if (videos.length === 0) {
    return <p className="video-list__empty">{t('video.empty')}</p>;
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
