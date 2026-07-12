import { Link } from 'react-router-dom';
import type { Video } from '../../types/video';
import { countryLabelKey } from '../../data/options';
import { useI18n } from '../../i18n/I18nContext';
import { formatCount } from '../../utils/format';
import Icon from '../icons/Icon';
import './VideoCard.css';

export default function VideoCard({ video }: { video: Video }) {
  const { t } = useI18n();

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
