import LegalPageView from '../components/legal/LegalPageView';
import { useI18n } from '../i18n/I18nContext';
import { termsContent } from '../i18n/legalContent';

export default function TermsPage() {
  const { lang } = useI18n();
  return <LegalPageView page={termsContent[lang]} />;
}
