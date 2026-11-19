import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, RotateCcw, Headphones, PackageCheck } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductGrid from '../components/products/ProductGrid';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts({ page: 1, limit: 8 }),
        categoryService.getCategories({ page: 1, limit: 6 }),
      ]);
      setFeaturedProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error('Failed to load homepage data:', err);
      setError('Unable to connect to the store catalog. Ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-slate-900 to-brand-900 opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              DevOps-Engineered E-Commerce Experience
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Curated Electronics & Lifestyle Essentials.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Explore premium gear, smart devices, and high-performance audio with seamless cloud integration, real-time cart persistence, and instant checkout.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-500 transition"
              >
                Shop All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Badges */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instant Delivery</h4>
              <p className="text-xs text-slate-500">Fast insured dispatch</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Secure Payments</h4>
              <p className="text-xs text-slate-500">256-bit encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Easy 30-Day Returns</h4>
              <p className="text-xs text-slate-500">Hassle-free guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Dedicated Support</h4>
              <p className="text-xs text-slate-500">Expert assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Popular Categories</h2>
              <p className="text-sm text-slate-500">Find the gear tailored to your daily workflow</p>
            </div>
            <Link
              to="/categories"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center shadow-xs hover:border-brand-500 hover:shadow-md transition"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-brand-600 transition">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>
            <p className="text-sm text-slate-500">Hand-selected best sellers with top customer ratings</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error && <ErrorMessage message={error} onRetry={loadData} className="mb-6" />}

        {isLoading ? (
          <div className="py-16 flex justify-center">
            <Loader text="Loading featured products..." size="large" />
          </div>
        ) : (
          <ProductGrid products={featuredProducts} emptyMessage="No featured products currently available." />
        )}
      </section>
    </div>
  );
};

export default Home;
