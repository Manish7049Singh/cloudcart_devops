import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, PackageCheck, Search } from 'lucide-react';
import categoryService from '../services/categoryService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await categoryService.getCategories({ page: 1, limit: 100, search });
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Unable to fetch categories from the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse our catalog organized by product categories and department
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadCategories} />}

      {isLoading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader text="Loading categories..." size="large" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Layers className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-base font-bold text-slate-800">No categories found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {search ? 'Try adjusting your search criteria.' : 'No categories currently registered in the database.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-500 hover:shadow-md transition duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  ID: #{category.id}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Discover curated products in {category.name}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-brand-600">
                <span>View Products</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
