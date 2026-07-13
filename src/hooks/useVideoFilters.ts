import { useState } from 'react';
import type {
  Category,
  Country,
  SortOption,
  UploadWindow,
  VideoTypeFilter,
} from '../types/video';

export function useVideoFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState<Country>('global');
  const [category, setCategory] = useState<Category>('all');
  const [uploadWindow, setUploadWindow] = useState<UploadWindow>('week');
  const [sort, setSort] = useState<SortOption>('views-desc');
  const [videoType, setVideoType] = useState<VideoTypeFilter>('all');

  return {
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
  };
}
