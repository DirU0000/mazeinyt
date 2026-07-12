import LegalPageView from '../components/legal/LegalPageView';
import { useI18n } from '../i18n/I18nContext';
import { guideContent } from '../i18n/guideContent';

export default function GuidePage() {
  const { lang } = useI18n();
  return <LegalPageView page={guideContent[lang]} />;
}
