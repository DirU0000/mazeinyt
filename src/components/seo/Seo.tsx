import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { SITE_URL } from '../../config/site';
import { useSeoOverrideValue } from './SeoOverrideContext';

const ROUTE_SEO_KEY: Record<string, string> = {
  '/': 'videos',
  '/keywords': 'keywords',
  '/channels': 'channels',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/about': 'about',
};

const KEYWORD_KEYS = new Set(['videos', 'keywords', 'channels']);

const OG_LOCALE: Record<string, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
};

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ID = 'seo-jsonld-override';

function setStructuredData(data: Record<string, unknown> | undefined) {
  const existing = document.getElementById(JSONLD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = JSONLD_ID;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeMeta(name: string, attr: 'name' | 'property' = 'name') {
  document.head.querySelector(`meta[${attr}="${name}"]`)?.remove();
}

/**
 * 라우트·언어가 바뀔 때마다 title/description/canonical/OG 태그를 갱신한다.
 * 개별 페이지가 useSeoOverride()로 값을 지정하면 그걸 우선 사용한다 (영상 상세 페이지 등).
 */
export default function Seo() {
  const { pathname } = useLocation();
  const { t, lang } = useI18n();
  const override = useSeoOverrideValue();

  useEffect(() => {
    const key = ROUTE_SEO_KEY[pathname] ?? 'videos';
    const title = override?.title ?? t(`seo.${key}.title`);
    const description = override?.description ?? t(`seo.${key}.description`);
    const url = `${SITE_URL}${pathname}`;

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:locale', OG_LOCALE[lang] ?? 'ko_KR', 'property');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setCanonical(url);

    if (KEYWORD_KEYS.has(key)) {
      setMeta('keywords', t(`seo.${key}.keywords`));
    } else {
      removeMeta('keywords');
    }

    if (override?.image) {
      setMeta('og:image', override.image, 'property');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:image', override.image);
    } else {
      removeMeta('og:image', 'property');
      setMeta('twitter:card', 'summary');
      removeMeta('twitter:image');
    }

    setStructuredData(override?.structuredData);
  }, [pathname, lang, t, override]);

  return null;
}
