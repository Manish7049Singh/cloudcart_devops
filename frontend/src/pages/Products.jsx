import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductSearch from '../components/products/ProductSearch';
import ErrorMessage from '../components/common/ErrorMessage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination State
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const categoryIdParam = searchParams.get('category');
  const selectedCategory = categoryIdParam ? parseInt(categoryIdParam, 10) : null;
  const sortBy = searchParams.get('sort') || '';

  const [searchInput, setSearchInput] = useState(search);
  const limit = 12;

  // Fetch categories once
  useEffect(() => {
    categoryService
      .getCategories({ page: 1, limit: 100 })
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Load products based on query params
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts({
        page,
        limit,
        search,
      });
      setProducts(res.data || []);
    } catch (err) {
      setError('Failed to retrieve products from the backend. Please check connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  // Client-side category filtering (backend GET /products/ filters by title search, category filtered via relations or client)
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter by category if selected
    if (selectedCategory) {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  // Handlers for URL search params
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSelectCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId.toString());
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSelectSort = (sortVal) => {
    const params = new URLSearchParams(searchParams);
    if (sortVal) {
      params.set('sort', sortVal);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse our full catalog of high-performance gear and electronics
          </p>
        </div>

        <ProductSearch
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
        />
      </div>

      {/* Filter Controls */}
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        sortBy={sortBy}
        onSelectSort={handleSelectSort}
        onResetFilters={handleResetFilters}
        totalResults={filteredAndSortedProducts.length}
      />

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={loadProducts} />}

      {/* Products Grid */}
      <ProductGrid
        products={filteredAndSortedProducts}
        isLoading={isLoading}
        emptyMessage={
          search || selectedCategory
            ? 'No products matched your search filters. Try clearing some filters.'
            : 'No products found.'
        }
      />

      {/* Pagination Bar */}
      {!isLoading && products.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-500">
            Page <span className="font-bold text-slate-800">{page}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={products.length < limit}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
