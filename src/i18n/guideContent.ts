import type { Lang } from './translations';
import type { LegalPage } from './legalContent';

export const guideContent: Record<Lang, LegalPage> = {
  ko: {
    title: '유튜브 트렌드로 콘텐츠 아이디어 찾는 법',
    updated: '최종 수정일: 2026년 7월',
    sections: [
      {
        heading: '지표부터 정확히 읽기',
        body: [
          '조회수는 "지금 얼마나 많은 사람이 봤는지"를, 좋아요 수는 "본 사람 중 얼마나 반응했는지"를 보여줍니다. 이 둘만 보면 규모가 큰 채널이 항상 상위에 오르지만, 정작 다른 채널이 참고할 만한 신호는 구독자 수 대비 조회수 배율에 있습니다. 이 배율이 높다는 건 채널의 기존 팬층을 넘어 알고리즘이 새로운 시청자에게 그 영상을 밀어주고 있다는 뜻이라, 지금 플랫폼이 어떤 형식·주제를 선호하는지 보여주는 더 직접적인 신호입니다.',
          'maze의 영상 목록에서 정렬을 "구독자 대비 조회수 높은순"으로 바꾸면 이 신호만 따로 걸러볼 수 있고, 급상승 채널 페이지에서는 아예 채널 단위로 같은 지표를 순위화해 보여줍니다.',
        ],
      },
      {
        heading: '큰 채널보다 작은 채널의 성공을 참고하기',
        body: [
          '구독자 수백만의 대형 채널이 만든 영상은 제작비·인력·기존 팬층이 성공 요인의 상당 부분을 차지해, 그대로 따라 하기 어렵습니다. 반면 구독자 수는 적지만 영상 하나가 갑자기 크게 터진 채널은, 주제나 연출 방식 자체가 좋아서 알고리즘의 선택을 받았을 가능성이 높습니다. 이런 사례일수록 소규모 채널이 참고하기에 현실적인 본보기가 됩니다.',
        ],
      },
      {
        heading: '국가 간 시차를 활용하기',
        body: [
          '트렌드는 국가마다 도착 시점이 다릅니다. 미국이나 일본에서 이미 화제가 된 형식·소재가 아직 한국에는 본격적으로 퍼지지 않은 경우가 흔합니다. maze에서 같은 카테고리를 국가별로 바꿔가며 살펴보면, 자국에 아직 오지 않은 트렌드를 먼저 포착해 선점할 기회를 찾을 수 있습니다. 반대로 세 국가 모두에서 동시에 보이는 주제는 지역에 국한되지 않는 보편적인 소재라는 뜻이므로, 더 넓은 시청자층을 노릴 때 참고할 수 있습니다.',
        ],
      },
      {
        heading: '키워드로 제목·태그 방향 잡기',
        body: [
          '트렌드 키워드 페이지는 각 국가의 인기 영상 제목에서 자주 등장한 단어를 모아 보여줍니다. 새 영상을 기획할 때 이 키워드를 제목이나 태그에 자연스럽게 녹이면, 현재 검색·추천 알고리즘이 주목하고 있는 주제와 맞아떨어질 확률이 높아집니다. 다만 실제 영상 내용과 무관한 키워드를 억지로 끼워 넣으면 시청 지속 시간이 떨어져 오히려 역효과가 날 수 있으니, 콘텐츠와 실제로 관련 있는 키워드만 골라 쓰는 것이 중요합니다.',
        ],
      },
      {
        heading: '쇼츠와 롱폼 트렌드를 따로 읽기',
        body: [
          '쇼츠(3분 이하)와 롱폼 영상은 알고리즘이 다르게 작동합니다. 쇼츠는 반복 재생·공유 속도가 성공 지표고, 롱폼은 시청 지속 시간이 핵심입니다. 같은 주제를 다뤄도 쇼츠에서 바이럴이 난 형식이 롱폼에서도 통한다는 보장은 없습니다.',
          'maze의 영상 목록에서 "영상 길이" 필터로 쇼츠와 롱폼을 분리해 보면, 각 형식에서 어떤 카테고리·주제가 두드러지는지 훨씬 또렷하게 보입니다. 지금 만들려는 영상 형식에 맞는 트렌드만 참고하는 것이 현실적인 벤치마킹입니다.',
        ],
      },
      {
        heading: '좋아요 비율로 시청자 반응 가늠하기',
        body: [
          '조회수가 높아도 좋아요 비율(좋아요 수 ÷ 조회수)이 낮은 영상은, 알고리즘이 눌렀지만 시청자 반응이 따라오지 않은 경우일 수 있습니다. 반대로 조회수는 평범한데 좋아요 비율이 5% 이상인 영상은 팬덤이 강하거나 내용이 매우 공감을 샀다는 뜻입니다.',
          '영상 상세 페이지에서는 좋아요 비율을 직접 확인할 수 있습니다. 같은 카테고리에서 좋아요 비율이 높은 영상을 찾아 제목 구성, 썸네일 방식, 영상 길이를 분석하면 단순 조회수 추종보다 훨씬 품질 있는 콘텐츠 아이디어를 얻을 수 있습니다.',
        ],
      },
      {
        heading: '트렌드 데이터를 콘텐츠 기획에 녹이는 실전 흐름',
        body: [
          '트렌드를 한 번 보고 마는 것과 기획 루틴에 넣는 것은 다릅니다. 실전에서 유용한 흐름은 이렇습니다: ① 주 1~2회 같은 카테고리를 점검해 반복적으로 오르는 주제나 형식을 메모합니다. ② "구독자 대비 조회수" 정렬로 알고리즘이 최근 밀어주는 소규모 채널의 패턴을 확인합니다. ③ 같은 카테고리를 다른 국가로 바꿔 보며 아직 국내에 퍼지지 않은 형식이 있는지 탐색합니다.',
          '이 세 단계는 특정 영상 하나를 모방하는 게 아니라, 지금 플랫폼이 선호하는 형식의 윤곽을 잡는 과정입니다. 트렌드에서 포착한 신호를 자신의 채널 주제와 어떻게 접목할지는 결국 크리에이터 본인의 판단이 필요하지만, 데이터를 정기적으로 살피는 습관 자체가 알고리즘 감각을 키워줍니다.',
        ],
      },
    ],
  },
  en: {
    title: 'How to Find Content Ideas from YouTube Trends',
    updated: 'Last updated: July 2026',
    sections: [
      {
        heading: 'Read the metrics correctly',
        body: [
          "View count tells you how many people have watched a video right now; like count tells you how many of those viewers reacted. Looking at these alone, large channels almost always come out on top — but the signal that's actually useful to other creators is the views-to-subscribers ratio. A high ratio means the algorithm pushed the video to viewers well beyond the channel's existing fanbase, which is a much more direct sign of what format or topic the platform currently favors.",
          'On maze, switching the video sort to "views vs. subscribers" isolates exactly this signal, and the Rising Channels page ranks channels by the same metric directly.',
        ],
      },
      {
        heading: "Learn from small channels' wins, not just big ones",
        body: [
          "A video from a channel with millions of subscribers succeeds partly because of budget, crew, and an existing fanbase — none of which is easy to copy. A small channel whose single video suddenly took off, on the other hand, likely succeeded because the topic or format itself resonated with the algorithm. Those cases make far more realistic models to learn from if you're running a smaller channel yourself.",
        ],
      },
      {
        heading: 'Use the gap between countries',
        body: [
          "Trends don't land in every country at the same time. A format or topic that's already big in the US or Japan often hasn't fully caught on in Korea yet. Switching the same category across countries on maze lets you spot a trend before it arrives in your home market and get ahead of it. Conversely, a topic that shows up in all three countries at once is universal rather than regional — useful when you're aiming for a broader audience.",
        ],
      },
      {
        heading: 'Use keywords to shape titles and tags',
        body: [
          "The Trending Keywords page collects the words that appear most often in each country's popular video titles. Working these naturally into your own titles or tags increases the odds of matching what search and recommendation algorithms are currently favoring. That said, forcing in a keyword that has nothing to do with your actual content tends to hurt watch time and backfire — only use keywords that genuinely fit what the video is about.",
        ],
      },
      {
        heading: 'Read Shorts and longform trends separately',
        body: [
          "Shorts (under 3 minutes) and longform videos operate under different algorithmic logic. Shorts succeed on replay rate and share velocity; longform succeeds on sustained watch time. A format that goes viral as a Short does not automatically translate to longform, and vice versa.",
          'Use the video length filter on maze to split the two apart and see which categories and topics stand out in each format. Benchmarking against the format you actually plan to make gives you far more actionable signal than mixing them together.',
        ],
      },
      {
        heading: 'Use the like rate to gauge audience response',
        body: [
          'A video with high view counts but a low like rate may have been pushed by the algorithm without genuine audience buy-in — sometimes a sign of clickbait or controversy rather than quality. Conversely, a video with a modest view count but a like rate above 5% shows strong audience approval.',
          "On each video's detail page, you can see the like rate directly. Finding videos in your category with a high like rate and analyzing their title structure, thumbnail approach, and video length will give you far better content ideas than chasing raw view counts alone.",
        ],
      },
      {
        heading: 'Building trend data into your content planning routine',
        body: [
          'Glancing at trends once is different from building them into a repeatable workflow. A practical approach: ① Check the same category once or twice a week and note topics or formats that keep showing up. ② Switch to the "views vs. subscribers" sort to see what formats the algorithm is currently rewarding for smaller channels. ③ Swap the same category across countries to spot formats that have not yet arrived in your home market.',
          "None of this is about copying a single video — it's about reading the shape of what the platform currently favors. How you map those signals onto your own channel topic still requires your own judgment, but the habit of checking regularly builds an intuition for algorithmic trends that's hard to get any other way.",
        ],
      },
    ],
  },
  ja: {
    title: 'YouTubeトレンドからコンテンツのヒントを見つける方法',
    updated: '最終更新日: 2026年7月',
    sections: [
      {
        heading: '指標を正しく読む',
        body: [
          '再生回数は「今どれだけの人が見たか」を、高評価数は「見た人のうちどれだけが反応したか」を示します。この二つだけを見ると、規模の大きいチャンネルが常に上位に来ますが、他のチャンネルが本当に参考にすべき信号は登録者数に対する再生回数の倍率にあります。この倍率が高いということは、チャンネルの既存ファン層を超えて、アルゴリズムが新しい視聴者にその動画を届けているということであり、今プラットフォームがどんな形式・テーマを好んでいるかをより直接的に示す信号です。',
          'mazeの動画一覧で並べ替えを「登録者比の再生回数順」に変えると、この信号だけを絞り込んで見ることができ、急上昇チャンネルページではチャンネル単位で同じ指標をランキングしています。',
        ],
      },
      {
        heading: '大手より小規模チャンネルの成功を参考にする',
        body: [
          '登録者数百万の大手チャンネルが作る動画は、制作費・スタッフ・既存のファン層が成功要因の大部分を占めており、そのまま真似するのは難しいものです。一方、登録者数は少ないのに一本の動画が急に伸びたチャンネルは、テーマや演出そのものがアルゴリズムに評価された可能性が高いです。こうした事例のほうが、小規模チャンネルにとって現実的な手本になります。',
        ],
      },
      {
        heading: '国ごとの時差を活用する',
        body: [
          'トレンドが各国に届くタイミングは異なります。アメリカや日本ですでに話題になっている形式・題材が、日本以外の地域ではまだ本格的に広がっていないことがよくあります。mazeで同じカテゴリを国ごとに切り替えて見ることで、自国にまだ来ていないトレンドをいち早く見つけ、先取りするチャンスを探せます。逆に三カ国すべてで同時に見られるテーマは、地域を問わない普遍的な話題ということなので、より幅広い視聴者層を狙う際の参考になります。',
        ],
      },
      {
        heading: 'キーワードでタイトル・タグの方向性を決める',
        body: [
          'トレンドキーワードページは、各国の人気動画タイトルに頻出する単語を集めて表示します。新しい動画を企画する際にこれらのキーワードをタイトルやタグに自然に取り入れると、今の検索・レコメンドアルゴリズムが注目しているテーマと合致しやすくなります。ただし、動画の内容と無関係なキーワードを無理に入れると視聴維持率が下がり逆効果になることがあるため、実際の内容と関連のあるキーワードだけを選んで使うことが重要です。',
        ],
      },
      {
        heading: 'ショートとロング動画のトレンドを分けて読む',
        body: [
          'ショート（3分以内）とロング動画では、アルゴリズムの動作原理が異なります。ショートは繰り返し再生・シェア速度が成功指標であり、ロング動画は視聴継続時間が鍵を握ります。ショートでバズったフォーマットがロング動画でも通用するとは限りません。',
          'mazeの動画一覧で「動画の長さ」フィルターを使ってショートとロング動画を分けて見ると、それぞれのフォーマットでどのカテゴリや題材が目立っているかがより明確になります。自分が作ろうとしている動画のフォーマットに合ったトレンドだけを参考にすることが、現実的なベンチマークになります。',
        ],
      },
      {
        heading: '高評価率で視聴者反応を見極める',
        body: [
          '再生回数が多くても高評価率（高評価数÷再生回数）が低い動画は、アルゴリズムが後押ししたものの視聴者の支持が伴っていない場合があります。逆に再生回数が平均的でも高評価率が5%を超えている動画は、ファン層が強いか内容への共感が非常に高いことを示しています。',
          '各動画の詳細ページでは高評価率を直接確認できます。同じカテゴリで高評価率の高い動画を探し、タイトル構成・サムネイルのアプローチ・動画の長さを分析することで、単純な再生回数の追随よりも質の高いコンテンツアイデアが得られます。',
        ],
      },
      {
        heading: 'トレンドデータをコンテンツ企画に組み込む実践的な流れ',
        body: [
          'トレンドを一度見て終わりにするのと、企画ルーティンに組み込むのとでは大きな差があります。実践的な流れはこうです：① 週1〜2回、同じカテゴリを確認し、繰り返し登場するテーマやフォーマットをメモします。② 「登録者比の再生回数順」に並べ替えて、アルゴリズムが現在後押ししている小規模チャンネルのパターンを確認します。③ 同じカテゴリを別の国に切り替えて、まだ自国に浸透していないフォーマットを探します。',
          'これらは特定の動画を真似ることが目的ではなく、今プラットフォームが好むフォーマットの輪郭をつかむプロセスです。トレンドから読み取ったヒントを自分のチャンネルテーマにどう活かすかは最終的にクリエイター自身の判断が必要ですが、定期的にデータを確認する習慣そのものが、アルゴリズムへの感覚を磨いてくれます。',
        ],
      },
    ],
  },
};
