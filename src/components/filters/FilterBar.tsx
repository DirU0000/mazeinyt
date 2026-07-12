import type { Category, Country, SortOption, UploadWindow } from '../../types/video';
import {
  categoryOptions,
  countryOptions,
  sortOptions,
  uploadWindowOptions,
} from '../../data/options';
import { useI18n } from '../../i18n/I18nContext';
import FilterPills from './FilterPills';
import IconSelect from './IconSelect';
import SearchBar from './SearchBar';
import './FilterBar.css';

export default function FilterBar({
  searchQuery,
  onSearchQueryChange,
  country,
  onCountryChange,
  category,
  onCategoryChange,
  uploadWindow,
  onUploadWindowChange,
  sort,
  onSortChange,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  country: Country;
  onCountryChange: (value: Country) => void;
  category: Category;
  onCategoryChange: (value: Category) => void;
  uploadWindow: UploadWindow;
  onUploadWindowChange: (value: UploadWindow) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <SearchBar value={searchQuery} onChange={onSearchQueryChange} />
      </div>
      <div className="filter-bar__row">
        <span className="filter-bar__label">{t('filter.country')}</span>
        <FilterPills
          options={countryOptions}
          value={country}
          onChange={onCountryChange}
          ariaLabel={t('filter.countryAria')}
        />
      </div>
      <div className="filter-bar__row">
        <span className="filter-bar__label">{t('filter.category')}</span>
        <FilterPills
          options={categoryOptions}
          value={category}
          onChange={onCategoryChange}
          ariaLabel={t('filter.categoryAria')}
        />
      </div>
      <div className="filter-bar__row filter-bar__row--sort">
        <span className="filter-bar__label">{t('filter.period')}</span>
        <IconSelect
          icon="calendar"
          value={uploadWindow}
          onChange={onUploadWindowChange}
          options={uploadWindowOptions}
          ariaLabel={t('filter.periodAria')}
        />
      </div>
      <div className="filter-bar__row filter-bar__row--sort">
        <span className="filter-bar__label">{t('filter.sort')}</span>
        <IconSelect
          icon="chart"
          value={sort}
          onChange={onSortChange}
          options={sortOptions}
          ariaLabel={t('filter.sortAria')}
        />
      </div>
    </div>
  );
}
