import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
        Access Restricted
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        This portal requires administrative privileges. Your current account does not have authorization to view this resource.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Home className="h-4 w-4" />
          Return to Store
        </Link>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
