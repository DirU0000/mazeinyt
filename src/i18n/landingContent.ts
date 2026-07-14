import type { Lang } from './translations';
import type { LegalSection } from './legalContent';

/**
 * 국가별 SEO 랜딩 페이지 콘텐츠 (/trend/us · /trend/jp · /trend/kr).
 *
 * 목적: 홈(/)이 실시간 데이터 표라 검색엔진이 매칭할 안정적인 본문 텍스트가 부족하다.
 * 이 페이지들은 "미국 유튜브 순위 / 일본 유튜브 인기 영상 / 한국 유튜브 급상승"처럼
 * 사람들이 실제로 입력하는 롱테일 검색어를 겨냥한, 국가마다 고유한 설명 텍스트를 제공한다.
 * (자동 생성한 얇은 중복 페이지 = 구글이 싫어하는 도어웨이 페이지가 되지 않도록,
 *  나라별로 관점·문장을 실제로 다르게 작성한다.)
 *
 * 각 페이지는 실시간 순위 도구(홈)로 사용자를 연결(CTA)하고, 관련 페이지와 서로 링크해
 * 내부 링크 구조를 강화한다.
 */
export interface LandingPage {
  /** <h1> 및 SEO 제목의 핵심 문구 */
  title: string;
  /** SEO meta description */
  description: string;
  /** 도구(홈)로 보내는 CTA 버튼 문구 */
  cta: string;
  /** 상단 소개 문단(들) */
  intro: string[];
  /** 본문 섹션 */
  sections: LegalSection[];
}

export type LandingCountry = 'us' | 'jp' | 'kr';

export const LANDING_COUNTRIES: LandingCountry[] = ['us', 'jp', 'kr'];

