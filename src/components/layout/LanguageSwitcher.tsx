import Icon from '../icons/Icon';
import { useI18n } from '../../i18n/I18nContext';
import { LANGUAGES, type Lang } from '../../i18n/translations';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <label className="lang-switcher">
      <Icon name="globe" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t('lang.aria')}
      >
        {LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
