import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BoardForm, {
  type BoardFormValues,
} from '../components/board/BoardForm';
import { useI18n } from '../i18n/I18nContext';
import { createPost } from '../utils/boardApi';

export default function BoardWritePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: BoardFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const post = await createPost(values);
      navigate(`/board/${post.id}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <section className="board-page-narrow">
      <Link to="/board" className="board-detail__back">
        &larr; {t('board.detail.back')}
      </Link>
      <h1 className="page-heading">{t('board.write')}</h1>
      <BoardForm
        mode="create"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/board')}
      />
    </section>
  );
}
