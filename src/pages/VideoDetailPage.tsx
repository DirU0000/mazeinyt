import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useSeoOverride } from '../components/seo/SeoOverrideContext';
import { SITE_URL } from '../config/site';
import { useI18n } from '../i18n/I18nContext';
import { useVideoDetail } from '../hooks/useVideoDetail';
import { formatCount } from '../utils/format';
import { getChannelTier, getEngagementTier, getViralTier } from '../utils/videoInsights';
import { formatDuration, getVideoType } from '../utils/videoType';
import './VideoDetailPage.css';

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { video, loading, error, notFound } = useVideoDetail(id);

  const seoOverride = useMemo(() => {
    if (!video) return null;
    const paceDescription = t('video.insight.pace', {
      days: video.daysSincePublished,
      n: formatCount(video.viewsPerDay),
    });
    return {
      title: `${video.title} — maze`,
      description: paceDescription,
      image: video.thumbnailUrl,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: paceDescription,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: video.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        contentUrl: video.videoUrl,
        interactionStatistic: [
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/WatchAction',
            userInteractionCount: video.viewCount,
          },
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/LikeAction',
            userInteractionCount: video.likeCount,
          },
        ],
        author: {
          '@type': 'Person',
          name: video.channelName,
        },
        mainEntityOfPage: `${SITE_URL}/video/${video.id}`,
      },
    };
  }, [video, t]);

  useSeoOverride(seoOverride);

  if (loading) {
    return <p className="video-list__status">{t('common.loading')}</p>;
  }

  if (notFound) {
    return <p className="video-list__status video-list__status--error">{t('video.notFound')}</p>;
  }

  if (error || !video) {
    return (
      <p className="video-list__status video-list__status--error">
        {t('video.detailError', { msg: error ?? '' })}
      </p>
    );
  }

  const viralTier = getViralTier(video.viralRatio);
  const engagementTier = getEngagementTier(video.engagementRate);
  const channelTier = getChannelTier(video.subscriberCount);

  return (
    <article className="video-detail">
      <Link to="/" className="video-detail__back">
        &larr; {t('video.back')}
      </Link>

      <div className="video-detail__embed">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <h1 className="video-detail__title">{video.title}</h1>
      <p className="video-detail__channel">
        {video.channelName}
        <span className="video-detail__duration-badge">
          {t(`videoType.${getVideoType(video.durationSeconds)}`)} ·{' '}
          {formatDuration(video.durationSeconds)}
        </span>
      </p>

      <a
        className="btn video-detail__watch"
        href={video.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="play" />
        {t('video.watchOnYoutube')}
      </a>

      <div className="video-detail__stats">
        <div className="video-detail__stat">
          <Icon name="chart" />
          <span className="video-detail__stat-value">
            {formatCount(video.viewCount)}
          </span>
          <span className="video-detail__stat-label">{t('video.stat.views')}</span>
        </div>
        <div className="video-detail__stat">
          <Icon name="heart" />
          <span className="video-detail__stat-value">
            {formatCount(video.likeCount)}
          </span>
          <span className="video-detail__stat-label">{t('video.stat.likes')}</span>
        </div>
        <div className="video-detail__stat">
          <Icon name="users" />
          <span className="video-detail__stat-value">
            {formatCount(video.subscriberCount)}
          </span>
          <span className="video-detail__stat-label">
            {t('video.stat.subscribers')}
          </span>
        </div>
        <div className="video-detail__stat">
          <Icon name="calendar" />
          <span className="video-detail__stat-value">
            {formatCount(video.viewsPerDay)}
          </span>
          <span className="video-detail__stat-label">
            {t('video.stat.viewsPerDay')}
          </span>
        </div>
      </div>

      <section className="video-detail__analysis">
        <h2 className="video-detail__analysis-title">
          <Icon name="tag" />
          {t('video.analysisTitle')}
        </h2>
        <p>
          {t(`video.insight.channelContext.${channelTier}`, {
            name: video.channelName,
          })}
        </p>
        <p>
          {t(`video.insight.viral.${viralTier}`, {
            ratio: formatCount(video.viralRatio),
          })}
        </p>
        <p>
          {t(`video.insight.engagement.${engagementTier}`, {
            pct: video.engagementRate,
          })}
        </p>
        <p>
          {t('video.insight.pace', {
            days: video.daysSincePublished,
            n: formatCount(video.viewsPerDay),
          })}
        </p>
      </section>

      <section className="video-detail__analysis">
        <h2 className="video-detail__analysis-title">
          <Icon name="chart" />
          {t('video.insight.creatorTitle')}
        </h2>
        <p>{t(`video.insight.creator.${viralTier}`)}</p>
      </section>
    </article>
  );
}
