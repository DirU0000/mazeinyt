import Icon, { type IconName } from '../icons/Icon';
import { useI18n } from '../../i18n/I18nContext';
import './IconSelect.css';

export default function IconSelect<T extends string>({
  icon,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  icon: IconName;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; labelKey: string }[];
  ariaLabel: string;
}) {
  const { t } = useI18n();
  return (
    <label className="icon-select">
      <Icon name={icon} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
