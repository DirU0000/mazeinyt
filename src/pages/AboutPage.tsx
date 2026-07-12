import LegalPageView from '../components/legal/LegalPageView';
import { useI18n } from '../i18n/I18nContext';
import { aboutContent } from '../i18n/legalContent';

export default function AboutPage() {
  const { lang } = useI18n();
  return <LegalPageView page={aboutContent[lang]} />;
}
