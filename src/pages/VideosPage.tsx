import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/filters/FilterBar';
import Pagination from '../components/videos/Pagination';
import VideoList from '../components/videos/VideoList';
import { useI18n } from '../i18n/I18nContext';
import { useTrendingVideos } from '../hooks/useTrendingVideos';
import { useVideoFilters } from '../hooks/useVideoFilters';
import { filterByUploadWindow } from '../utils/filterByUploadWindow';
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
  } = useVideoFilters();
  const { videos, loading, error } = useTrendingVideos(country, category);

  const [page, setPage] = useState(0);

  // 필터·정렬을 바꾸거나 검색어가 달라지면 상위 100개 이내로 자르고 다시 정렬한다.
  const shown = useMemo(
    () =>
      sortVideos(
        filterByUploadWindow(searchVideos(videos, searchQuery), uploadWindow),
        sort,
      ).slice(0, MAX_RESULTS),
    [videos, searchQuery, uploadWindow, sort],
  );

  const pageCount = Math.ceil(shown.length / PAGE_SIZE);

  // 필터가 바뀌어 결과가 달라지면 1페이지로 되돌린다.
  useEffect(() => {
    setPage(0);
  }, [country, category, uploadWindow, sort, searchQuery]);

  const pageItems = shown.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section>
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
      />
      {loading && <p className="video-list__status">{t('common.loading')}</p>}
      {error && (
        <p className="video-list__status video-list__status--error">
          {t('video.error', { msg: error })}
        </p>
      )}
      {!loading && !error && (
        <>
          <VideoList videos={pageItems} />
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </section>
  );
}
