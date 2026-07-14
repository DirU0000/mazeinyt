import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSeoOverride } from '../components/seo/SeoOverrideContext';
import { useI18n } from '../i18n/I18nContext';
import {
  LANDING_COUNTRIES,
  landingContent,
  type LandingCountry,
} from '../i18n/landingContent';
import { SITE_NAME, SITE_URL } from '../config/site';
import NotFoundPage from './NotFoundPage';
import './TrendCountryPage.css';

function isLandingCountry(value: string | undefined): value is LandingCountry {
  return !!value && (LANDING_COUNTRIES as string[]).includes(value);
}

export default function TrendCountryPage() {
  const { country } = useParams();
  const { t, lang } = useI18n();

  const valid = isLandingCountry(country);
  const page = valid ? landingContent[country][lang] : undefined;

  // 매 렌더마다 새 객체를 넘기면 useSeoOverride의 effect가 무한 반복되므로 메모이즈한다.
  const override = useMemo(
    () =>
      page
        ? {
            title: `${page.title} | ${SITE_NAME}`,
            description: page.description,
            structuredData: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: page.title,
              description: page.description,
              url: `${SITE_URL}/trend/${country}`,
              inLanguage: lang,
            },
          }
        : null,
    [page, country, lang],
  );

  useSeoOverride(override);

  if (!valid || !page) return <NotFoundPage />;

  const otherCountries = LANDING_COUNTRIES.filter((c) => c !== country);

  return (
    <article className="landing-page">
      <h1 className="landing-page__title">{page.title}</h1>
      {page.intro.map((para, i) => (
        <p key={i} className="landing-page__intro">
          {para}
        </p>
      ))}

      <p className="landing-page__cta">
        <Link to="/" className="landing-page__cta-link">
          {page.cta} →
        </Link>
      </p>

      {page.sections.map((section) => (
        <section key={section.heading} className="landing-page__section">
          <h2 className="landing-page__heading">{section.heading}</h2>
          {section.body.map((para, i) => (
            <p key={i} className="landing-page__body">
              {para}
            </p>
          ))}
        </section>
      ))}

      <nav className="landing-page__related" aria-label={t('landing.related')}>
        <h2 className="landing-page__heading">{t('landing.related')}</h2>
        <p className="landing-page__related-group">
          <span className="landing-page__related-label">
            {t('landing.otherCountries')}:
          </span>{' '}
          {otherCountries.map((c, i) => (
            <span key={c}>
              {i > 0 && ' · '}
              <Link to={`/trend/${c}`}>{landingContent[c][lang].title}</Link>
            </span>
          ))}
        </p>
        <ul className="landing-page__related-list">
          <li>
            <Link to="/keywords">{t('landing.toKeywords')}</Link>
          </li>
          <li>
            <Link to="/channels">{t('landing.toChannels')}</Link>
          </li>
          <li>
            <Link to="/guide">{t('landing.toGuide')}</Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
