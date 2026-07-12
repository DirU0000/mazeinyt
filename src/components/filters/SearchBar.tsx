import Icon from '../icons/Icon';
import { useI18n } from '../../i18n/I18nContext';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useI18n();
  return (
    <label className="search-bar">
      <Icon name="search" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        aria-label={t('search.aria')}
      />
    </label>
  );
}
