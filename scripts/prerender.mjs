// 빌드 후 실행: 데이터 의존성이 없는 정적 라우트(개인정보처리방침/이용약관/소개/가이드)를
// 크롤러·심사자가 JavaScript 없이도 실제 콘텐츠를 볼 수 있도록 정적 HTML로 미리 렌더링한다.
// (dist/index.html은 <div id="root"></div>가 빈 채로 배포되어 애드센스 심사 등에서
// "콘텐츠 없는 페이지"로 보일 위험이 있음 — vite.config.ts, index.html 참고)
//
// vercel.json의 rewrites는 파일시스템에 실제 파일이 있으면 그걸 우선 서빙하므로
// dist/<route>/index.html을 생성해두면 rewrite보다 먼저 이 정적 파일이 서빙된다.
// 클라이언트 쪽 main.tsx는 createRoot(하이드레이션 아님)를 쓰므로, JS가 로드되면
// #root 내용을 새로 렌더링해 덮어쓸 뿐 하이드레이션 불일치 경고가 생기지 않는다.

import { readFileSync, writeFileSync } from 'node:fs';
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

// index.html의 lang="ko" 기본 언어에 맞춰 한국어 콘텐츠로 프리렌더한다.
// (다른 언어는 JS 로드 후 클라이언트에서 정상적으로 전환된다.)
const LANG = 'ko';
const SITE_URL = 'https://mazeinyt.com';
const t = translations[LANG];

const ROUTES = [
  { path: 'privacy', seoKey: 'privacy', content: privacyContent[LANG] },
  { path: 'terms', seoKey: 'terms', content: termsContent[LANG] },
  { path: 'about', seoKey: 'about', content: aboutContent[LANG] },
  { path: 'guide', seoKey: 'guide', content: guideContent[LANG] },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

const template = readFileSync(indexHtmlPath, 'utf8');

for (const route of ROUTES) {
  const rendered = renderLegalPage(route.content);
  const withHead = patchHead(template, {
    title: t[`seo.${route.seoKey}.title`],
    description: t[`seo.${route.seoKey}.description`],
    url: `${SITE_URL}/${route.path}`,
  });
  const html = withHead.replace(
    '<div id="root"></div>',
    `<div id="root">${rendered}</div>`,
  );
  // 확장자 없는 URL(/guide)에 대한 정적 서버의 clean-URL 확장자 해석은
  // 디렉토리+index.html 방식보다 평평한 .html 파일 방식이 더 안정적으로 매치된다
  // (로컬 vite preview 검증: /guide는 매치 안 됐지만 /guide.html은 매치됨).
  writeFileSync(path.join(distDir, `${route.path}.html`), html, 'utf8');
  console.log(`prerendered: /${route.path}.html (${route.content.title})`);
}
