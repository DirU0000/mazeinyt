// 빌드 후 실행: 크롤러·심사자가 JavaScript 없이도 실제 콘텐츠를 볼 수 있도록 정적 HTML을 만든다.
//
// 두 종류를 생성한다.
//  1) 정적 콘텐츠 페이지(privacy/terms/about/guide + 국가별 랜딩 /trend/*): 고유 본문을 통째로 프리렌더.
//  2) 데이터 의존 페이지(홈 '/' · /keywords · /channels): 실시간 데이터는 넣지 못하지만,
//     각 페이지의 제목·소개·가이드 문단과 내부 링크를 #root에 심어, 크롤러가 빈 껍데기 대신
//     키워드가 담긴 실제 텍스트를 보게 한다. (JS 로드 시 createRoot가 #root를 다시 렌더링해 덮어씀)
//
// vercel.json의 rewrites는 파일시스템에 실제 파일이 있으면 그걸 우선 서빙하므로
// dist/<route>.html을 만들어두면 SPA 폴백보다 먼저 이 정적 파일이 서빙된다.
// 클라이언트 main.tsx는 createRoot(하이드레이션 아님)라서 하이드레이션 불일치 경고가 없다.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const { privacyContent, termsContent, aboutContent } = await import(
  pathToFileURL(path.join(root, 'src/i18n/legalContent.ts')).href
);
const { guideContent } = await import(
  pathToFileURL(path.join(root, 'src/i18n/guideContent.ts')).href
);
const { translations } = await import(
  pathToFileURL(path.join(root, 'src/i18n/translations.ts')).href
);
const { landingContent, LANDING_COUNTRIES } = await import(
  pathToFileURL(path.join(root, 'src/i18n/landingContent.ts')).href
);

// index.html의 lang="ko" 기본 언어에 맞춰 한국어 콘텐츠로 프리렌더한다.
// (다른 언어는 JS 로드 후 클라이언트에서 정상적으로 전환된다.)
const LANG = 'ko';
const SITE_URL = 'https://mazeinyt.com';
const SITE_NAME = 'maze';
const t = translations[LANG];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLinkList(links) {
  const items = links
    .map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`)
    .join('\n        ');
  return `<nav class="prerender-links" aria-label="${escapeHtml(t['landing.related'])}">
      <h2>${escapeHtml(t['landing.related'])}</h2>
      <ul>
        ${items}
      </ul>
    </nav>`;
}

// 데이터 의존 페이지가 프리렌더 시 공통으로 참고할 내부 링크 (국가별 랜딩 + 가이드).
const COMMON_LINKS = [
  { href: '/trend/kr', label: t['footer.krTrend'] },
  { href: '/trend/us', label: t['footer.usTrend'] },
  { href: '/trend/jp', label: t['footer.jpTrend'] },
  { href: '/keywords', label: t['landing.toKeywords'] },
  { href: '/channels', label: t['landing.toChannels'] },
  { href: '/guide', label: t['landing.toGuide'] },
];

function renderIntroBlock({ h1, desc, guide, links }) {
  return `<section class="prerender-intro">
      <h1>${escapeHtml(h1)}</h1>
      <p>${escapeHtml(desc)}</p>
      <p>${escapeHtml(guide)}</p>
      ${renderLinkList(links)}
    </section>`;
}

function renderLegalPage(page) {
  const updated = page.updated
    ? `<p class="legal-page__updated">${escapeHtml(page.updated)}</p>`
    : '';
  const sections = page.sections
    .map(
      (section) => `
      <section class="legal-page__section">
        <h2 class="legal-page__heading">${escapeHtml(section.heading)}</h2>
        ${section.body.map((p) => `<p class="legal-page__body">${escapeHtml(p)}</p>`).join('\n        ')}
      </section>`,
    )
    .join('\n');

  return `<article class="legal-page">
      <h1 class="legal-page__title">${escapeHtml(page.title)}</h1>
      ${updated}${sections}
    </article>`;
}

function renderLandingPage(page, country) {
  const intro = page.intro
    .map((p) => `<p class="landing-page__intro">${escapeHtml(p)}</p>`)
    .join('\n      ');
  const sections = page.sections
    .map(
      (section) => `
      <section class="landing-page__section">
        <h2 class="landing-page__heading">${escapeHtml(section.heading)}</h2>
        ${section.body.map((p) => `<p class="landing-page__body">${escapeHtml(p)}</p>`).join('\n        ')}
      </section>`,
    )
    .join('\n');

  const others = LANDING_COUNTRIES.filter((c) => c !== country)
    .map(
      (c) =>
        `<a href="/trend/${c}">${escapeHtml(landingContent[c][LANG].title)}</a>`,
    )
    .join(' · ');

  const relatedLinks = renderLinkList([
    { href: '/keywords', label: t['landing.toKeywords'] },
    { href: '/channels', label: t['landing.toChannels'] },
    { href: '/guide', label: t['landing.toGuide'] },
  ]);

  return `<article class="landing-page">
      <h1 class="landing-page__title">${escapeHtml(page.title)}</h1>
      ${intro}
      <p class="landing-page__cta"><a class="landing-page__cta-link" href="/">${escapeHtml(page.cta)} →</a></p>
      ${sections}
      <p class="landing-page__related-group"><strong>${escapeHtml(t['landing.otherCountries'])}:</strong> ${others}</p>
      ${relatedLinks}
    </article>`;
}

function patchHead(html, { title, description, url }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
    );
}

function writePage({ file, title, description, url, bodyHtml }) {
  const withHead = patchHead(template, { title, description, url });
  const html = withHead.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`,
  );
  const outPath = path.join(distDir, file);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`prerendered: /${file}`);
}

