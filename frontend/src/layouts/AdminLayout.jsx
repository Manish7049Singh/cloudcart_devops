import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">Admin Panel</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">E-Commerce Management</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-200 text-brand-800 font-bold text-sm">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-800">{user?.full_name || user?.username}</p>
              <span className="inline-block rounded bg-brand-100 px-1.5 py-0.2 text-[10px] font-semibold text-brand-700">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Return to Store */}
        <div className="p-4 border-t border-slate-200">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition justify-center shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Customer Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
