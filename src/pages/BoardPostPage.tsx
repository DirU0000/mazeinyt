import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSeoOverride } from '../components/seo/SeoOverrideContext';
import { useI18n } from '../i18n/I18nContext';
import { useBoardPost } from '../hooks/useBoard';
import { deletePost } from '../utils/boardApi';
import { formatDateTime } from '../utils/format';
import './BoardPage.css';

export default function BoardPostPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  const { post, loading, error } = useBoardPost(numericId);

  const seoOverride = useMemo(() => {
    if (!post) return null;
    return { title: `${post.title} — maze`, description: post.body.slice(0, 140) };
  }, [post]);
  useSeoOverride(seoOverride);

  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (loading) {
    return <p className="video-list__status">{t('common.loading')}</p>;
  }
  if (error || !post || numericId === undefined) {
    return (
      <p className="video-list__status video-list__status--error">
        {t('board.error', { msg: error ?? 'not found' })}
      </p>
    );
  }

  async function handleDelete() {
    if (numericId === undefined || password.length === 0) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(numericId, password);
      navigate('/board');
    } catch (err) {
      setDeleteError((err as Error).message);
      setDeleting(false);
    }
  }

  const edited = post.updatedAt !== post.createdAt;

  return (
    <article className="board-page-narrow board-detail">
      <Link to="/board" className="board-detail__back">
        &larr; {t('board.detail.back')}
      </Link>

      <span className={`board-row__cat board-row__cat--${post.category}`}>
        {t(`board.cat.${post.category}`)}
      </span>
      <h1 className="board-detail__title">{post.title}</h1>
      <p className="board-detail__meta">
        {post.nickname} · {formatDateTime(post.createdAt)}
        {edited && <span className="board-detail__edited"> · {t('board.edited')}</span>}
      </p>

      <div className="board-detail__body">{post.body}</div>

      <div className="board-detail__actions">
        <Link className="btn" to={`/board/${post.id}/edit`}>
          {t('board.detail.edit')}
        </Link>
        {!confirming && (
          <button
            type="button"
            className="btn board-detail__delete"
            onClick={() => setConfirming(true)}
          >
            {t('board.detail.delete')}
          </button>
        )}
      </div>

      {confirming && (
        <div className="board-detail__delete-box">
          <p>{t('board.detail.deleteConfirm')}</p>
          <div className="board-detail__delete-row">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('board.form.password')}
            />
            <button
              type="button"
              className="btn board-detail__delete"
              disabled={password.length === 0 || deleting}
              onClick={handleDelete}
            >
              {deleting ? t('board.form.submitting') : t('board.detail.delete')}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setConfirming(false);
                setPassword('');
                setDeleteError(null);
              }}
            >
              {t('board.form.cancel')}
            </button>
          </div>
          {deleteError && <p className="board-form__error">{deleteError}</p>}
        </div>
      )}
    </article>
  );
}
