import Icon from '../icons/Icon';
import { useI18n } from '../../i18n/I18nContext';
import './Header.css';

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Icon name="flame" className="app-header__logo-icon" />
        <span className="app-header__logo-text">maze</span>
      </div>
      <p className="app-header__tagline">{t('tagline')}</p>
    </header>
  );
}
