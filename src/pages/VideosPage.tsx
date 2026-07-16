import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/filters/FilterBar';
import Pagination from '../components/videos/Pagination';
import VideoList from '../components/videos/VideoList';
import { useSeoOverride } from '../components/seo/SeoOverrideContext';
import { SITE_URL } from '../config/site';
import { useI18n } from '../i18n/I18nContext';
import { useTrendingVideos } from '../hooks/useTrendingVideos';
import { useVideoFilters } from '../hooks/useVideoFilters';
import { filterByUploadWindow } from '../utils/filterByUploadWindow';
import { filterByVideoType } from '../utils/videoType';
import { searchVideos } from '../utils/searchVideos';
import { sortVideos } from '../utils/sortVideos';

const MAX_RESULTS = 100;
const PAGE_SIZE = 30;

export default function VideosPage() {
  const { t } = useI18n();
  const {
    searchQuery,
    setSearchQuery,
    country,
    setCountry,
    category,
    setCategory,
    uploadWindow,
    setUploadWindow,
    sort,
    setSort,
    videoType,
    setVideoType,
  } = useVideoFilters();
  const { videos, fallback, tooLittle, loading, error } = useTrendingVideos(
    country,
    category,
  );

  const [page, setPage] = useState(0);

  // 필터·정렬을 바꾸거나 검색어가 달라지면 상위 100개 이내로 자르고 다시 정렬한다.
  const shown = useMemo(
    () =>
      sortVideos(
        filterByVideoType(
          filterByUploadWindow(searchVideos(videos, searchQuery), uploadWindow),
          videoType,
        ),
        sort,
      ).slice(0, MAX_RESULTS),
    [videos, searchQuery, uploadWindow, sort, videoType],
  );

  const pageCount = Math.ceil(shown.length / PAGE_SIZE);

  // 필터가 바뀌어 결과가 달라지면 1페이지로 되돌린다.
  useEffect(() => {
    setPage(0);
  }, [country, category, uploadWindow, sort, searchQuery, videoType]);

  const pageItems = useMemo(
    () => shown.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [shown, page],
  );

  const itemListStructuredData = useMemo(() => {
    if (pageItems.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: pageItems.map((video, i) => ({
        '@type': 'ListItem',
        position: page * PAGE_SIZE + i + 1,
        url: `${SITE_URL}/video/${video.id}`,
        name: video.title,
      })),
    };
  }, [pageItems, page]);

  useSeoOverride(
    itemListStructuredData
      ? { structuredData: itemListStructuredData }
      : null,
  );

  return (
    <section>
      <h1 className="page-heading">{t('videos.h1')}</h1>
      <p className="page-intro">{t('videos.desc')}</p>
      <p className="page-guide">{t('videos.guide')}</p>
      <FilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        country={country}
        onCountryChange={setCountry}
        category={category}
        onCategoryChange={setCategory}
        uploadWindow={uploadWindow}
        onUploadWindowChange={setUploadWindow}
        sort={sort}
        onSortChange={setSort}
        videoType={videoType}
        onVideoTypeChange={setVideoType}
      />
      {loading && <p className="video-list__status">{t('common.loading')}</p>}
      {error && (
        <p className="video-list__status video-list__status--error">
          {t('video.error', { msg: error })}
        </p>
      )}
      {!loading && !error && (
        <>
          {videos.length > 0 && fallback && (
            <p className="video-list__notice">{t('videos.fallbackNotice')}</p>
          )}
          {videos.length > 0 && tooLittle && (
            <p className="video-list__notice video-list__notice--warning">
              {t('videos.tooLittleNotice')}
            </p>
          )}
          <VideoList
            videos={pageItems}
            emptyText={
              category === 'education' || category === 'beauty'
                ? t('videos.emptyCategoryHint')
                : undefined
            }
          />
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </section>
  );
}
