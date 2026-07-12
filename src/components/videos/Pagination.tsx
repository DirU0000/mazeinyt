import { useI18n } from '../../i18n/I18nContext';
import './Pagination.css';

export default function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  const { t } = useI18n();
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label={t('pagination.aria')}>
      <button
        type="button"
        className="pagination__btn"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        {t('pagination.prev')}
      </button>
      <span className="pagination__status">
        {page + 1} / {pageCount}
      </span>
      <button
        type="button"
        className="pagination__btn"
        disabled={page >= pageCount - 1}
        onClick={() => onChange(page + 1)}
      >
        {t('pagination.next')}
      </button>
    </nav>
  );
}
