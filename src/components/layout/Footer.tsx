import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './Footer.css';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="app-footer">
      <nav className="app-footer__links">
        <Link to="/about">{t('footer.about')}</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
        <Link to="/terms">{t('footer.terms')}</Link>
      </nav>
      <p className="app-footer__copyright">{t('footer.copyright')}</p>
    </footer>
  );
}
