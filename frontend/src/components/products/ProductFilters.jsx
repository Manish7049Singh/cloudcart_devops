import React from 'react';
import { Filter, X } from 'lucide-react';

export const ProductFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  onResetFilters,
  totalResults = 0,
}) => {
  const hasActiveFilters = Boolean(selectedCategory || sortBy);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          <Filter className="h-3.5 w-3.5" />
          Filter:
        </span>

        <button
          onClick={() => onSelectCategory(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            !selectedCategory
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Right Controls: Sort & Active Count */}
      <div className="flex items-center gap-3 justify-between md:justify-end">
        <span className="text-xs text-slate-500 font-medium">
          {totalResults} {totalResults === 1 ? 'item' : 'items'}
        </span>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => onSelectSort(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
        >
          <option value="">Default Sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 transition"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
