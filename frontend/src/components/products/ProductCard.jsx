import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import { formatCurrency, formatDiscount } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);

  // Calculate prices
  const price = product.price || 0;
  const discount = product.discount_percentage || 0;
  // If discount is specified, the effective sale price is either calculated or discounted
  const hasDiscount = discount > 0;
  const salePrice = hasDiscount ? price * (1 - discount / 100) : price;

  const fallbackImage =
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=60';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product, 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={!imageError && product.thumbnail ? product.thumbnail : fallbackImage}
          alt={product.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow">
            {formatDiscount(discount)}
          </span>
        )}

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
            <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Brand info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-brand-600 uppercase tracking-wider text-[10px]">
            {product.brand || 'Store Brand'}
          </span>
          {product.category?.name && (
            <span className="truncate max-w-[120px] text-slate-400">{product.category.name}</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`} className="group-hover:text-brand-600 transition">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-700">
            {product.rating ? product.rating.toFixed(1) : '4.5'}
          </span>
          <span className="text-xs text-slate-400">({product.stock || 10}+ in stock)</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-emerald-600 font-medium">
                  {discount}% off
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || isLoading || product.stock <= 0}
            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:scale-95 transition ${
              product.stock <= 0 ? 'opacity-50 cursor-not-allowed bg-slate-300' : ''
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
