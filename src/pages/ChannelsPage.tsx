import { useState } from 'react';
import FilterPills from '../components/filters/FilterPills';
import Icon from '../components/icons/Icon';
import { countryOptions } from '../data/options';
import { useI18n } from '../i18n/I18nContext';
import { useChannelSurge } from '../hooks/useChannelSurge';
import type { Country } from '../types/video';
import { formatCount, formatRatio } from '../utils/format';
import './ChannelsPage.css';

export default function ChannelsPage() {
  const { t } = useI18n();
  const [country, setCountry] = useState<Country>('global');
  const { channels, loading, error } = useChannelSurge(country);

  return (
    <section>
      <h1 className="page-heading">{t('channels.h1')}</h1>
      <p className="channels-page__desc">{t('channels.desc')}</p>

      <div className="channels-page__filter">
        <span className="filter-bar__label">{t('filter.country')}</span>
        <FilterPills
          options={countryOptions}
          value={country}
          onChange={setCountry}
          ariaLabel={t('filter.countryAria')}
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
              <span className="channel-row__ratio">
                {t('channels.ratio', { n: formatRatio(ch.ratio) })}
              </span>
              <span className="channel-row__meta">
                <Icon name="users" />
                {formatCount(ch.subscriberCount)}
                <Icon name="chart" />
                {formatCount(ch.trendingViews)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
