import type { Lang } from './translations';

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  title: string;
  updated: string;
  sections: LegalSection[];
}

const CONTACT_EMAIL = 'contact@mazeinyt.com';

export const privacyContent: Record<Lang, LegalPage> = {
  ko: {
    title: '개인정보처리방침',
    updated: '최종 수정일: 2026년 7월',
    sections: [
      {
        heading: '개요',
        body: [
          '이 개인정보처리방침은 maze("서비스")를 이용하실 때 정보가 어떻게 처리되는지 설명합니다.',
        ],
      },
      {
        heading: '수집하는 정보',
        body: [
          '서비스는 회원가입이 필요하지 않습니다. 화면에서 선택하신 표시 언어는 브라우저 로컬 저장소(localStorage)에만 저장되어 재방문 시에도 유지되며, 서버로 전송되지 않습니다.',
          '이름, 이메일 주소 등 신원을 특정할 수 있는 정보는 서비스 자체적으로 수집하지 않습니다.',
        ],
      },
      {
        heading: '제3자 서비스 (YouTube API)',
        body: [
          '서비스는 공식 YouTube Data API를 통해 공개적으로 제공되는 트렌드 영상 정보를 가져옵니다. 서비스를 통해 표시되는 YouTube 콘텐츠 이용에는 YouTube 서비스 약관이 적용되며, 이 과정에서 Google이 수집하는 정보에는 Google 개인정보처리방침(https://policies.google.com/privacy)이 적용됩니다.',
        ],
      },
      {
        heading: '광고 및 쿠키',
        body: [
          '서비스에 광고(Google AdSense 포함)가 게재되는 경우, Google과 광고 파트너는 이용자의 이전 방문 기록을 바탕으로 맞춤 광고를 제공하기 위해 쿠키를 사용할 수 있습니다.',
          'Google 광고 설정(https://adssettings.google.com)에서 맞춤 광고 수신을 거부할 수 있습니다.',
        ],
      },
      {
        heading: '아동의 개인정보',
        body: [
          '서비스는 만 13세 미만 아동을 대상으로 하지 않으며, 이들의 정보를 고의로 수집하지 않습니다.',
        ],
      },
      {
        heading: '방침 변경',
        body: [
          '이 개인정보처리방침은 수시로 변경될 수 있으며, 변경 사항은 이 페이지에 게시되는 즉시 적용됩니다.',
        ],
      },
      {
        heading: '문의',
        body: [`이 방침에 대한 문의는 ${CONTACT_EMAIL}로 연락해 주세요.`],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    sections: [
      {
        heading: 'Overview',
        body: [
          'This Privacy Policy explains how maze ("the Service") handles information when you use it.',
        ],
      },
      {
        heading: 'Information We Collect',
        body: [
          'The Service does not require account registration. Your selected display language is stored only in your browser\'s local storage (localStorage) so it persists across visits, and is never sent to our servers.',
          'We do not collect names, email addresses, or other directly identifying information through the Service itself.',
        ],
      },
      {
        heading: 'Third-Party Services (YouTube API)',
        body: [
          'The Service retrieves publicly available trending video data via the official YouTube Data API. Your use of YouTube content displayed through the Service is subject to the YouTube Terms of Service, and any information Google collects in this process is governed by the Google Privacy Policy (https://policies.google.com/privacy).',
        ],
      },
      {
        heading: 'Advertising & Cookies',
        body: [
          'If the Service displays advertising (including through Google AdSense), Google and its partners may use cookies to serve ads based on your prior visits to this or other websites.',
          'You may opt out of personalized advertising via Google Ads Settings (https://adssettings.google.com).',
        ],
      },
      {
        heading: "Children's Privacy",
        body: [
          'The Service is not directed to children under 13, and we do not knowingly collect information from children under 13.',
        ],
      },
      {
        heading: 'Changes to This Policy',
        body: [
          'We may update this Privacy Policy from time to time. Changes take effect as soon as they are posted on this page.',
        ],
      },
      {
        heading: 'Contact',
        body: [`Questions about this policy can be sent to ${CONTACT_EMAIL}.`],
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新日: 2026年7月',
    sections: [
      {
        heading: '概要',
        body: [
          '本プライバシーポリシーは、maze（以下「本サービス」）をご利用いただく際の情報の取り扱いについて説明するものです。',
        ],
      },
      {
        heading: '収集する情報',
        body: [
          '本サービスの利用に会員登録は不要です。画面で選択した表示言語はブラウザのローカルストレージ（localStorage）にのみ保存され、再訪問時にも維持されますが、サーバーへ送信されることはありません。',
          '氏名やメールアドレスなど、個人を特定できる情報は本サービス自体では収集しません。',
        ],
      },
      {
        heading: '第三者サービス（YouTube API）',
        body: [
          '本サービスは公式のYouTube Data APIを通じて公開されているトレンド動画情報を取得しています。本サービスで表示されるYouTubeコンテンツのご利用にはYouTube利用規約が適用され、その過程でGoogleが収集する情報にはGoogleプライバシーポリシー（https://policies.google.com/privacy）が適用されます。',
        ],
      },
      {
        heading: '広告とCookie',
        body: [
          '本サービスに広告（Google AdSenseを含む）が表示される場合、Googleおよび広告パートナーは、本サイトや他のサイトへの過去のアクセス情報に基づいて広告を配信するためにCookieを使用することがあります。',
          'Google広告設定（https://adssettings.google.com）からパーソナライズ広告を無効にすることができます。',
        ],
      },
      {
        heading: '児童のプライバシー',
        body: [
          '本サービスは13歳未満の児童を対象としておらず、児童から意図的に情報を収集することはありません。',
        ],
      },
      {
        heading: '本ポリシーの変更',
        body: [
          '本プライバシーポリシーは随時更新される場合があり、変更内容は本ページに掲載された時点で有効となります。',
        ],
      },
      {
        heading: 'お問い合わせ',
        body: [`本ポリシーに関するお問い合わせは ${CONTACT_EMAIL} までご連絡ください。`],
      },
    ],
  },
};

export const termsContent: Record<Lang, LegalPage> = {
  ko: {
    title: '이용약관',
    updated: '최종 수정일: 2026년 7월',
    sections: [
      {
        heading: '약관 동의',
        body: [
          'maze("서비스")를 이용함으로써 이 이용약관에 동의하는 것으로 간주됩니다. 동의하지 않으시는 경우 서비스 이용을 삼가주세요.',
        ],
      },
      {
        heading: '서비스 설명',
        body: [
          '서비스는 공식 YouTube Data API를 통해 공개적으로 제공되는 유튜브 트렌드 영상 정보를 정보 제공 목적으로 모아 보여줍니다.',
          '서비스는 YouTube 또는 Google과 제휴하거나 이들의 보증·후원을 받지 않습니다.',
        ],
      },
      {
        heading: '보증의 부인',
        body: [
          '서비스에 표시되는 데이터(조회수, 좋아요 수, 구독자 수 등)는 YouTube API로부터 가져오며, 지연되거나 불완전하거나 일시적으로 제공되지 않을 수 있습니다. 서비스는 데이터의 정확성이나 가용성을 보증하지 않습니다.',
        ],
      },
      {
        heading: '이용자의 의무',
        body: [
          '서비스를 스크래핑, 역설계하거나 과도한 자동화된 요청으로 부담을 주는 행위를 금지합니다.',
        ],
      },
      {
        heading: '제3자 콘텐츠',
        body: [
          '서비스에 표시되는 영상 썸네일, 제목, 채널 정보의 권리는 각 원저작자 및 YouTube에 있습니다. 영상을 클릭하면 YouTube로 이동합니다.',
        ],
      },
      {
        heading: '책임의 제한',
        body: [
          '법이 허용하는 한도 내에서, 서비스는 서비스 이용으로 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다.',
        ],
      },
      {
        heading: '약관 변경',
        body: ['이 약관은 수시로 변경될 수 있으며, 변경 사항은 게시 즉시 적용됩니다.'],
      },
      {
        heading: '문의',
        body: [`이 약관에 대한 문의는 ${CONTACT_EMAIL}로 연락해 주세요.`],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: July 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: [
          'By using maze ("the Service"), you agree to these Terms of Service. If you do not agree, please do not use the Service.',
        ],
      },
      {
        heading: 'Description of Service',
        body: [
          'The Service aggregates publicly available YouTube trending video data via the official YouTube Data API for informational purposes.',
          'The Service is not affiliated with, endorsed by, or sponsored by YouTube or Google.',
        ],
      },
      {
        heading: 'Disclaimer of Warranties',
        body: [
          'Data shown in the Service (view counts, likes, subscriber counts, etc.) is sourced from the YouTube API and may be delayed, incomplete, or temporarily unavailable. The Service does not warrant the accuracy or availability of this data.',
        ],
      },
      {
        heading: 'User Obligations',
        body: [
          'You may not scrape, reverse-engineer, or place excessive automated load on the Service.',
        ],
      },
      {
        heading: 'Third-Party Content',
        body: [
          'Rights to video thumbnails, titles, and channel information shown in the Service belong to their respective owners and YouTube. Clicking a video takes you to YouTube.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        body: [
          'To the extent permitted by law, the Service shall not be liable for any damages arising from your use of the Service.',
        ],
      },
      {
        heading: 'Changes to Terms',
        body: [
          'These Terms may be updated from time to time. Changes take effect as soon as they are posted.',
        ],
      },
      {
        heading: 'Contact',
        body: [`Questions about these Terms can be sent to ${CONTACT_EMAIL}.`],
      },
    ],
  },
  ja: {
    title: '利用規約',
    updated: '最終更新日: 2026年7月',
    sections: [
      {
        heading: '規約への同意',
        body: [
          'maze（以下「本サービス」）をご利用いただくことで、本利用規約に同意したものとみなされます。同意いただけない場合は、本サービスのご利用をお控えください。',
        ],
      },
      {
        heading: 'サービスの説明',
        body: [
          '本サービスは、公式のYouTube Data APIを通じて公開されているYouTubeのトレンド動画情報を、情報提供を目的として収集・表示するものです。',
          '本サービスはYouTubeまたはGoogleと提携、承認、後援を受けたものではありません。',
        ],
      },
      {
        heading: '保証の否認',
        body: [
          '本サービスに表示されるデータ（再生回数、高評価数、登録者数など）はYouTube APIから取得しており、遅延、不完全、または一時的に利用できない場合があります。本サービスはこれらのデータの正確性や可用性を保証しません。',
        ],
      },
      {
        heading: '利用者の義務',
        body: [
          '本サービスに対するスクレイピング、リバースエンジニアリング、過度な自動化されたリクエストによる負荷は禁止します。',
        ],
      },
      {
        heading: '第三者コンテンツ',
        body: [
          '本サービスに表示される動画のサムネイル、タイトル、チャンネル情報の権利は、それぞれの権利者およびYouTubeに帰属します。動画をクリックするとYouTubeへ移動します。',
        ],
      },
      {
        heading: '責任の制限',
        body: [
          '法律で認められる範囲内において、本サービスは本サービスの利用により生じたいかなる損害についても責任を負いません。',
        ],
      },
      {
        heading: '規約の変更',
        body: ['本規約は随時更新される場合があり、変更内容は掲載時点で有効となります。'],
      },
      {
        heading: 'お問い合わせ',
        body: [`本規約に関するお問い合わせは ${CONTACT_EMAIL} までご連絡ください。`],
      },
    ],
  },
};

export const aboutContent: Record<Lang, LegalPage> = {
  ko: {
    title: 'maze 소개',
    updated: '',
    sections: [
      {
        heading: 'maze란?',
        body: [
          'maze는 미국·일본·한국의 실시간 유튜브 인기 영상을 한곳에서 비교하고, 국가별 트렌드 키워드와 급상승 채널을 확인할 수 있는 서비스입니다.',
        ],
      },
      {
        heading: '어떻게 동작하나요?',
        body: [
          '공식 YouTube Data API를 통해 각 국가의 트렌드 영상 데이터를 가져와 조회수·좋아요·구독자 수 기준으로 정렬·필터링해 보여줍니다. 모든 영상은 원본 YouTube 페이지로 연결됩니다.',
        ],
      },
      {
        heading: '문의',
        body: [`문의사항은 ${CONTACT_EMAIL}로 연락해 주세요.`],
      },
    ],
  },
  en: {
    title: 'About maze',
    updated: '',
    sections: [
      {
        heading: 'What is maze?',
        body: [
          'maze lets you compare real-time trending YouTube videos across the US, Japan, and Korea in one place, and explore country-level trending keywords and rising channels.',
        ],
      },
      {
        heading: 'How it works',
        body: [
          'maze retrieves each country\'s trending video data through the official YouTube Data API and lets you sort and filter it by views, likes, and subscriber count. Every video links back to its original YouTube page.',
        ],
      },
      {
        heading: 'Contact',
        body: [`For questions, reach out to ${CONTACT_EMAIL}.`],
      },
    ],
  },
  ja: {
    title: 'mazeについて',
    updated: '',
    sections: [
      {
        heading: 'mazeとは',
        body: [
          'mazeは、アメリカ・日本・韓国のリアルタイムの人気YouTube動画を一箇所で比較し、国別のトレンドキーワードや急上昇チャンネルを確認できるサービスです。',
        ],
      },
      {
        heading: '仕組み',
        body: [
          '公式のYouTube Data APIを通じて各国のトレンド動画データを取得し、再生回数・高評価数・登録者数で並べ替え・絞り込みができます。すべての動画は元のYouTubeページにリンクしています。',
        ],
      },
      {
        heading: 'お問い合わせ',
        body: [`お問い合わせは ${CONTACT_EMAIL} までご連絡ください。`],
      },
    ],
  },
};
