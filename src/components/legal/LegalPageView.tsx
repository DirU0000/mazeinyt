import type { LegalPage } from '../../i18n/legalContent';
import './LegalPageView.css';

export default function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <article className="legal-page">
      <h1 className="legal-page__title">{page.title}</h1>
      {page.updated && <p className="legal-page__updated">{page.updated}</p>}
      {page.sections.map((section) => (
        <section key={section.heading} className="legal-page__section">
          <h2 className="legal-page__heading">{section.heading}</h2>
          {section.body.map((para, i) => (
            <p key={i} className="legal-page__body">
              {para}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