export const landingContent: Record<LandingCountry, Record<Lang, LandingPage>> = {
  kr: {
    ko: {
      title: '한국 유튜브 순위 — 실시간 인기·급상승 영상',
      description:
        '한국 유튜브 실시간 인기 급상승 영상 순위를 조회수·좋아요·구독자 대비 조회수로 확인하세요. 카테고리·업로드 기간별 필터와 쇼츠/롱폼 구분을 지원합니다.',
      cta: '한국 실시간 순위 바로 보기',
      intro: [
        '지금 한국에서 가장 많이 보고 있는 유튜브 영상은 무엇일까요? maze는 YouTube 공식 데이터(chart=mostPopular)를 기준으로 한국의 실시간 인기·급상승 영상을 조회수 내림차순으로 정리해 보여줍니다. 순위를 임의로 바꾸지 않으며, 20분 주기로 갱신됩니다.',
        '단순히 조회수만 나열하는 것을 넘어, 좋아요 수와 구독자 대비 조회수 배율까지 함께 보여줘 "규모가 커서 잘 나오는 영상"과 "자기 채널 크기에 비해 이례적으로 터진 영상"을 구분할 수 있습니다.',
      ],
      sections: [
        {
          heading: '한국 유튜브 인기 순위, 이렇게 보세요',
          body: [
            '카테고리(음악·게임·동물·스포츠·먹방·뷰티·코미디)와 업로드 기간(하루·일주일·한 달·1년)으로 필터링하면, 지금 한국에서 어떤 주제가 얼마나 빠르게 퍼지고 있는지 좁혀 볼 수 있습니다.',
            '영상 길이 3분(180초) 이하는 쇼츠, 그 이상은 롱폼으로 구분해 필터링할 수 있어, 쇼츠 트렌드와 롱폼 트렌드를 따로 분석하기 좋습니다.',
          ],
        },
        {
          heading: '구독자 대비 조회수로 "떡상" 영상 찾기',
          body: [
            '정렬을 "구독자 대비 조회수 높은순"으로 바꾸면, 구독자 수는 적지만 영상 하나가 폭발적으로 터진 한국 채널을 찾을 수 있습니다. 이런 영상은 대형 채널의 트렌드보다 소규모 채널이 따라 하기 쉬운 주제·연출인 경우가 많습니다.',
            '채널 단위로 같은 신호를 보고 싶다면 급상승 채널 페이지에서 또래(비슷한 규모) 채널 평균 대비 얼마나 잘 나오는지 순위로 확인할 수 있습니다.',
          ],
        },
        {
          heading: '미국·일본과 비교해 트렌드 선점하기',
          body: [
            '트렌드는 나라마다 도착 시점이 다릅니다. 같은 카테고리를 미국·일본 순위와 번갈아 비교하면, 아직 한국에 본격적으로 들어오지 않은 해외 형식·소재를 먼저 포착할 수 있습니다.',
          ],
        },
      ],
    },
    en: {
      title: 'Korea YouTube Rankings — Real-Time Trending Videos',
      description:
        "See Korea's real-time trending YouTube videos ranked by views, likes, and views-to-subscriber ratio, with category, upload-window, and Shorts/long-form filters.",
      cta: 'Open the live Korea rankings',
      intro: [
        "What is Korea watching on YouTube right now? maze ranks Korea's real-time trending videos by view count, based on official YouTube data (chart=mostPopular), refreshed every 20 minutes and never manually reordered.",
        'Beyond raw views, each entry shows likes and a views-to-subscriber ratio, so you can tell an "already-big channel" apart from a video that broke out far beyond its channel size.',
      ],
      sections: [
        {
          heading: 'How to read Korea\'s YouTube rankings',
          body: [
            'Filter by category (music, gaming, animals, sports, food, beauty, comedy) and upload window (day, week, month, year) to narrow in on which topics are spreading fastest in Korea right now.',
            'Videos of 3 minutes (180s) or less are marked as Shorts and longer ones as long-form, so you can analyze Shorts trends and long-form trends separately.',
          ],
        },
        {
          heading: 'Find breakout videos by views-to-subscribers',
          body: [
            'Switch the sort to "views vs. subscribers" to surface Korean channels with modest subscriber counts whose single video blew up. These are often more copyable in topic and format than big-channel trends.',
            'To see the same signal at the channel level, the Rising Channels page ranks channels by how far they outperform similarly sized peers.',
          ],
        },
        {
          heading: 'Compare with the US and Japan to get ahead',
          body: [
            "Trends arrive at different times in each country. Comparing the same category against the US and Japan rankings helps you spot formats that haven't fully reached Korea yet.",
          ],
        },
      ],
    },
    ja: {
      title: '韓国のYouTubeランキング — リアルタイム人気・急上昇動画',
      description:
        '韓国のリアルタイム人気・急上昇YouTube動画を再生回数・高評価・登録者比の再生回数で確認。カテゴリ・投稿期間フィルターとショート/長尺の区別に対応。',
      cta: '韓国のリアルタイムランキングを見る',
      intro: [
        '今、韓国で最も見られているYouTube動画は何でしょうか。mazeはYouTube公式データ（chart=mostPopular）をもとに、韓国のリアルタイム人気・急上昇動画を再生回数の降順で表示します。順位を勝手に変えることはなく、20分ごとに更新されます。',
        '再生回数だけでなく、高評価数と登録者比の再生回数倍率も併せて表示するため、「規模が大きいから伸びている動画」と「チャンネル規模に対して異例に伸びた動画」を見分けられます。',
      ],
      sections: [
        {
          heading: '韓国のYouTube人気ランキングの見方',
          body: [
            'カテゴリ（音楽・ゲーム・動物・スポーツ・グルメ・美容・コメディ）と投稿期間（1日・1週間・1か月・1年）で絞り込むと、今の韓国でどのテーマがどれだけ速く広がっているかを見られます。',
            '長さ3分（180秒）以下はショート、それ以上は長尺として区別できるため、ショートと長尺のトレンドを分けて分析できます。',
          ],
        },
        {
          heading: '登録者比の再生回数で「急上昇」動画を探す',
          body: [
            '並べ替えを「登録者比の再生回数順」にすると、登録者は少ないのに一本の動画が急に伸びた韓国のチャンネルを見つけられます。こうした動画は大手のトレンドより、小規模チャンネルが真似しやすいテーマ・演出であることが多いです。',
            'チャンネル単位で同じ信号を見たい場合は、急上昇チャンネルページで同規模の相手と比べてどれだけ伸びているかをランキングで確認できます。',
          ],
        },
        {
          heading: 'アメリカ・日本と比べてトレンドを先取り',
          body: [
            'トレンドが届く時期は国ごとに異なります。同じカテゴリをアメリカ・日本のランキングと見比べると、まだ韓国に本格的に来ていない形式・題材を早く見つけられます。',
          ],
        },
      ],
    },
  },
  us: {
    ko: {
      title: '미국 유튜브 순위 — 실시간 인기·급상승 영상',
      description:
        '미국 유튜브 실시간 인기 급상승 영상 순위를 조회수·좋아요·구독자 대비 조회수로 확인하세요. 세계 트렌드의 진원지인 미국 순위를 카테고리·기간별로 살펴봅니다.',
      cta: '미국 실시간 순위 바로 보기',
      intro: [
        '미국은 전 세계 유튜브 트렌드가 가장 먼저 시작되는 시장 중 하나입니다. maze는 YouTube 공식 데이터를 기준으로 미국의 실시간 인기·급상승 영상을 조회수 내림차순으로 정리해, 지금 미국에서 무엇이 화제인지 한국어로 바로 확인할 수 있게 해줍니다.',
        '음악·게임·먹방·뷰티 등 카테고리별로 미국에서 어떤 콘텐츠가 뜨는지 보면, 몇 주~몇 달 뒤 한국에 들어올 수 있는 트렌드를 미리 감지할 수 있습니다.',
      ],
      sections: [
        {
          heading: '미국 유튜브 인기 동영상, 왜 먼저 봐야 하나',
          body: [
            '숏폼 챌린지, 밈, 음악 트렌드의 상당수가 미국에서 먼저 터진 뒤 다른 나라로 퍼집니다. 미국 순위를 정기적으로 보는 것만으로도 한국 시청자에게 아직 새로운 소재를 먼저 발견할 수 있습니다.',
            '카테고리와 업로드 기간(하루·일주일·한 달) 필터로 좁혀 보면, 반짝 화제와 꾸준히 성장하는 트렌드를 구분하기 쉽습니다.',
          ],
        },
        {
          heading: '구독자 대비 조회수로 이례적 성공 찾기',
          body: [
            '정렬을 "구독자 대비 조회수 높은순"으로 바꾸면, 큰 채널의 당연한 성공이 아니라 규모 대비 이례적으로 터진 미국 영상을 골라볼 수 있습니다. 이런 사례는 형식·주제 자체의 힘으로 성공한 경우가 많아 참고 가치가 큽니다.',
          ],
        },
        {
          heading: '한국·일본 순위와 나란히 비교',
          body: [
            '같은 카테고리를 한국·일본 순위와 번갈아 보면, 미국에서만 뜨는 로컬 트렌드인지 세 나라에서 공통으로 뜨는 보편적 소재인지 구분할 수 있습니다. 보편적 소재일수록 더 넓은 시청자층을 노릴 때 유리합니다.',
          ],
        },
      ],
    },
    en: {
      title: 'US YouTube Rankings — Real-Time Trending Videos',
      description:
        "See the United States' real-time trending YouTube videos ranked by views, likes, and views-to-subscriber ratio — the market where many global trends start first.",
      cta: 'Open the live US rankings',
      intro: [
        'The US is one of the first markets where global YouTube trends take off. maze ranks real-time trending US videos by view count from official YouTube data, so you can see what America is watching right now.',
        'Watching which content rises in the US by category — music, gaming, food, beauty — is an early signal for trends that may reach other countries weeks or months later.',
      ],
      sections: [
        {
          heading: 'Why watch US trending videos first',
          body: [
            'Many short-form challenges, memes, and music trends break out in the US before spreading elsewhere. Regularly checking the US rankings lets you find formats before they feel familiar in your own market.',
            'Category and upload-window filters (day, week, month) make it easy to separate a one-off spike from a trend that keeps growing.',
          ],
        },
        {
          heading: 'Spot outsized wins by views-to-subscribers',
          body: [
            'Sorting by "views vs. subscribers" surfaces US videos that broke out far beyond their channel size, rather than the expected wins of huge channels. These cases usually succeeded on the strength of the format or topic itself.',
          ],
        },
        {
          heading: 'Compare side by side with Korea and Japan',
          body: [
            'Switching the same category across the Korea and Japan rankings shows whether something is a US-only local trend or a universal topic trending in all three — the latter travels better to a wider audience.',
          ],
        },
      ],
    },
    ja: {
      title: 'アメリカのYouTubeランキング — リアルタイム人気・急上昇動画',
      description:
        'アメリカのリアルタイム人気・急上昇YouTube動画を再生回数・高評価・登録者比の再生回数で確認。世界のトレンドが最初に生まれる市場のランキングをカテゴリ・期間別に。',
      cta: 'アメリカのリアルタイムランキングを見る',
      intro: [
        'アメリカは世界のYouTubeトレンドが最初に生まれる市場のひとつです。mazeはYouTube公式データをもとに、アメリカのリアルタイム人気・急上昇動画を再生回数の降順で表示し、今アメリカで何が話題かをすぐに確認できます。',
        '音楽・ゲーム・グルメ・美容などカテゴリ別にどんなコンテンツが伸びているかを見れば、数週間〜数か月後に他国へ来るトレンドを先に察知できます。',
      ],
      sections: [
        {
          heading: 'アメリカの人気動画を先に見る理由',
          body: [
            'ショートのチャレンジ、ミーム、音楽トレンドの多くはアメリカで先に火がつき、その後ほかの国へ広がります。アメリカのランキングを定期的に見るだけで、自国ではまだ新鮮な題材を先に見つけられます。',
            'カテゴリと投稿期間（1日・1週間・1か月）のフィルターで、一時的な盛り上がりと伸び続けるトレンドを見分けやすくなります。',
          ],
        },
        {
          heading: '登録者比の再生回数で異例の成功を探す',
          body: [
            '並べ替えを「登録者比の再生回数順」にすると、大手の当然の成功ではなく、規模に対して異例に伸びたアメリカの動画を選べます。こうした事例は形式やテーマ自体の力で成功していることが多く、参考価値が高いです。',
          ],
        },
        {
          heading: '韓国・日本のランキングと並べて比較',
          body: [
            '同じカテゴリを韓国・日本のランキングと見比べると、アメリカだけのローカルなトレンドか、三カ国共通の普遍的な題材かを見分けられます。普遍的なほど、より広い視聴者を狙う際に有利です。',
          ],
        },
      ],
    },
  },
  jp: {
    ko: {
      title: '일본 유튜브 순위 — 실시간 인기·급상승 영상',
      description:
        '일본 유튜브 실시간 인기 급상승 영상 순위를 조회수·좋아요·구독자 대비 조회수로 확인하세요. 한국과 가까우면서도 독특한 일본 트렌드를 카테고리·기간별로 살펴봅니다.',
      cta: '일본 실시간 순위 바로 보기',
      intro: [
        '일본은 지리적으로 가깝지만 유튜브 트렌드는 독자적인 색이 강한 시장입니다. maze는 YouTube 공식 데이터를 기준으로 일본의 실시간 인기·급상승 영상을 조회수 내림차순으로 정리해, 지금 일본에서 무엇이 뜨는지 한국어로 바로 볼 수 있게 해줍니다.',
        '음악·게임·애니 관련 콘텐츠 등 일본 특유의 강세 장르를 카테고리별로 살펴보면, 한국과 다른 일본만의 취향과 겹치는 지점을 함께 파악할 수 있습니다.',
      ],
      sections: [
        {
          heading: '일본 유튜브 인기 영상의 특징',
          body: [
            '일본 순위는 글로벌 트렌드를 그대로 따라가기보다 자국 아티스트·게임·방송 문화가 강하게 반영되는 편입니다. 그래서 미국 순위와 나란히 보면 "세계 공통 트렌드"와 "일본 로컬 트렌드"의 차이가 뚜렷하게 드러납니다.',
            '카테고리와 업로드 기간 필터로 좁혀 보면, 일본에서 지금 어떤 주제가 빠르게 퍼지고 있는지 확인할 수 있습니다.',
          ],
        },
        {
          heading: '구독자 대비 조회수로 신흥 채널 발굴',
          body: [
            '정렬을 "구독자 대비 조회수 높은순"으로 바꾸면, 아직 규모는 작지만 영상이 크게 터진 일본 채널을 찾을 수 있습니다. 언어의 벽 때문에 한국에 덜 알려진 신흥 크리에이터를 먼저 발견하기에 좋습니다.',
          ],
        },
        {
          heading: '한국·미국 트렌드와 비교하기',
          body: [
            '같은 카테고리를 한국·미국 순위와 번갈아 비교하면, 한일 양쪽에서 동시에 통하는 소재인지 일본에서만 통하는 소재인지 가늠할 수 있습니다. 한일 공통으로 뜨는 주제는 국내 콘텐츠에 접목하기에 특히 유리합니다.',
          ],
        },
      ],
    },
    en: {
      title: 'Japan YouTube Rankings — Real-Time Trending Videos',
      description:
        "See Japan's real-time trending YouTube videos ranked by views, likes, and views-to-subscriber ratio — a market with a distinctive trend culture of its own.",
      cta: 'Open the live Japan rankings',
      intro: [
        'Japan is geographically close to Korea but its YouTube trends have a strongly distinctive character. maze ranks real-time trending Japanese videos by view count from official YouTube data, so you can see what Japan is watching right now.',
        "Looking at Japan's strong genres by category — music, gaming, anime-related content — reveals both where Japanese taste differs from Korea's and where the two overlap.",
      ],
      sections: [
        {
          heading: "What makes Japan's trending videos distinctive",
          body: [
            "Japan's rankings tend to reflect domestic artists, games, and broadcast culture rather than simply following global trends. Viewed next to the US rankings, the gap between a universal trend and a Japan-only local trend becomes clear.",
            'Category and upload-window filters let you see which topics are spreading fastest in Japan right now.',
          ],
        },
        {
          heading: 'Discover emerging channels by views-to-subscribers',
          body: [
            'Sorting by "views vs. subscribers" surfaces Japanese channels that are still small but had a video break out — a good way to find emerging creators who are less known abroad because of the language barrier.',
          ],
        },
        {
          heading: 'Compare with Korea and US trends',
          body: [
            'Switching the same category across the Korea and US rankings helps you gauge whether a topic works in both countries or only in Japan. Topics trending in both Korea and Japan are especially useful to adapt for a Korean audience.',
          ],
        },
      ],
    },
    ja: {
      title: '日本のYouTubeランキング — リアルタイム人気・急上昇動画',
      description:
        '日本のリアルタイム人気・急上昇YouTube動画を再生回数・高評価・登録者比の再生回数で確認。独自色の強い日本のトレンドをカテゴリ・期間別に見られます。',
      cta: '日本のリアルタイムランキングを見る',
      intro: [
        '日本のYouTubeトレンドは独自色の強い市場です。mazeはYouTube公式データをもとに、日本のリアルタイム人気・急上昇動画を再生回数の降順で表示し、今日本で何が伸びているかをすぐに確認できます。',
        '音楽・ゲーム・アニメ関連など日本ならではの強いジャンルをカテゴリ別に見ると、他国との違いと共通点の両方を把握できます。',
      ],
      sections: [
        {
          heading: '日本の人気動画の特徴',
          body: [
            '日本のランキングは、グローバルなトレンドをそのまま追うより、国内のアーティスト・ゲーム・放送文化が強く反映される傾向があります。アメリカのランキングと並べて見ると、世界共通のトレンドと日本ローカルのトレンドの差がはっきり見えます。',
            'カテゴリと投稿期間のフィルターで、今の日本でどのテーマが速く広がっているかを確認できます。',
          ],
        },
        {
          heading: '登録者比の再生回数で新興チャンネルを発掘',
          body: [
            '並べ替えを「登録者比の再生回数順」にすると、まだ規模は小さいのに動画が大きく伸びた日本のチャンネルを見つけられます。言語の壁で海外にあまり知られていない新興クリエイターを先に見つけるのに向いています。',
          ],
        },
        {
          heading: '韓国・アメリカのトレンドと比較',
          body: [
            '同じカテゴリを韓国・アメリカのランキングと見比べると、両国で通じる題材か日本だけで通じる題材かを見極められます。両国で伸びるテーマは、より広い視聴者に届けやすいです。',
          ],
        },
      ],
    },
  },
};
