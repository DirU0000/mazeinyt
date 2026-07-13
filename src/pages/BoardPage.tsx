import { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterPills from '../components/filters/FilterPills';
import { useI18n } from '../i18n/I18nContext';
import { useBoardList } from '../hooks/useBoard';
import type { BoardCategory } from '../types/board';
import { formatDateTime } from '../utils/format';
import './BoardPage.css';

type CategoryFilter = 'all' | BoardCategory;

const categoryFilterOptions: { value: CategoryFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'board.cat.all' },
  { value: 'info', labelKey: 'board.cat.info' },
  { value: 'suggestion', labelKey: 'board.cat.suggestion' },
];

export default function BoardPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const { posts, loading, error } = useBoardList(
    filter === 'all' ? undefined : filter,
  );

  return (
    <section>
      <h1 className="page-heading">{t('board.h1')}</h1>
      <p className="page-intro">{t('board.desc')}</p>

      <div className="board-toolbar">
        <FilterPills
          options={categoryFilterOptions}
          value={filter}
          onChange={setFilter}
          ariaLabel={t('board.cat.aria')}
        />
        <Link className="btn board-toolbar__write" to="/board/write">
          {t('board.write')}
        </Link>
      </div>

      {loading && <p className="video-list__status">{t('common.loading')}</p>}
      {error && (
        <p className="video-list__status video-list__status--error">
          {t('board.error', { msg: error })}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="video-list__status">{t('board.empty')}</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <ul className="board-list">
          {posts.map((post) => (
            <li key={post.id} className="board-row">
              <Link className="board-row__link" to={`/board/${post.id}`}>
                <span
                  className={`board-row__cat board-row__cat--${post.category}`}
                >
                  {t(`board.cat.${post.category}`)}
                </span>
                <span className="board-row__title">{post.title}</span>
                <span className="board-row__meta">
                  {post.nickname} · {formatDateTime(post.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
