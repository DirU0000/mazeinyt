import type { Keyword } from '../../types/keyword';
import { useI18n } from '../../i18n/I18nContext';
import Icon from '../icons/Icon';
import './KeywordColumn.css';

export default function KeywordColumn({
  label,
  keywords,
}: {
  label: string;
  keywords: Keyword[];
}) {
  const { t } = useI18n();
  return (
    <div className="keyword-column">
      <h3 className="keyword-column__title">
        <Icon name="globe" />
        {label}
      </h3>
      {keywords.length === 0 ? (
        <p className="keyword-column__empty">{t('keywords.empty')}</p>
      ) : (
        <ol className="keyword-column__list">
          {keywords.map((kw, i) => (
            <li key={kw.word} className="keyword-column__item">
              <span
                className={`keyword-column__rank${i < 3 ? ' is-top' : ''}`}
              >
                {i + 1}
              </span>
              <span className="keyword-column__word">{kw.word}</span>
              <span className="keyword-column__count">
                {t('common.count', { n: kw.count })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
