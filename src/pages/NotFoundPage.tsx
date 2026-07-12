import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeoOverride } from '../components/seo/SeoOverrideContext';

export default function NotFoundPage() {
  const { t } = useI18n();

  useSeoOverride({
    title: t('seo.notfound.title'),
    description: t('seo.notfound.description'),
  });

  return (
    <section className="not-found-page">
      <h1 className="page-heading">{t('notfound.title')}</h1>
      <p className="page-intro">{t('notfound.desc')}</p>
      <p style={{ textAlign: 'center' }}>
        <Link to="/" className="btn">
          {t('notfound.backHome')}
        </Link>
      </p>
    </section>
  );
}
