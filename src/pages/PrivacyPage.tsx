import LegalPageView from '../components/legal/LegalPageView';
import { useI18n } from '../i18n/I18nContext';
import { privacyContent } from '../i18n/legalContent';

export default function PrivacyPage() {
  const { lang } = useI18n();
  return <LegalPageView page={privacyContent[lang]} />;
}
