import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BoardForm, {
  type BoardFormValues,
} from '../components/board/BoardForm';
import { useI18n } from '../i18n/I18nContext';
import { useBoardPost } from '../hooks/useBoard';
import { updatePost } from '../utils/boardApi';

export default function BoardEditPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  const { post, loading, error } = useBoardPost(numericId);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  async function handleSubmit(values: BoardFormValues) {
    if (numericId === undefined) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updatePost(numericId, {
        password: values.password,
        title: values.title,
        body: values.body,
      });
      navigate(`/board/${numericId}`);
    } catch (err) {
      setSubmitError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <section className="board-page-narrow">
      <Link to={`/board/${post.id}`} className="board-detail__back">
        &larr; {t('board.detail.back')}
      </Link>
      <h1 className="page-heading">{t('board.detail.edit')}</h1>
      <BoardForm
        mode="edit"
        initial={{
          category: post.category,
          nickname: post.nickname,
          title: post.title,
          body: post.body,
        }}
        submitting={submitting}
        error={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/board/${post.id}`)}
      />
    </section>
  );
}
