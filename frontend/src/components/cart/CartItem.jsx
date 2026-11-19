import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const CartItem = ({ item, onUpdateQuantity, onRemove, disabled = false }) => {
  const [imageError, setImageError] = useState(false);
  const product = item.product || {};
  const productId = item.product_id || product.id;

  const fallbackImage =
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=60';

  const price = product.price || 0;
  const quantity = item.quantity || 1;
  const subtotal = item.subtotal != null ? item.subtotal : price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          to={`/products/${productId}`}
          className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
        >
          <img
            src={!imageError && product.thumbnail ? product.thumbnail : fallbackImage}
            alt={product.title || 'Product'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
            {product.brand || 'Brand'}
          </span>
          <Link
            to={`/products/${productId}`}
            className="text-sm font-semibold text-slate-800 hover:text-brand-600 transition line-clamp-1"
          >
            {product.title || `Product #${productId}`}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>Unit: {formatCurrency(price)}</span>
            {product.discount_percentage > 0 && (
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                {product.discount_percentage}% off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls & Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => onUpdateQuantity(productId, quantity - 1)}
            disabled={disabled || quantity <= 1}
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-xs font-bold text-slate-800">{quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(productId, quantity + 1)}
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 transition"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="w-24 text-right">
          <span className="text-sm font-bold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(productId)}
          disabled={disabled}
          className="p-1.5 text-slate-400 hover:text-red-600 transition"
          title="Remove from Cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
