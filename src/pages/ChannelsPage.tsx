import { useState } from 'react';
import FilterPills from '../components/filters/FilterPills';
import Icon from '../components/icons/Icon';
import { channelModeOptions, countryOptions } from '../data/options';
import { useI18n } from '../i18n/I18nContext';
import { useChannelSurge } from '../hooks/useChannelSurge';
import type { ChannelSurgeMode, Country } from '../types/video';
import { formatCount, formatRatio } from '../utils/format';
import './ChannelsPage.css';

function tierLabel(
  t: (key: string, params?: Record<string, string | number>) => string,
  min?: number,
  max?: number | null,
) {
  if (min === undefined) return null;
  if (max === null || max === undefined) {
    return t('channels.tierAbove', { min: formatCount(min) });
  }
  return t('channels.tierRange', { min: formatCount(min), max: formatCount(max) });
}

export default function ChannelsPage() {
  const { t } = useI18n();
  const [country, setCountry] = useState<Country>('global');
  const [mode, setMode] = useState<ChannelSurgeMode>('segmented');
  const { channels, loading, error } = useChannelSurge(country, mode);

  return (
    <section>
      <h1 className="page-heading">{t('channels.h1')}</h1>
      <p className="channels-page__desc">{t('channels.desc')}</p>
      <p className="page-guide">{t('channels.guide')}</p>

      <div className="channels-page__filter">
        <span className="filter-bar__label">{t('filter.country')}</span>
        <FilterPills
          options={countryOptions}
          value={country}
          onChange={setCountry}
          ariaLabel={t('filter.countryAria')}
        />
      </div>

      <div className="channels-page__filter">
        <span className="filter-bar__label">{t('filter.channelMode')}</span>
        <FilterPills
          options={channelModeOptions}
          value={mode}
          onChange={setMode}
          ariaLabel={t('filter.channelModeAria')}
        />
      </div>

      {loading && <p className="video-list__status">{t('common.loading')}</p>}
      {error && (
        <p className="video-list__status video-list__status--error">
          {t('channels.error', { msg: error })}
        </p>
      )}

      {!loading && !error && (
        <ol className="channel-list">
          {channels.map((ch, i) => (
            <li key={ch.channelId} className="channel-row">
              <div className="channel-row__top">
                <span className={`channel-row__rank${i < 3 ? ' is-top' : ''}`}>
                  {i + 1}
                </span>
                <a
                  className="channel-row__name"
                  href={ch.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ch.channelName}
                </a>
                {mode === 'segmented' && (
                  <span className="channel-row__tier">
                    {tierLabel(t, ch.tierMin, ch.tierMax)}
                  </span>
                )}
                <span className="channel-row__ratio">
                  {t('channels.ratio', { n: formatRatio(ch.ratio) })}
                </span>
              </div>
              <div className="channel-row__stats">
                <span className="channel-row__stat">
                  <Icon name="users" />
                  {t('channels.statSubscribers', { n: formatCount(ch.subscriberCount) })}
                </span>
                <span className="channel-row__stat">
                  <Icon name="chart" />
                  {t('channels.statRecentAvg', { n: formatCount(ch.recentAvgViews) })}
                </span>
                <span className="channel-row__stat channel-row__stat--peer">
                  <Icon name="globe" />
                  {t('channels.statPeerAvg', { n: formatCount(ch.peerAverageViews) })}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
