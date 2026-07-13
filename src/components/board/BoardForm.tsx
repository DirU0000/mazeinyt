import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import type { BoardCategory } from '../../types/board';
import './BoardForm.css';

export interface BoardFormValues {
  category: BoardCategory;
  nickname: string;
  password: string;
  title: string;
  body: string;
}

export default function BoardForm({
  mode,
  initial,
  submitting,
  error,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  initial?: Partial<BoardFormValues>;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: BoardFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [category, setCategory] = useState<BoardCategory>(
    initial?.category ?? 'info',
  );
  const [nickname, setNickname] = useState(initial?.nickname ?? '');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');

  const canSubmit =
    (mode === 'edit' || nickname.trim().length > 0) &&
    password.length >= 4 &&
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    !submitting;

  return (
    <form
      className="board-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit({ category, nickname, password, title, body });
      }}
    >
      {mode === 'create' && (
        <div className="board-form__field">
          <span className="board-form__label">{t('board.form.category')}</span>
          <div className="board-form__radios">
            {(['info', 'suggestion'] as BoardCategory[]).map((c) => (
              <label key={c} className="board-form__radio">
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                />
                {t(`board.cat.${c}`)}
              </label>
            ))}
          </div>
        </div>
      )}

      {mode === 'create' && (
        <label className="board-form__field">
          <span className="board-form__label">{t('board.form.nickname')}</span>
          <input
            type="text"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t('board.form.nicknamePlaceholder')}
          />
        </label>
      )}

      <label className="board-form__field">
        <span className="board-form__label">{t('board.form.password')}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('board.form.passwordPlaceholder')}
        />
      </label>

      <label className="board-form__field">
        <span className="board-form__label">{t('board.form.title')}</span>
        <input
          type="text"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('board.form.titlePlaceholder')}
        />
      </label>

      <label className="board-form__field">
        <span className="board-form__label">{t('board.form.body')}</span>
        <textarea
          rows={10}
          maxLength={5000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('board.form.bodyPlaceholder')}
        />
      </label>

      {error && <p className="board-form__error">{error}</p>}

      <div className="board-form__actions">
        <button type="button" className="btn" onClick={onCancel}>
          {t('board.form.cancel')}
        </button>
        <button
          type="submit"
          className="btn board-form__submit"
          disabled={!canSubmit}
        >
          {submitting ? t('board.form.submitting') : t('board.form.submit')}
        </button>
      </div>
    </form>
  );
}
