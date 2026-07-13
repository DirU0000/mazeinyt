export type Lang = 'ko' | 'en' | 'ja';

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];

export const DEFAULT_LANG: Lang = 'ko';

// 플랫 키 구조. {name} 형태의 토큰은 t()에서 치환된다.
export const translations: Record<Lang, Record<string, string>> = {
  ko: {
    tagline: '전 세계 실시간 인기 유튜브 영상을 한눈에',

    'seo.videos.title': 'maze — 미국·일본·한국 실시간 유튜브 인기 영상',
    'seo.videos.description':
      '미국·일본·한국의 실시간 유튜브 트렌드 영상을 조회수·좋아요·구독자 수 기준으로 비교하고 검색해보세요.',
    'seo.videos.keywords':
      'maze, mazeinyt, 메이즈, 메이즈인유튜브, 유튜브 순위, 유튜브 트렌드, 유튜브 인기 급상승, 실시간 유튜브 순위, 유튜브 조회수 순위, 미국 일본 한국 유튜브',
    'seo.keywords.title': 'maze — 국가별 트렌드 키워드',
    'seo.keywords.description':
      '미국·일본·한국 트렌드 영상 제목에서 자주 등장하는 키워드를 국가별로 비교합니다.',
    'seo.keywords.keywords':
      '유튜브 트렌드 키워드, 국가별 유튜브 키워드, 유튜브 인기 검색어',
    'seo.channels.title': 'maze — 급상승 유튜브 채널',
    'seo.channels.description':
      '구독자 대비 조회수가 폭발적으로 늘고 있는 급상승 유튜브 채널 순위를 국가별로 확인하세요.',
    'seo.channels.keywords':
      '유튜브 급상승 채널, 구독자 대비 조회수, 떡상 채널, 유튜브 채널 순위',
    'seo.privacy.title': 'maze — 개인정보처리방침',
    'seo.privacy.description': 'maze 서비스의 개인정보처리방침입니다.',
    'seo.terms.title': 'maze — 이용약관',
    'seo.terms.description': 'maze 서비스의 이용약관입니다.',
    'seo.about.title': 'maze — 소개',
    'seo.about.description': 'maze 서비스 소개 페이지입니다.',
    'seo.guide.title': 'maze — 유튜브 트렌드로 콘텐츠 아이디어 찾는 법',
    'seo.guide.description':
      '조회수·구독자 대비 조회수·트렌드 키워드를 콘텐츠 기획에 활용하는 방법을 정리한 가이드입니다.',
    'seo.notfound.title': 'maze — 페이지를 찾을 수 없음',
    'seo.notfound.description': '요청하신 페이지를 찾을 수 없습니다.',

    'tab.videos': '영상 목록',
    'tab.keywords': '트렌드 키워드',
    'tab.channels': '급상승 채널',

    'footer.about': '소개',
    'footer.guide': '활용 가이드',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.copyright': '© 2026 maze. 유튜브 공식 API를 사용하며, YouTube·Google과 제휴 관계가 아닙니다.',

    'filter.country': '국가',
    'filter.category': '카테고리',
    'filter.period': '기간',
    'filter.sort': '정렬',
    'filter.countryAria': '국가 필터',
    'filter.categoryAria': '카테고리 필터',
    'filter.periodAria': '업로드 기간 필터',
    'filter.sortAria': '정렬 기준',
    'filter.channelMode': '기준',
    'filter.channelModeAria': '급상승 채널 비교 기준',

    'search.placeholder': '영상 제목, 채널명으로 검색',
    'search.aria': '영상 검색',

    'channelMode.segmented': '고정 구간',
    'channelMode.continuous': '전체 구간',

    'country.global': '전체',
    'country.us': '미국',
    'country.jp': '일본',
    'country.kr': '한국',

    'category.all': '전체',
    'category.animal': '동물',
    'category.game': '게임',
    'category.music': '음악',
    'category.sports': '스포츠',
    'category.food': '먹방·요리',
    'category.education': '교육',
    'category.beauty': '뷰티',
    'category.comedy': '코미디',

    'period.day': '24시간 이내',
    'period.week': '1주일 이내',
    'period.month': '1개월 이내',
    'period.year': '1년 이내',

    'sort.viewsDesc': '조회수 높은순',
    'sort.viewsAsc': '조회수 낮은순',
    'sort.viral': '구독자 대비 조회수 높은순',

    'common.loading': '불러오는 중...',
    'common.views': '{n}회',
    'common.count': '{n}회',

    'videos.h1': '실시간 인기 유튜브 영상',
    'videos.desc':
      '미국·일본·한국의 실시간 유튜브 트렌드 영상을 한곳에서 모아, 조회수·좋아요·구독자 수 기준으로 비교하고 검색할 수 있습니다. 국가·카테고리·업로드 기간별로 필터링해 지금 가장 화제가 되는 영상을 확인해보세요.',
    'videos.guide':
      '정렬 기준을 "구독자 대비 조회수"로 바꾸면, 구독자 수는 적지만 영상이 폭발적으로 터진 채널을 찾을 수 있습니다. 이런 영상은 대형 채널의 트렌드보다 소규모 채널이 따라 하기 쉬운 주제·연출인 경우가 많아, 콘텐츠 아이디어를 얻기에 더 유용합니다. 같은 카테고리를 국가별로 바꿔가며 비교하면, 아직 한국에 들어오지 않은 해외 트렌드를 먼저 포착할 수도 있습니다.',
    'video.empty': '조건에 맞는 영상이 없습니다.',
    'videos.fallbackNotice':
      '이 지역에서는 해당 카테고리의 트렌드 자료가 적어, 글로벌 순위를 대신 표시합니다.',
    'video.error': '영상을 불러오지 못했습니다: {msg}',

    'pagination.prev': '이전',
    'pagination.next': '다음',
    'pagination.aria': '페이지 이동',

    'keywords.h1': '국가별 유튜브 트렌드 키워드',
    'keywords.desc': '각 국가 트렌드 영상 제목에서 자주 등장한 단어를 모았습니다.',
    'keywords.guide':
      '같은 키워드가 여러 국가에서 동시에 보인다면 지역에 국한되지 않는 보편적인 소재라는 뜻이고, 한 국가에서만 두드러진다면 그 지역 시청자에게 특화된 소재라는 뜻입니다. 영상을 새로 기획할 때 제목·태그에 이 키워드를 참고하면 현재 검색·추천 알고리즘이 밀어주는 주제와 방향을 맞추는 데 도움이 됩니다.',
    'keywords.empty': '추출된 키워드가 없습니다.',
    'keywords.error': '키워드를 불러오지 못했습니다: {msg}',

    'channels.h1': '급상승 유튜브 채널',
    'channels.desc':
      '채널이 가장 최근에 올린 영상 최대 3개의 평균 조회수를, 비슷한 규모의 다른 채널들과 비교합니다. 그 차이가 클수록 지금 자기 규모 대비 이례적으로 잘 되고 있는 채널입니다. 아래 "기준"에서 비교 방식을 바꿀 수 있습니다.',
    'channels.guide':
      '"고정 구간"은 구독자 1천~1만, 1만~10만처럼 정해진 구간 안에서만 비교하고, "전체 구간"은 구간을 나누지 않고 구독자 수가 비슷한 채널들을 그때그때 찾아 비교합니다. 구독자 수 제한 없이 전체 채널이 대상이라, 대형 채널도 자기 규모의 평소 성과를 크게 웃돌면 상위에 오를 수 있습니다.',
    'channels.error': '채널을 불러오지 못했습니다: {msg}',
    'channels.ratio': '또래 평균 대비 {n}배',
    'channels.tierRange': '구독자 {min}~{max}',
    'channels.tierAbove': '구독자 {min} 이상',
    'channels.statSubscribers': '구독자 {n}',
    'channels.statRecentAvg': '최근 3개 평균 {n}',
    'channels.statPeerAvg': '또래 평균 {n}',

    'video.back': '목록으로',
    'video.watchOnYoutube': 'YouTube에서 보기',
    'video.notFound': '영상을 찾을 수 없습니다. 삭제되었거나 비공개로 전환되었을 수 있습니다.',
    'video.detailError': '영상 정보를 불러오지 못했습니다: {msg}',
    'video.analysisTitle': '데이터 분석',
    'video.stat.views': '조회수',
    'video.stat.likes': '좋아요',
    'video.stat.subscribers': '구독자',
    'video.stat.viewsPerDay': '일 평균 조회수',
    'video.stat.engagement': '좋아요 비율',
    'video.stat.viralRatio': '구독자 대비 조회수',
    'video.insight.viral.explosive':
      '구독자 수 대비 {ratio}배에 달하는 조회수를 기록 중입니다 — 구독자 기반을 훨씬 넘어 폭발적으로 확산되고 있는 영상입니다.',
    'video.insight.viral.fast':
      '구독자 수 대비 {ratio}배의 조회수로, 구독자 기반을 넘어 빠르게 퍼지고 있습니다.',
    'video.insight.viral.steady':
      '구독자 수 대비 {ratio}배의 조회수로, 안정적인 확산세를 보이고 있습니다.',
    'video.insight.viral.core':
      '조회수가 구독자 수 이내에 머물러 있어, 주로 기존 구독자 중심으로 시청되고 있는 것으로 보입니다.',
    'video.insight.engagement.high':
      '조회수 대비 좋아요 비율이 {pct}%로 높은 편입니다 — 시청자 반응이 좋은 영상입니다.',
    'video.insight.engagement.normal':
      '조회수 대비 좋아요 비율은 {pct}%로 평균적인 수준입니다.',
    'video.insight.engagement.low':
      '조회수 대비 좋아요 비율은 {pct}%로 다소 낮은 편입니다.',
    'video.insight.pace':
      '업로드 후 {days}일이 지났고, 하루 평균 약 {n}회의 조회수가 발생하고 있습니다.',

    'lang.aria': '언어 선택',

    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.desc': '요청하신 주소의 페이지가 존재하지 않거나 이동되었습니다.',
    'notfound.backHome': '홈으로 돌아가기',
  },
  en: {
    tagline: 'Trending YouTube videos worldwide, at a glance',

    'seo.videos.title': 'maze — Trending YouTube Videos in the US, Japan & Korea',
    'seo.videos.description':
      'Compare and search real-time trending YouTube videos from the US, Japan, and Korea by views, likes, and subscriber count.',
    'seo.videos.keywords':
      'youtube trending, youtube trending videos, real-time youtube rankings, youtube views ranking, US Japan Korea youtube',
    'seo.keywords.title': 'maze — Trending Keywords by Country',
    'seo.keywords.description':
      'See which words appear most often in trending video titles across the US, Japan, and Korea.',
    'seo.keywords.keywords':
      'youtube trending keywords, youtube keywords by country, trending search terms',
    'seo.channels.title': 'maze — Rising YouTube Channels',
    'seo.channels.description':
      'Discover rising YouTube channels whose trending videos are outperforming their subscriber count, by country.',
    'seo.channels.keywords':
      'rising youtube channels, views to subscribers ratio, youtube channel rankings',
    'seo.privacy.title': 'maze — Privacy Policy',
    'seo.privacy.description': "maze's privacy policy.",
    'seo.terms.title': 'maze — Terms of Service',
    'seo.terms.description': "maze's terms of service.",
    'seo.about.title': 'maze — About',
    'seo.about.description': 'About the maze service.',
    'seo.guide.title': 'maze — How to Find Content Ideas from YouTube Trends',
    'seo.guide.description':
      'A guide to using view counts, views-to-subscribers ratio, and trending keywords to plan your next video.',
    'seo.notfound.title': 'maze — Page Not Found',
    'seo.notfound.description': 'The page you requested could not be found.',

    'tab.videos': 'Videos',
    'tab.keywords': 'Trending Keywords',
    'tab.channels': 'Rising Channels',

    'footer.about': 'About',
    'footer.guide': 'Guide',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright':
      '© 2026 maze. Uses the official YouTube API; not affiliated with YouTube or Google.',

    'filter.country': 'Country',
    'filter.category': 'Category',
    'filter.period': 'Period',
    'filter.sort': 'Sort',
    'filter.countryAria': 'Country filter',
    'filter.categoryAria': 'Category filter',
    'filter.periodAria': 'Upload period filter',
    'filter.sortAria': 'Sort order',
    'filter.channelMode': 'Compare by',
    'filter.channelModeAria': 'Rising channel comparison method',

    'search.placeholder': 'Search by title or channel',
    'search.aria': 'Search videos',

    'channelMode.segmented': 'Fixed tiers',
    'channelMode.continuous': 'Whole range',

    'country.global': 'All',
    'country.us': 'USA',
    'country.jp': 'Japan',
    'country.kr': 'Korea',

    'category.all': 'All',
    'category.animal': 'Animals',
    'category.game': 'Gaming',
    'category.music': 'Music',
    'category.sports': 'Sports',
    'category.food': 'Food',
    'category.education': 'Education',
    'category.beauty': 'Beauty',
    'category.comedy': 'Comedy',

    'period.day': 'Last 24 hours',
    'period.week': 'Last week',
    'period.month': 'Last month',
    'period.year': 'Last year',

    'sort.viewsDesc': 'Most views',
    'sort.viewsAsc': 'Fewest views',
    'sort.viral': 'Views vs. subscribers',

    'common.loading': 'Loading...',
    'common.views': '{n} views',
    'common.count': '×{n}',

    'videos.h1': 'Trending YouTube Videos Right Now',
    'videos.desc':
      "Compare real-time trending YouTube videos from the US, Japan, and Korea in one place, ranked by views, likes, and subscriber count. Filter by country, category, and upload window to see what's buzzing right now.",
    'videos.guide':
      "Switch the sort to \"views vs. subscribers\" to surface channels with a small subscriber base whose video suddenly took off. These are often easier to replicate than a mega-channel's trend, since the format or topic isn't tied to a huge production budget. Comparing the same category across countries can also help you spot a trend before it reaches your home market.",
    'video.empty': 'No videos match your filters.',
    'videos.fallbackNotice':
      'Not enough local trending data for this category, so global rankings are shown instead.',
    'video.error': 'Failed to load videos: {msg}',

    'pagination.prev': 'Prev',
    'pagination.next': 'Next',
    'pagination.aria': 'Page navigation',

    'keywords.h1': 'Trending YouTube Keywords by Country',
    'keywords.desc':
      "Words that appear most often in each country's trending video titles.",
    'keywords.guide':
      "A keyword that shows up in multiple countries at once points to a universal topic that isn't tied to one region, while a word that only stands out in one country signals something local to that audience. Working these keywords into your own titles and tags can help align your video with what search and recommendation algorithms are currently favoring.",
    'keywords.empty': 'No keywords found.',
    'keywords.error': 'Failed to load keywords: {msg}',

    'channels.h1': 'Rising YouTube Channels',
    'channels.desc':
      "Compares each channel's average views over its last 3 uploads against similarly-sized channels. The bigger the gap, the more that channel is outperforming its own scale right now. Switch how peers are grouped under \"Compare by\" below.",
    'channels.guide':
      '"Fixed tiers" compares within set subscriber bands (e.g. 1K–10K, 10K–100K), while "Whole range" finds similarly-sized channels dynamically with no fixed bands. Neither mode caps subscriber count, so a large channel can still rank high if it\'s wildly outperforming its own usual scale.',
    'channels.error': 'Failed to load channels: {msg}',
    'channels.ratio': '{n}× peer average',
    'channels.tierRange': '{min}–{max} subs',
    'channels.tierAbove': '{min}+ subs',
    'channels.statSubscribers': '{n} subscribers',
    'channels.statRecentAvg': 'last 3 avg {n}',
    'channels.statPeerAvg': 'peer avg {n}',

    'video.back': 'Back to list',
    'video.watchOnYoutube': 'Watch on YouTube',
    'video.notFound':
      "Couldn't find this video. It may have been deleted or made private.",
    'video.detailError': 'Failed to load video info: {msg}',
    'video.analysisTitle': 'Data Analysis',
    'video.stat.views': 'Views',
    'video.stat.likes': 'Likes',
    'video.stat.subscribers': 'Subscribers',
    'video.stat.viewsPerDay': 'Avg. views/day',
    'video.stat.engagement': 'Like rate',
    'video.stat.viralRatio': 'Views vs. subscribers',
    'video.insight.viral.explosive':
      'This video has racked up {ratio}× its channel\'s subscriber count in views — it\'s spreading explosively well beyond the subscriber base.',
    'video.insight.viral.fast':
      "At {ratio}× the channel's subscriber count in views, this video is spreading quickly beyond its subscriber base.",
    'video.insight.viral.steady':
      "At {ratio}× the channel's subscriber count in views, this video is showing steady reach.",
    'video.insight.viral.core':
      "Views are within the channel's subscriber count, suggesting the audience is mostly existing subscribers.",
    'video.insight.engagement.high':
      "The like rate is {pct}% of views — noticeably high, meaning viewers are responding well.",
    'video.insight.engagement.normal':
      'The like rate is {pct}% of views — an average level.',
    'video.insight.engagement.low':
      'The like rate is {pct}% of views — somewhat low.',
    'video.insight.pace':
      "It's been {days} day(s) since upload, averaging about {n} views per day.",

    'lang.aria': 'Select language',

    'notfound.title': 'Page Not Found',
    'notfound.desc': "The page you're looking for doesn't exist or has moved.",
    'notfound.backHome': 'Back to home',
  },
  ja: {
    tagline: '世界の人気YouTube動画をひと目で',

    'seo.videos.title': 'maze — アメリカ・日本・韓国の人気YouTube動画',
    'seo.videos.description':
      'アメリカ・日本・韓国のリアルタイムのトレンドYouTube動画を再生回数・高評価数・登録者数で比較・検索できます。',
    'seo.videos.keywords':
      'YouTube トレンド, YouTube 急上昇, リアルタイム YouTube ランキング, YouTube 再生回数ランキング',
    'seo.keywords.title': 'maze — 国別トレンドキーワード',
    'seo.keywords.description':
      'アメリカ・日本・韓国のトレンド動画タイトルに頻出するキーワードを国別に比較します。',
    'seo.keywords.keywords': 'YouTube トレンドキーワード, 国別YouTubeキーワード',
    'seo.channels.title': 'maze — 急上昇YouTubeチャンネル',
    'seo.channels.description':
      '登録者数に対して再生回数が急増している急上昇YouTubeチャンネルを国別に確認できます。',
    'seo.channels.keywords':
      'YouTube 急上昇チャンネル, 登録者比再生回数, YouTubeチャンネルランキング',
    'seo.privacy.title': 'maze — プライバシーポリシー',
    'seo.privacy.description': 'mazeのプライバシーポリシーです。',
    'seo.terms.title': 'maze — 利用規約',
    'seo.terms.description': 'mazeの利用規約です。',
    'seo.about.title': 'maze — 概要',
    'seo.about.description': 'mazeサービスの紹介ページです。',
    'seo.guide.title': 'maze — YouTubeトレンドからコンテンツのヒントを見つける方法',
    'seo.guide.description':
      '再生回数・登録者比の再生回数・トレンドキーワードを動画企画に活用する方法をまとめたガイドです。',
    'seo.notfound.title': 'maze — ページが見つかりません',
    'seo.notfound.description': 'お探しのページが見つかりませんでした。',

    'tab.videos': '動画一覧',
    'tab.keywords': 'トレンドキーワード',
    'tab.channels': '急上昇チャンネル',

    'footer.about': '概要',
    'footer.guide': '活用ガイド',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.copyright':
      '© 2026 maze. 公式YouTube APIを使用しており、YouTube・Googleとは提携関係にありません。',

    'filter.country': '国',
    'filter.category': 'カテゴリ',
    'filter.period': '期間',
    'filter.sort': '並び替え',
    'filter.countryAria': '国フィルター',
    'filter.categoryAria': 'カテゴリフィルター',
    'filter.periodAria': '投稿期間フィルター',
    'filter.sortAria': '並び替え基準',
    'filter.channelMode': '比較基準',
    'filter.channelModeAria': '急上昇チャンネルの比較方法',

    'search.placeholder': 'タイトル・チャンネル名で検索',
    'search.aria': '動画を検索',

    'channelMode.segmented': '固定区間',
    'channelMode.continuous': '全体区間',

    'country.global': '全体',
    'country.us': 'アメリカ',
    'country.jp': '日本',
    'country.kr': '韓国',

    'category.all': '全体',
    'category.animal': '動物',
    'category.game': 'ゲーム',
    'category.music': '音楽',
    'category.sports': 'スポーツ',
    'category.food': 'グルメ・料理',
    'category.education': '教育',
    'category.beauty': '美容',
    'category.comedy': 'コメディ',

    'period.day': '24時間以内',
    'period.week': '1週間以内',
    'period.month': '1ヶ月以内',
    'period.year': '1年以内',

    'sort.viewsDesc': '再生回数が多い順',
    'sort.viewsAsc': '再生回数が少ない順',
    'sort.viral': '登録者比の再生回数順',

    'common.loading': '読み込み中...',
    'common.views': '{n}回',
    'common.count': '{n}回',

    'videos.h1': 'リアルタイム人気YouTube動画',
    'videos.desc':
      'アメリカ・日本・韓国のリアルタイムのトレンドYouTube動画を一箇所にまとめ、再生回数・高評価数・登録者数で比較・検索できます。国・カテゴリ・投稿期間で絞り込んで、今話題の動画をチェックしましょう。',
    'videos.guide':
      '並べ替えを「登録者比の再生回数順」に変えると、登録者数は少ないのに動画が爆発的に伸びたチャンネルを見つけられます。こうした動画は大手チャンネルのトレンドより、企画や演出を真似しやすい場合が多く、コンテンツのヒントとして参考になります。同じカテゴリを国ごとに切り替えて比較すれば、自国にまだ来ていない海外のトレンドをいち早く見つけることもできます。',
    'video.empty': '条件に合う動画がありません。',
    'videos.fallbackNotice':
      'この地域ではこのカテゴリのトレンドデータが少ないため、グローバルランキングを表示しています。',
    'video.error': '動画を読み込めませんでした: {msg}',

    'pagination.prev': '前へ',
    'pagination.next': '次へ',
    'pagination.aria': 'ページ移動',

    'keywords.h1': '国別YouTubeトレンドキーワード',
    'keywords.desc': '各国のトレンド動画タイトルに頻出する単語を集めました。',
    'keywords.guide':
      '同じキーワードが複数の国で同時に見られる場合、地域を問わない普遍的な話題である可能性が高く、ある一国だけで目立つ場合は、その地域の視聴者に特化した話題だと考えられます。動画を企画する際にタイトルやタグにこれらのキーワードを取り入れると、今の検索・レコメンドアルゴリズムが後押ししている方向性に合わせやすくなります。',
    'keywords.empty': 'キーワードがありません。',
    'keywords.error': 'キーワードを読み込めませんでした: {msg}',

    'channels.h1': '急上昇YouTubeチャンネル',
    'channels.desc':
      'チャンネルが直近にアップロードした動画最大3本の平均再生回数を、同程度の規模の他チャンネルと比較します。差が大きいほど、今その規模にしては異例に伸びているチャンネルです。下の「比較基準」で比較方法を切り替えられます。',
    'channels.guide':
      '「固定区間」は登録者数1千~1万、1万~10万のように決まった区間内だけで比較し、「全体区間」は区間を区切らず、その都度登録者数が近いチャンネルを探して比較します。どちらも登録者数の上限はないため、大規模チャンネルでも自分の規模の通常成績を大きく上回れば上位に入ることがあります。',
    'channels.error': 'チャンネルを読み込めませんでした: {msg}',
    'channels.ratio': '同規模平均比 {n}倍',
    'channels.tierRange': '登録者{min}~{max}',
    'channels.tierAbove': '登録者{min}以上',
    'channels.statSubscribers': '登録者 {n}',
    'channels.statRecentAvg': '直近3本平均 {n}',
    'channels.statPeerAvg': '同規模平均 {n}',

    'video.back': '一覧に戻る',
    'video.watchOnYoutube': 'YouTubeで見る',
    'video.notFound': '動画が見つかりません。削除されたか非公開になった可能性があります。',
    'video.detailError': '動画情報を読み込めませんでした: {msg}',
    'video.analysisTitle': 'データ分析',
    'video.stat.views': '再生回数',
    'video.stat.likes': '高評価',
    'video.stat.subscribers': '登録者数',
    'video.stat.viewsPerDay': '1日平均再生回数',
    'video.stat.engagement': '高評価率',
    'video.stat.viralRatio': '登録者比の再生回数',
    'video.insight.viral.explosive':
      '登録者数の{ratio}倍にあたる再生回数を記録しており、登録者層を大きく超えて爆発的に拡散しています。',
    'video.insight.viral.fast':
      '登録者数の{ratio}倍の再生回数で、登録者層を超えて急速に広がっています。',
    'video.insight.viral.steady':
      '登録者数の{ratio}倍の再生回数で、安定した広がりを見せています。',
    'video.insight.viral.core':
      '再生回数が登録者数の範囲内にとどまっており、主に既存の登録者を中心に視聴されているとみられます。',
    'video.insight.engagement.high':
      '再生回数に対する高評価率は{pct}%と高めで、視聴者の反応が良い動画です。',
    'video.insight.engagement.normal':
      '再生回数に対する高評価率は{pct}%と平均的な水準です。',
    'video.insight.engagement.low':
      '再生回数に対する高評価率は{pct}%とやや低めです。',
    'video.insight.pace':
      '投稿から{days}日が経過し、1日あたり平均約{n}回の再生が発生しています。',

    'lang.aria': '言語を選択',

    'notfound.title': 'ページが見つかりません',
    'notfound.desc': 'お探しのページは存在しないか、移動された可能性があります。',
    'notfound.backHome': 'ホームに戻る',
  },
};