const template = readFileSync(indexHtmlPath, 'utf8');

// 1) 정적 법적/가이드 페이지
const LEGAL_ROUTES = [
  { path: 'privacy', seoKey: 'privacy', content: privacyContent[LANG] },
  { path: 'terms', seoKey: 'terms', content: termsContent[LANG] },
  { path: 'about', seoKey: 'about', content: aboutContent[LANG] },
  { path: 'guide', seoKey: 'guide', content: guideContent[LANG] },
];

for (const route of LEGAL_ROUTES) {
  writePage({
    file: `${route.path}.html`,
    title: t[`seo.${route.seoKey}.title`],
    description: t[`seo.${route.seoKey}.description`],
    url: `${SITE_URL}/${route.path}`,
    bodyHtml: renderLegalPage(route.content),
  });
}

// 2) 국가별 랜딩 페이지 (/trend/us · /trend/jp · /trend/kr)
for (const country of LANDING_COUNTRIES) {
  const page = landingContent[country][LANG];
  writePage({
    file: `trend/${country}.html`,
    title: `${page.title} | ${SITE_NAME}`,
    description: page.description,
    url: `${SITE_URL}/trend/${country}`,
    bodyHtml: renderLandingPage(page, country),
  });
}

// 3) 데이터 의존 페이지: keywords · channels (별도 .html + rewrite)
const DATA_ROUTES = [
  { path: 'keywords', seoKey: 'keywords', h1Key: 'keywords.h1', descKey: 'keywords.desc', guideKey: 'keywords.guide' },
  { path: 'channels', seoKey: 'channels', h1Key: 'channels.h1', descKey: 'channels.desc', guideKey: 'channels.guide' },
];

for (const route of DATA_ROUTES) {
  writePage({
    file: `${route.path}.html`,
    title: t[`seo.${route.seoKey}.title`],
    description: t[`seo.${route.seoKey}.description`],
    url: `${SITE_URL}/${route.path}`,
    bodyHtml: renderIntroBlock({
      h1: t[route.h1Key],
      desc: t[route.descKey],
      guide: t[route.guideKey],
      links: COMMON_LINKS,
    }),
  });
}

// 4) 홈('/'): dist/index.html의 빈 #root에 소개 문단 + 내부 링크를 심는다.
//    (index.html은 SPA 폴백으로도 쓰이므로 head는 이미 홈 기준으로 맞춰져 있어 본문만 주입)
const homeBody = renderIntroBlock({
  h1: t['videos.h1'],
  desc: t['videos.desc'],
  guide: t['videos.guide'],
  links: COMMON_LINKS,
});
const homeHtml = template.replace(
  '<div id="root"></div>',
  `<div id="root">${homeBody}</div>`,
);
writeFileSync(indexHtmlPath, homeHtml, 'utf8');
console.log('prerendered: / (index.html)');
