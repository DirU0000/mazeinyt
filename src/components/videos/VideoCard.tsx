import { Link } from 'react-router-dom';
import type { Video } from '../../types/video';
import { countryLabelKey } from '../../data/options';
import { useI18n } from '../../i18n/I18nContext';
import { formatCount } from '../../utils/format';
import { formatDuration } from '../../utils/videoType';
import Icon from '../icons/Icon';
import './VideoCard.css';

const LONG_TREND_DAYS = 14;

export default function VideoCard({ video }: { video: Video }) {
  const { t } = useI18n();
  const daysSince = Math.floor(
    (Date.now() - new Date(video.publishedAt).getTime()) / 86_400_000,
  );
  const isLongTrend = daysSince >= LONG_TREND_DAYS;

  return (
    <Link className="video-card" to={`/video/${video.id}`}>
      <div className="video-card__thumb">
        <img src={video.thumbnailUrl} alt="" loading="lazy" />
        <span className="video-card__play">
          <Icon name="play" />
        </span>
        <span className="video-card__badge">
          {t(countryLabelKey[video.country])}
        </span>
        {isLongTrend && (
          <span className="video-card__trend-badge">
            {t('video.badge.longTrend')}
          </span>
        )}
        <span className="video-card__duration">
          {formatDuration(video.durationSeconds)}
        </span>
      </div>
      <div className="video-card__body">
        <h3 className="video-card__title">{video.title}</h3>
        <p className="video-card__channel">{video.channelName}</p>
        <div className="video-card__stats">
          <span className="video-card__stat">
            <Icon name="chart" />
            {t('common.views', { n: formatCount(video.viewCount) })}
          </span>
          <span className="video-card__stat">
            <Icon name="heart" />
            {formatCount(video.likeCount)}
          </span>
          <span className="video-card__stat">
            <Icon name="users" />
            {formatCount(video.subscriberCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
