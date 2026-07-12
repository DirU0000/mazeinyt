import { useI18n } from '../../i18n/I18nContext';
import './FilterPills.css';

export default function FilterPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; labelKey: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const { t } = useI18n();
  return (
    <div className="filter-pills" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`btn filter-pills__item${value === opt.value ? ' is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {t(opt.labelKey)}
        </button>
      ))}
    </div>
  );
}
