import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';
import Loader from '../common/Loader';

export const ProductGrid = ({ products = [], isLoading = false, emptyMessage = 'No products found.' }) => {
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader text="Loading products..." size="large" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">No products available</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
