import KeywordColumn from '../components/keywords/KeywordColumn';
import { useI18n } from '../i18n/I18nContext';
import { useKeywords } from '../hooks/useKeywords';
import './KeywordsPage.css';

export default function KeywordsPage() {
  const { t } = useI18n();
  const { data, loading, error } = useKeywords();

  return (
    <section>
      <h1 className="page-heading">{t('keywords.h1')}</h1>
      <p className="keywords-page__desc">{t('keywords.desc')}</p>
      <p className="page-guide">{t('keywords.guide')}</p>
      {loading && <p className="video-list__status">{t('common.loading')}</p>}
      {error && (
        <p className="video-list__status video-list__status--error">
          {t('keywords.error', { msg: error })}
        </p>
      )}
      {data && (
        <div className="keywords-page__grid">
          <KeywordColumn label={t('country.us')} keywords={data.us} />
          <KeywordColumn label={t('country.jp')} keywords={data.jp} />
          <KeywordColumn label={t('country.kr')} keywords={data.kr} />
        </div>
      )}
    </section>
  );
}
