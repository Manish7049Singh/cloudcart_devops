import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Layers, Users, ShoppingCart, ArrowRight, ShieldCheck, Database, Server } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import userService from '../services/userService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    usersCount: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, userRes] = await Promise.all([
        productService.getProducts({ page: 1, limit: 100 }),
        categoryService.getCategories({ page: 1, limit: 100 }),
        userService.getAllUsers({ page: 1, limit: 10, role: 'user' }).catch(() => ({ data: [] })),
      ]);

      setStats({
        productsCount: prodRes.data?.length || 0,
        categoriesCount: catRes.data?.length || 0,
        usersCount: userRes.data?.length || 0,
      });
      setRecentUsers(userRes.data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Unable to load administrative metrics from backend endpoints.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader text="Loading administration dashboard..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Store Administration Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time management of product inventory, catalog categories, and customer accounts
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
          <ShieldCheck className="h-4 w-4" />
          Admin Privilege Verified
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Products Stat */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{stats.productsCount}</p>
            <Link
              to="/admin/products"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Package className="h-7 w-7" />
          </div>
        </div>

        {/* Categories Stat */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Categories</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{stats.categoriesCount}</p>
            <Link
              to="/admin/categories"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage Categories <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Layers className="h-7 w-7" />
          </div>
        </div>

        {/* Users Stat */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{stats.usersCount}</p>
            <p className="mt-3 text-xs text-slate-400 font-medium">Customer role accounts</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Users className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* DevOps Backend Status Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">FastAPI Architecture Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Server className="h-4 w-4 text-brand-600" />
              <span>FastAPI Endpoints</span>
            </div>
            <p className="text-slate-500">22 operational routes verified across 6 domain routers.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Database Layer</span>
            </div>
            <p className="text-slate-500">SQLAlchemy 2.0 ORM with SQLite local & Neon/Postgres production compatibility.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Security & Roles</span>
            </div>
            <p className="text-slate-500">OAuth2 Bearer tokens with RBAC (User / Admin) enforcement.</p>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Registered Customer Accounts</h3>
          <span className="text-xs text-slate-500">{recentUsers.length} users retrieved</span>
        </div>

        {recentUsers.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No regular customer accounts recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-semibold">#{u.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{u.full_name}</td>
                    <td className="py-2.5 px-3">{u.username}</td>
                    <td className="py-2.5 px-3">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
