import React from 'react';
import { ShieldCheck, Truck, ArrowRight, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const CartSummary = ({
  rawSubtotal = 0,
  totalAmount = 0,
  totalSavings = 0,
  itemCount = 0,
  onCheckout,
  isLoading = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
        Order Summary
      </h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items ({itemCount})</span>
          <span className="font-medium text-slate-900">{formatCurrency(rawSubtotal)}</span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Special Promotional Savings</span>
            <span className="font-semibold">-{formatCurrency(totalSavings)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-slate-400" />
            Standard Delivery
          </span>
          <span className="font-medium text-emerald-600 uppercase text-xs font-bold">Free</span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total</span>
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-900">
              {formatCurrency(totalAmount)}
            </span>
            <p className="text-[10px] text-slate-400">Includes all applicable taxes</p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={isLoading || itemCount === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <CreditCard className="h-4 w-4" />
        Proceed to Secure Checkout
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Trust Badges */}
      <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Encrypted 256-bit SSL transaction</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-brand-600 flex-shrink-0" />
          <span>Fast delivery with real-time tracking</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
