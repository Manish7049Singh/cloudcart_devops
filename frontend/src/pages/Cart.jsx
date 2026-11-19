import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export const Cart = () => {
  const {
    cartItems,
    isLoading,
    totalItemsCount,
    rawSubtotal,
    totalAmount,
    totalSavings,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to finalize your order.');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setIsCheckingOut(true);
    // Simulate order placement
    setTimeout(async () => {
      try {
        await clearCart();
        setIsCheckingOut(false);
        setCheckoutSuccess(true);
        toast.success('Order placed successfully!');
      } catch {
        setIsCheckingOut(false);
      }
    }, 1200);
  };

  if (checkoutSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Thank You for Your Order!</h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Your order has been processed and your cart has been cleared on the backend. A confirmation receipt has been simulated for your session.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            View Account
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader text="Loading your shopping cart..." size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalItemsCount > 0
              ? `You have ${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is currently empty'}
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">Your cart is empty</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our latest products and exclusive deals.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Item List */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs divide-y divide-slate-100">
            <div className="hidden sm:flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">
              <span>Product Details</span>
              <div className="flex gap-16 pr-8">
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>
            </div>

            {cartItems.map((item) => (
              <CartItem
                key={item.id || item.product_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                disabled={isLoading}
              />
            ))}

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
              {!isAuthenticated && (
                <span className="text-xs text-amber-600 font-medium">
                  Note: Sign in to persist cart items to your backend account.
                </span>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              rawSubtotal={rawSubtotal}
              totalAmount={totalAmount}
              totalSavings={totalSavings}
              itemCount={totalItemsCount}
              onCheckout={handleCheckout}
              isLoading={isCheckingOut}
            />
          </div>
        </div>
      )}

      {/* Confirm Clear Modal */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Clear Entire Cart?"
        message="Are you sure you want to remove all items from your shopping cart? This will delete the active cart on your backend account."
        confirmText="Clear Cart"
        isDestructive={true}
        onConfirm={async () => {
          await clearCart();
          setConfirmClearOpen(false);
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};

export default Cart;
