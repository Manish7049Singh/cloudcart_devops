import React from 'react';
import { Search, X } from 'lucide-react';

export const ProductSearch = ({ value, onChange, onSubmit, onClear, placeholder = 'Search products...' }) => {
  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-lg">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition shadow-xs"
      />
      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

export default ProductSearch;
